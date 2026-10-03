import PROFILE from '../profile.md';
import { handle } from './chat.js';

export default {
  fetch: (request, env) => handle(request, env, PROFILE),
};
