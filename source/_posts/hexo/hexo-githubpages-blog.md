---
title: 免费博客 | Hexo搭建博客并部署到Github Pages服务
date: 2018-04-19 22:05
tags: 
    - 免费博客
    - hexo
    - github pages
categories: 
    - 指引
---
<!-- more -->
> 本文实践的操作系统是windows 10，其他OS的可以当做参考用

# 一、Hexo搭建博客
## 1. 环境准备
* 下载并安装 [nodejs](https://nodejs.org) 
* 下载并安装 [git](https://git-scm.com/)
> 直接上官网看指引即可，如有疑问可以在评论中留言说明

## 2. Hexo初始化博客
> 在命令行窗口中执行下列命令

* 使用npm安装hexo

```bash
npm install -g hexo-cli
```

* 初始化你的博客项目

执行命令
```
hexo init <folder>
cd <folder>
npm install
```
> `<folder>` 是你本地的文件目录，例如：`F:\bruce\hexo\bugmakerBlog`，如果不写，则会在执行命令的当前目录初始化一个hexo博客项目  

> 初始化的过程中会去github上下载一些东西，比如说默认的主题 `landscape` 之类的，需要等个几分钟

![执行 hexo init 效果图](https://upload-images.jianshu.io/upload_images/5792176-4f9221b93e2e8881.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![执行 npm install 效果图](https://upload-images.jianshu.io/upload_images/5792176-e891100b071f5238.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

初始化完成后，你会得到一个这样的项目目录结构：  
![初始项目目录结构 - 可以在idea中打开](https://upload-images.jianshu.io/upload_images/5792176-c703cdabc856c8ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

*_config.yml*
网站的主要配置文件，可以配置你网站的大部分信息。【[配置参考说明](https://hexo.io/docs/configuration.html)】

简单的配置示例

key | 说明 | 示例
---- | ------ | -------
title | 网站的名字 | BuG制造者联盟官方主页
author | 网站的作者 | Bruce
language | 语言设置 | zh-CN 

*package.json*
应用数据。

*scaffolds目录*
模板目录，你新建一篇博客的时候会以这个目录中的模板文件来创建。

*source目录*
资源目录，你新建的博客都存储在这里。在生成页面的时候，hexo会忽略掉命名为 `_` 开头的文件或文件夹， `_post` 除外，会将 `.md` 和 `.html` 后缀的文件按主题生成页面，并复制到public目录下，其他后缀的文件则直接复制过去，不进行额外转换操作。

*themes目录*
主题目录，你可以为自己的网站挑选好看的主题，然后在 `_config.yml` 文件中指定主题即可。

* 写一篇博客
```
hexo new [layout] <title>
```
> `hexo new` 会在 `source目录` 中创建一个以 `<title>` 命名的 `.md` 文件
> `[layout]` 是默认布局，在 `scaffolds目录` 下定义的，默认布局在 `_config.yml` 中指定，初始化的默认布局是 `post`  
> `<title>` 是博客的标题，博客的标题可以在生成的 `.md` 文件中修改

示例
```
hexo new post My First Blog
```

![新写一篇博客的效果图](https://upload-images.jianshu.io/upload_images/5792176-c694d73b59100c23.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


* 生成页面并运行你的博客
```
hexo g
hexo s -p 80
```

> `hexo g` 是hexo生成页面指令 `hexo generate` 的缩写  
> `hexo s` 是hexo启动本地服务的指令，默认端口是4000
> `-p 80` 是指定端口号80  
![生成并启动hexo本地服务效果图.png](https://upload-images.jianshu.io/upload_images/5792176-beede0991b359d42.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

默认访问地址 http://localhost:4000
指定80端口访问地址 http://localhost
![初始化的博客页面](https://upload-images.jianshu.io/upload_images/5792176-94b98fd9754af28e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 3. 切换博客主题

在上一步中，我们看到的博客使用的主题是默认的 `landscape` 主题，hexo为我们提供了很多的主题可以选择，访问网站 https://hexo.io/themes/ 挑选自己喜欢的主题

将挑选好的主题 `clone` 到 `theme目录` 下，主题目录下也有一个 `_config.yml` 配置文件，这个配置文件即主题相关配置，具体根据主题的wiki上的说明来操作

在 `_config.yml` 中，设置 `theme` 属性的值为 `theme目录` 下的某一款主题即可，直接写目录下的文件夹名字

示例：

* clone主题到 `theme目录`
```
git clone https://github.com/klugjo/hexo-theme-alpha-dust.git
```

* 修改根目录下的 `_config.yml` 配置文件，设置 `theme` 值
```
theme : hexo-theme-alpha-dust
```

* 重新生成并启动本地服务
```
hexo g
hexo s -p 80
```

* 效果图
![切换主题测试的效果图.png](https://upload-images.jianshu.io/upload_images/5792176-1567bfe856c9b473.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 

# 二、了解Github Pages服务

GitHub Pages 网站：https://pages.github.com/

## 1. 有什么用
> Websites for you and your projects. 为你和你的项目提供一个网站
> Hosted directly from your [GitHub repository](https://github.com/).  直接托管存储在你的github仓库
> Just edit, push, and your changes are live. 只管去编辑提交代码到仓库，你的网站都会即时更新。

## 2. 怎么玩的

> 步骤其实很简单，在 [Github Pages](https://pages.github.com/)上都有  
> 如果你还没有github的账号，那需要先[注册一个](https://github.com/join?source=header-home)

* 第一步：在github上创建一个仓库，命名为 `username.github.io` username就是你的github用户名，注意不是登录账号，我仓库名字是 `BuGMakerClub.github.io`

* 第二步：将刚刚创建的仓库 `clone` 到本地，如 `F:\bruce\bruce-private-github\BuGMakerClub.github.io`
```
cd F:\bruce\bruce-private-github\
git clone https://github.com/BuGMakerClub/BuGMakerClub.github.io.git
```

* 第三步：在 `clone` 下来的项目中，创建一个 `index.html`，内容可以是 `Hello World`
```
cd BuGMakerClub.github.io
echo 'Hello World' > index.html
```

* 第四步：提交代码，把刚创建的 `index.html` 文件 `commit & push` 到你的 github仓库中

* 第五步：结束，你可以直接访问 `https://username.github.io` 访问你的网站了，我的网站地址是 https://BuGMakerClub.github.io
![bugmakerclub.github.io.png](https://upload-images.jianshu.io/upload_images/5792176-40fade0059f0d63c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* 第六步：设置自己的个性化域名

如果你有自己的域名，可以在仓库的设置中绑定自己的个性化域名，然后在域名管理中心设置一个域名解析地址，这样就可以用个性化域名来访问github pages服务商的网页了

# 三、结合Hexo博客和Github Pages服务

> 参考：https://hexo.io/docs/deployment.html

hexo的配置中，有一个 `deploy` 指令，可以将生成的博客网站部署到github仓库中，这样就形成两者的结合关系了。

具体操作如下

* 安装 `hexo-deployer-git` 插件
```
npm install hexo-deployer-git --save
```
![安装hexo-deployer-git插件效果图.png](https://upload-images.jianshu.io/upload_images/5792176-628ac31805a23f96.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* 修改根目录下的 `_config.yml` 配置文件
```
deploy:
  type: git
  repo: https://github.com/BuGMakerClub/BuGMakerClub.github.io.git
```

* 执行 `deploy` 指令发布代码
```
hexo d
```
