---
nav:
  title: 文档
  path: /introduce
group:
  path: /introduce/develop
  title: 开发人员手册
order: 1
---

# 常见问题

## lerna 发布失败后怎么办? 

```sh
# 执行
git reset --hard HEAD~1 && git tag -d $(git log --date-order --tags --simplify-by-decoration --pretty=format:'%d' | head -1 | tr -d '()' | sed 's/,* tag://g')
```

然后重新发布