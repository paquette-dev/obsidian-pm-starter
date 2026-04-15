# 🧠 Executive Overview

---

## 📊 Project Health Summary
```dataview
TABLE
status,
priority,
modified
FROM "01 Projects"
WHERE type = "project"
SORT priority DESC
```

---

## ⚡ Workload (Open Tasks)
```tasks
not done
```

---

## 🚨 Attention Needed
```dataview
TABLE status, modified
FROM "01 Projects"
WHERE status = "paused" OR status = "stuck"
```

---

## 🧭 System Status
- Active Projects:
```dataview
LIST
FROM "01 Projects"
WHERE status = "active"
```