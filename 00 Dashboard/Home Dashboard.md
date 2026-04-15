# 🧭 Home Dashboard

> Your daily command center

---

## 🔥 Focus (Top Priority Tasks)
```tasks
not done
description includes 🔥
```

---

## 📅 Due Today
```tasks
not done
due today
```

---

## ⚠️ Overdue
```tasks
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