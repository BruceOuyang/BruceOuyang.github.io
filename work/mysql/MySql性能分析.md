## MySql 性能分析 <!-- {docsify-ignore} -->

### 性能相关
```sql
# 查看进程
show processlist ;

# 连接关闭等待秒数，默认28800，可调优为7200，单位：秒
show variables like '%interactive_timeout%';
```
> 一般 `interactive_timeout` 都是默认配置，优化成 7200 后，效果显著

优化操作，修改配置文件 my.cnf
```bash
[mysqld]
interactive_timeout=7200
```
在 `[mysqld]` 下，添加配置，然后重启 mysql 服务即可


### 其他常用指令
```sql
# 查看状态
show status;

# 查看进程
show processlist ;

# 主进程列表
show full processlist ;

# 连接数
-- 相应连接数 / 最大连接数 * 100% = 85% 为理想值
-- 低于 10% 则表示最大连接数设置过大
-- 100% 时表示最大连接数设置过小

### 最大连接数
show variables like '%max_connections';

### 响应的连接数
show status like 'max_used_connections';

### 等待连接数，默认值50，可调优为128，对于linux系统设置范围小于512的整数
show variables like '%back_log%';

### 连接关闭等待秒数，默认28800，可调优为7200
show variables like '%interactive_timeout%';

# 慢日志配置相关查询
show global variables like '%_time%';
```


### 最后 <!--{docsify-ignore}-->
如果你喜欢老欧整理的文章，欢迎你关注我的微信公众号，老欧的issueList站点文章更新时，会同步推送到微信公众号。

![](https://bruce.bugmakers.club/assets/wechat-subscribe-qr.jpg)