# 📆 Weekly Review

---

## 🎯 Completed This Week
```tasks
ignore global query
done after this week
```

---

## 🚧 In Progress
```tasks
ignore global query
not done
description includes 🔄
```

---

## ⚠️ Blocked Work
```tasks
ignore global query
not done
description includes ⛔
```

---

## 🧊 Stale Projects
```dataview
TABLE modified, status
FROM "01 Projects"
WHERE type = "project"
AND status = "active"
AND (date(today) - file.mtime).day > 14
SORT modified ASC
```

---

## 🧹 System Cleanup Checklist
- [ ] Archive completed projects
- [ ] Clear blocked tasks
- [ ] Reprioritize active projects
- [ ] Plan next week focus