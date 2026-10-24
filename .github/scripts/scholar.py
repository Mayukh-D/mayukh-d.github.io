#!/usr/bin/env python3
"""Refresh the Google Scholar numbers on the site from the public profile page.

Writes assets/scholar.json (read by the GitHub profile README's metrics panel) and the
numbers marked data-scholar="..." in index.html. Scholar has no API and sometimes serves
a CAPTCHA to cloud runners; if the page can't be read, nothing changes and the last
good numbers stay up.
"""

import datetime as dt
import json
import re
import sys
import urllib.request

PROFILE = "https://scholar.google.com/citations?user=slmJwmkAAAAJ&hl=en"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"


def read():
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
        stats = read()
    except Exception as e:
        print(f"Scholar unreachable ({e}); keeping the last numbers")
        return
    if not stats:
        print("Scholar served no stats table (likely a CAPTCHA); keeping the last numbers")
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
