import json, re, sys
items, cur, date, page = [], None, None, None
for line in open(sys.argv[1]):
    line = line.rstrip("\n").strip()
    if not line or line.startswith("# "):
        continue
    if line.startswith("## "):
        m = re.search(r"page ~?(\d+)", line)
        page = int(m.group(1)) if m else page
        date = "2026-10-26" if page >= 37 else "2026-10-25"
        continue
    if line.startswith(("EVENT|", "NOTE|")):
        kind, time, title = line.split("|", 2)
        cur = {"id": len(items) + 1, "date": date, "time": time or None, "kind": kind.lower(),
               "title": title, "page": page}
        if kind == "EVENT":
            cur["group"] = "Group" in title
            cur["entries"] = []
        items.append(cur)
        continue
    cur["entries"].append(line)
json.dump(items, open(sys.argv[2], "w"), indent=2, ensure_ascii=False)
print(len(items), "items")
