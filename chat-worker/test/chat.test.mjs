import test from 'node:test';
import assert from 'node:assert/strict';
import { handle, toContents, replyText } from '../src/chat.js';

const env = { ALLOWED_ORIGINS: 'https://mayukh-d.github.io,http://localhost:8765', GEMINI_MODEL: 'm', GEMINI_API_KEY: 'k' };
const req = (body, origin = 'https://mayukh-d.github.io', method = 'POST', path = '/chat') =>
  new Request('https://w.example' + path, { method, headers: { Origin: origin, 'Content-Type': 'application/json' }, body: method === 'POST' ? JSON.stringify(body) : undefined });
const ok = reply => async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: reply }] } }] }));

test('answers a question and sends the profile as the system prompt', async () => {
  let sent;
  const res = await handle(req({ messages: [{ role: 'user', text: 'Where does he work?' }] }), env, 'PROFILE-TEXT',
    async (url, init) => { sent = { url, init }; return ok('At Eccoi.')(); });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { reply: 'At Eccoi.' });
  assert.match(sent.url, /models\/m:generateContent$/);
  assert.equal(sent.init.headers['x-goog-api-key'], 'k');
  const body = JSON.parse(sent.init.body);
  assert.match(body.systemInstruction.parts[0].text, /PROFILE-TEXT$/);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://mayukh-d.github.io');
});

test('rejects other origins without calling Gemini', async () => {
  let called = false;
  const res = await handle(req({ messages: [{ role: 'user', text: 'hi' }] }, 'https://evil.example'), env, '', async () => { called = true; });
  assert.equal(res.status, 403);
  assert.equal(called, false);
});

test('rate limiter blocks before Gemini', async () => {
  let called = false;
  const res = await handle(req({ messages: [{ role: 'user', text: 'hi' }] }), { ...env, LIMITER: { limit: async () => ({ success: false }) } }, '', async () => { called = true; });
  assert.equal(res.status, 429);
  assert.equal(called, false);
});

test('preflight, wrong path and bad bodies', async () => {
  assert.equal((await handle(req(null, 'https://mayukh-d.github.io', 'OPTIONS'), env, '')).status, 204);
  assert.equal((await handle(req({}, 'https://mayukh-d.github.io', 'POST', '/other'), env, '')).status, 404);
  assert.equal((await handle(req({ messages: 'nope' }), env, '')).status, 400);
  assert.equal((await handle(req({ messages: [{ role: 'model', text: 'hi' }] }), env, '')).status, 400);
});

test('missing key and upstream failures give friendly errors', async () => {
  const q = { messages: [{ role: 'user', text: 'hi' }] };
  assert.equal((await handle(req(q), { ...env, GEMINI_API_KEY: '' }, '')).status, 503);
  assert.equal((await handle(req(q), env, '', async () => new Response('', { status: 429 }))).status, 503);
  assert.equal((await handle(req(q), env, '', async () => new Response('', { status: 500 }))).status, 502);
  assert.equal((await handle(req(q), env, '', async () => { throw new Error('down'); })).status, 502);
});

test('history is trimmed, capped and must end with the visitor', () => {
  const long = Array.from({ length: 20 }, (_, i) => ({ role: i % 2 ? 'model' : 'user', text: 'x'.repeat(2000) }));
  long.push({ role: 'user', text: 'last' });
  const c = toContents(long);
  assert.ok(c.length <= 8);
  assert.equal(c[0].role, 'user');
  assert.ok(c.every(t => t.parts[0].text.length <= 600));
  assert.equal(c.at(-1).parts[0].text, 'last');
});

test('em dashes are stripped from replies', () => {
  assert.equal(replyText({ candidates: [{ content: { parts: [{ text: 'Eccoi—Canberra' }] } }] }), 'Eccoi, Canberra');
});
