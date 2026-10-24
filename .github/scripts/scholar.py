#!/usr/bin/env python3
"""Refresh the Google Scholar numbers on the site from the public profile page.

Writes assets/scholar.json (read by the GitHub profile README's metrics panel) and the
numbers marked data-scholar="..." in index.html. Scholar has no API and blocks cloud
runners, so in Actions the numbers come through SerpApi (SERPAPI_KEY, a repo secret);
without a key the profile page is read directly, which works from a home connection.
If neither answers, nothing changes and the last good numbers stay up.
"""

import datetime as dt
import json
import os
import re
import sys
import urllib.parse
import urllib.request

AUTHOR = "slmJwmkAAAAJ"
PROFILE = f"https://scholar.google.com/citations?user={AUTHOR}&hl=en"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"


def read_serpapi(key):
    query = urllib.parse.urlencode({"engine": "google_scholar_author", "author_id": AUTHOR, "hl": "en", "api_key": key})
    with urllib.request.urlopen(f"https://serpapi.com/search.json?{query}", timeout=60) as r:
        data = json.load(r)
    # cited_by.table is [{"citations": {"all": ..}}, {"h_index": {..}}, {"i10_index": {..}}]
    table = {k: v["all"] for row in data.get("cited_by", {}).get("table", []) for k, v in row.items()}
    if not {"citations", "h_index", "i10_index"} <= table.keys():
        return None
    return {"citations": table["citations"], "h_index": table["h_index"], "i10_index": table["i10_index"]}


def read_page():
    req = urllib.request.Request(PROFILE, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=30) as r:
        html = r.read().decode("utf-8", "replace")
    # The stats table: citations, h-index, i10-index, each as (all time, since year).
    cells = [int(n) for n in re.findall(r'class="gsc_rsb_std">(\d+)<', html)]
    if len(cells) < 6:
        return None
    return {"citations": cells[0], "h_index": cells[2], "i10_index": cells[4]}


def main():
    try:
        key = os.environ.get("SERPAPI_KEY")
        stats = read_serpapi(key) if key else read_page()
    except Exception as e:
        # str(e) never includes the request URL, so the key can't leak into the log
        print(f"Scholar unreachable ({type(e).__name__}: {e}); keeping the last numbers")
        return
    if not stats:
        print("No stats in the response (a CAPTCHA, or an empty SerpApi result); keeping the last numbers")
        return

    with open("assets/scholar.json") as f:
        old = json.load(f)
    if all(old.get(k) == v for k, v in stats.items()):
        print("no change:", stats)
        return

    today = dt.date.today()
    stats["as_of"] = today.isoformat()
    stats["profile"] = PROFILE.split("&")[0]
    with open("assets/scholar.json", "w") as f:
        json.dump(stats, f, indent=2)
        f.write("\n")

    with open("index.html") as f:
        page = f.read()
    for key, value in [("citations", stats["citations"]), ("h-index", stats["h_index"]),
                       ("as-of", today.strftime("%B %Y"))]:
        page = re.sub(rf'(data-scholar="{key}">)[^<]*', rf"\g<1>{value}", page)
    with open("index.html", "w") as f:
        f.write(page)
    print("updated:", old, "->", stats)


if __name__ == "__main__":
    sys.exit(main())
