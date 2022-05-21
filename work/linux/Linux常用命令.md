## Linux 常用命令 <!-- {docsify-ignore} -->

### vim 移动光标
移动光标最基础的操作为方向键，方向键只能逐个字符移动，有时候效率极低。

一些骚操作：

操作 | 快捷键 | 备注
:- | :- | :- 
定位到行首 | shift + 6 | 即 `^` 符号
定位到行尾 | shift + 4 | 即 `$` 符号
定位到第一行 | gg | 连按两次 g
定位到最后行 | shift + g | 即按一次大写 G
定位到第 n 行 | :n + enter | 输入行号后回车，输入 `:set nu` 显示行号
定位到关键字 | /关键字 | 如有多个关键字，按 `n` 往后查找，按 `N` 往前查找
单词跳转 | w / b | 下一个单词前 / 上一个单词

> 以上操作需要先按 `esc` 进入非编辑模式，光标定位完成后，按 `i` 进入编辑模式

> 更多参考：https://blog.csdn.net/weixin_39524959/article/details/111128844

### less 查看文本
less 可以滚动查看文本，支持上下翻阅，支持关键字搜索

操作 | 快捷键 | 备注
:- | :- | :- 
查看文本 | less 文本文件 | eg: `less app.log`
下翻一行 | ↓ | 方向键：下，或 `enter` 键也可以
上翻一行 | ↑ | 方向键：上
下翻一屏 | ctrl + f | 
上翻一屏 | ctrl + b | 
下翻半屏 | ctrl + d | 
上翻半屏 | ctrl + u | 
查找关键字 | /关键字 | eg: `/error` 如有多个关键字，按 `n` 往后查找，按 `N` 往前查找

### devops
#### 用户和权限
1、添加用户
```bash
useradd user1
```
> 添加用户后，在 `/home` 目录会创建同名用户目录，同时在 `/etc/passwd` 文件中新增对应记录

2、设置用户密码
```bash
passwd user1
```

3、删除用户
```bash
userdel user1
rm -rf /home/user1
```

4、添加用户组
```bash
groupadd group1
```
> 创建用户组后，再 `/etc/group` 文件中会创建对应记录

5、删除用户组
```bash
groupdel group1
```

6、设置目录用户归属
```bash
chown user1:user1 /opt/app1
```

> 更多参考： https://www.runoob.com/linux/linux-user-manage.html

#### 端口相关
1、查看端口
```bash
# 语法
netstat -pnltu | grep [port/apps/pid]

# 查看指定端口
netstat -pnltu | grep 8080

# 查看指定应用
netstat -pnltu | grep node_exporter

# 查看指定进程pid
netstat -pnltu | grep 18292
```

2、防火墙开启端口
```bash
# 添加防火墙规则语法
firewall-cmd --add-port=[port]/tcp --permanent

# 重载使之生效
firewall-cmd reload
```


