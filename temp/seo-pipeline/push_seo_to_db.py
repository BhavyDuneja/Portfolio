# -*- coding: utf-8 -*-
"""Push today's SEO/GEO summary into Supabase `seo_daily` so the admin panel shows it live.
Reads today's files from staging/ (article, audit, serp, geo) and upserts one row for the day.
Reads Supabase URL/key from the repo's .env.local at runtime. Stdlib only (urllib).
Run after the daily SEO job (wired into run-daily-seo.cmd)."""
import os, sys, json, glob, re, datetime, urllib.request, urllib.parse
try: sys.stdout.reconfigure(encoding="utf-8")
except Exception: pass

BASE = os.path.dirname(os.path.abspath(__file__))
STAGING = os.path.join(BASE, "staging")
REPO_ROOT = os.path.normpath(os.path.join(BASE, "..", ".."))

def log(*a): print("[seo-push]", *a)

def read_env():
    url = key = None
    p = os.path.join(REPO_ROOT, ".env.local")
    if not os.path.exists(p):
        return None, None
    for line in open(p, encoding="utf-8", errors="ignore"):
        line = line.strip()
        if line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
            url = line.split("=", 1)[1].strip().strip('"').strip("'")
        elif line.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY="):
            key = line.split("=", 1)[1].strip().strip('"').strip("'")
    return url, key

def read_first(pattern):
    files = sorted(glob.glob(pattern))
    if not files:
        return None, None
    return files[0], open(files[0], encoding="utf-8", errors="ignore").read()

def main():
    url, key = read_env()
    if not url or not key:
        log("Supabase env not found in .env.local — skipping push."); return
    today = datetime.date.today().isoformat()

    art_file, art = read_first(os.path.join(STAGING, "articles", today + "-*.md"))
    if not art:
        log("no article for", today, "— nothing to push."); return
    _, audit = read_first(os.path.join(STAGING, "audits", today + "-audit.md"))
    _, serp = read_first(os.path.join(STAGING, "keyword-research", today + "-serp.md"))
    _, geo = read_first(os.path.join(STAGING, "geo-reports", today + "-geo.md"))

    title_m = re.search(r"^# (.+)$", art, re.M)
    title = title_m.group(1).strip() if title_m else (os.path.basename(art_file or "").replace(today + "-", "").replace(".md", ""))
    meta_m = re.search(r"(?im)meta description[:*]*\s*(.+)", art)
    meta = meta_m.group(1).strip(" *") if meta_m else None

    target = None
    cov = os.path.join(BASE, "coverage-log.json")
    if os.path.exists(cov):
        try:
            covered = json.load(open(cov, encoding="utf-8")).get("covered", [])
            if covered:
                last = covered[-1]
                target = last.get("target") if isinstance(last, dict) else last
        except Exception: pass

    row = {
        "day": today, "target": target, "article_title": title,
        "article_content": art[:20000], "meta_description": meta,
        "audit_text": (audit or "")[:12000] or None,
        "serp_text": (serp or "")[:12000] or None,
        "geo_text": (geo or "")[:12000] or None,
    }

    endpoint = url.rstrip("/") + "/rest/v1/seo_daily"
    headers = {
        "apikey": key, "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
    }

    # delete any existing row for today (one row per day), then insert
    try:
        req = urllib.request.Request(endpoint + "?day=eq." + today, method="DELETE", headers=headers)
        urllib.request.urlopen(req, timeout=30).read()
    except Exception as e:
        log("delete (ok to ignore if none):", e)

    try:
        data = json.dumps(row).encode("utf-8")
        req = urllib.request.Request(endpoint, data=data, method="POST",
                                     headers={**headers, "Prefer": "return=minimal"})
        urllib.request.urlopen(req, timeout=30).read()
        log("pushed SEO summary for", today, "| target:", target, "| title:", title[:50])
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "ignore")
        log("push failed:", e.code, body[:300], "— is the seo_daily table created in Supabase?")
    except Exception as e:
        log("push error:", e)

if __name__ == "__main__":
    main()
