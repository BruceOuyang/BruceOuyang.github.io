---
title: boy-learning-hexo | Hexo 设置文章排序
date: 2019-10-24
tags: 
    - hexo
categories: 
    - hexo
---
<!--more-->

## 背景
hexo 文章排序的默认规则是根据文件的最后更新时间来的。  

有的时候我们不希望他这么来排序，希望可以自定义排序方式，那么可以通过修改 hexo 的源代码来实现。

## 实现

找到文件：node_modules/hexo-generator-index/lib/generator.js，修改成下边的样子：  
```javascript
'use strict';

var pagination = require('hexo-pagination');

module.exports = function(locals) {
    var config = this.config;

  // 这是官方默认排序方式，暂时注释掉
  // var posts = locals.posts.sort(config.index_generator.order_by);

    // 获取所有的文章
    var posts = locals.posts;
    
    // 定制排序规则：
    // 这里示例规则为，先按照 top 值排序，然后在按照 date 值排序
    posts.data = posts.data.sort(function(a, b) {
        // 两篇文章top都有定义
        if (a.top && b.top) {
            // 若top值一样则按照文章日期降序排
            if (a.top == b.top) {
                return b.date - a.date;
            }
            // 否则按照top值降序排
            else {
                return b.top - a.top;
            }
        }
        // 以下是只有一篇文章top有定义，那么将有top的排在前面（这里用异或操作居然不行233）
        else if (a.top && !b.top) {
            return -1;
        }
        else if (!a.top && b.top) {
            return 1;
        } else {
            // 都没定义按照文章日期降序排
            return b.date - a.date;
        }
    });

  var paginationDir = config.pagination_dir || 'page';
  var path = config.index_generator.path || '';

  return pagination(path, posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
};
```

文章示例：  
```
title: boy-learning-hexo | Hexo 设置文章排序
top: 1              // 先按照top排序，这个top值越大，显示越靠前
date: 2018-04-22    // 再按照date排序，date越大，显示越靠前
tags: 
    - hexo
categories: 
    - hexo
```

## 总结

hexo 是通过生成静态 html 来展示文章内容的，叫做静态博客系统。  
在生成 html 之前，可以通过修改 ` posts.data.sort()` 来实现文章排序的自定义。

> 本文核心内容参考：[落叶阁的博文:Hexo置顶及排序问题](https://yelog.org/2017/02/24/hexo-top-sort/)