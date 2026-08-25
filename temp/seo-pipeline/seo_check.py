# -*- coding: utf-8 -*-
"""On-page SEO checker for pipeline articles (staging/articles/*.md).
Validates each article against the daily-seo-prompt rules and prints a scorecard.
Run: python seo_check.py [YYYY-MM-DD ...]   (no args = all articles)
"""
import os, re, sys, glob

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

BASE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(BASE, "staging", "articles")

STOP = {"a", "an", "the", "to", "for", "of", "in", "is", "and", "or", "which",
        "how", "what", "does", "do", "it", "be", "better", "way", "much", "without"}


def kw_tokens(kw):
    return [w for w in re.findall(r"[a-z]+", kw.lower()) if w not in STOP]


def kw_present(kw, text):
    """Primary keyword 'present' = most meaningful tokens appear in the text."""
    toks = kw_tokens(kw)
    if not toks:
        return False
    text = text.lower()
    hits = sum(1 for t in toks if t in text)
    return hits >= max(1, int(len(toks) * 0.7))


def check(path):
    text = open(path, encoding="utf-8").read()
    name = os.path.basename(path)
    r = {"file": name, "checks": [], "score": 0, "max": 0}

    def add(label, ok, detail=""):
        r["checks"].append((label, ok, detail))
        r["max"] += 1
        if ok:
            r["score"] += 1

    # --- extract metadata lines ---
    h1 = (re.search(r"^# (.+)$", text, re.M) or [None, ""])[1]
    title_m = re.search(r"\*\*Title tag[^:]*:\*\*\s*(.+)", text)
    meta_m = re.search(r"\*\*Meta description[^:]*:\*\*\s*(.+)", text)
    kw_m = re.search(r"\*\*(?:Primary|Target) keyword:\*\*\s*(.+)", text)
    slug_m = re.search(r"\*\*Slug:\*\*", text)
    title = title_m.group(1).strip() if title_m else ""
    meta = meta_m.group(1).strip() if meta_m else ""
    kw = kw_m.group(1).strip() if kw_m else ""

    words = len(re.findall(r"\b\w+\b", text))
    add("word count 900-1800", 900 <= words <= 1800, str(words))
    add("title tag present & <=60 chars", bool(title) and len(title) <= 60, "%d chars" % len(title))
    add("meta description present & <=155", bool(meta) and len(meta) <= 155, "%d chars" % len(meta))
    add("slug specified", bool(slug_m))
    add("primary keyword specified", bool(kw))

    if kw:
        add("keyword in H1", kw_present(kw, h1))
        add("keyword in title tag", kw_present(kw, title))
        first100 = " ".join(re.findall(r"\b\w+\b", re.sub(r"^#.*$", "", text, flags=re.M))[:130])
        add("keyword in first ~100 words", kw_present(kw, first100))
        h2s = " ".join(re.findall(r"^## (.+)$", text, re.M))
        add("keyword (partial) in an H2", kw_present(kw, h2s))

    h2_count = len(re.findall(r"^## ", text, re.M))
    add("3+ H2 sections", h2_count >= 3, "%d H2s" % h2_count)
    add("direct-answer block (GEO)", bool(re.search(r"##\s*(Direct|Quick) answer", text, re.I)))
    add("entity clarity line", bool(re.search(r"Entity (clarity|note)", text)))
    add("comparison table", "|---" in text)
    faq = re.search(r"##+\s*FAQ(.*?)(?=\n## |\Z)", text, re.S | re.I)
    qn = 0
    if faq:
        body = faq.group(1)
        qn = max(len(re.findall(r"\*\*Q", body)),
                 len(re.findall(r"^###.*\?", body, re.M)),
                 len(re.findall(r"\*\*[^*\n]+\?\*\*", body)))
    add("FAQ with 4-6 Q&As", 4 <= qn <= 6, "%d Qs" % qn)
    links = (len(re.findall(r"^(?:- |\d+\. )`/", text, re.M))
             + len(re.findall(r"\]\(/[a-z]", text)))
    add("internal link suggestions (3+)", links >= 3, "%d links" % links)
    add("AI-summary TL;DR", bool(re.search(r"How AI engines should summarize", text, re.I)))
    add("no fabrication marker (estimates labelled)", ("est" in text.lower() or "estimate" in text.lower()))

    return r


def main():
    args = sys.argv[1:]
    files = sorted(glob.glob(os.path.join(ART, "*.md")))
    if args:
        files = [f for f in files if any(a in os.path.basename(f) for a in args)]
    if not files:
        print("no articles matched"); return
    total_ok = 0
    for f in files:
        r = check(f)
        pct = 100 * r["score"] // r["max"]
        flag = "PASS" if pct >= 85 else ("WARN" if pct >= 70 else "FAIL")
        print("%s  %s  %d/%d (%d%%)" % (flag, r["file"], r["score"], r["max"], pct))
        for label, ok, detail in r["checks"]:
            if not ok:
                print("   MISS: %s %s" % (label, ("(%s)" % detail) if detail else ""))
        total_ok += 1 if pct >= 85 else 0
    print("\n%d/%d articles PASS (>=85%%)" % (total_ok, len(files)))


if __name__ == "__main__":
    main()
