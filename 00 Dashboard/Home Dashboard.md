# 🧭 Home Dashboard

> Your daily command center

---

## 🚀 Start Here
- [[00 Dashboard/One-click Setup Guide|One-click Setup Guide]]
- [[00 Dashboard/Projects Overview|Projects Overview]]
- [[00 Dashboard/Tasks Dashboard|Tasks Dashboard]]

---

## 🔥 Focus (Top Priority Tasks)
```tasks
ignore global query
not done
description includes 🔥
```

---

## 📅 Due Today
```tasks
ignore global query
not done
due today
```

---

## ⚠️ Overdue
```tasks
ignore global query
not done
due before today
```

---

## 🚀 Active Projects
```dataview
TABLE
status,
priority,
modified
FROM "01 Projects"
WHERE type = "project" AND status = "active"
SORT priority DESC, modified DESC
```

---

## 🧠 Quick Capture
- [ ] 