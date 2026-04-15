# 📁 Projects Overview

---

## 🚀 Active Projects
```dataview
TABLE
priority,
status,
modified,
created
FROM "01 Projects"
WHERE type = "project" AND status = "active"
SORT priority DESC
```

---

## 🟡 Paused Projects
```dataview
TABLE
modified
FROM "01 Projects"
WHERE type = "project" AND status = "paused"
SORT modified DESC
```

---

## 🧊 Stale Projects (No recent activity)
```dataview
TABLE
modified
FROM "01 Projects"
WHERE type = "project" AND status = "active"
AND (date(today) - file.mtime).day > 14
SORT modified ASC
```

---

## 🏁 Completed Projects
```dataview
TABLE modified
FROM "01 Projects"
WHERE type = "project" AND status = "completed"
SORT modified DESC
```