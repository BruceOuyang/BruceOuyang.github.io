---
title: docker | Docker 公有仓库和私有仓库
date: 2019/05/06 08:12
tags: 
    - 公有仓库
    - 私有仓库
categories: 
    - docker
---
<!-- more -->

#### 1、Docker Hub 公有仓库

**在Docker Hub官网上注册账号**

https://hub.docker.com

**在自己的docker环境上登录公有仓库**

```
# login
docker login

# logout
docker logout
```

**从公有仓库上拉取镜像**

```
# search image
docker search <image>

docker search hello-world

# pull image
docker pull <image>

docker pull hello-world
```

**将本地镜像推送到公有仓库**

```
# list local images
docker images

# create a test image for hello-world to push (bruceouyang as your username)
docker tag <image>[:<tag>] <username>/<image_name or image_id>[:<tag>]

docker tag hello-world bruceouyang/hello-world:latest

# check images
docker images

# push image
docker push <image>:<tag>

docker push bruceouyang/hello-world:latest
```

#### 2、私有仓库

docker-registry 是官方提供的工具，可以用于构建私有镜像仓库。

**安装运行 docker-registry** 

```
docker run --name registry -d -p 5000:5000 --restart=always -v /opt/data/registry:/var/lib/registry registry
```

> --name 取个名字
>
> -d 后台运行
>
> -p 端口映射
>
> --restart 重启设置
>
> -v 挂在目录
>
> 最后一个 `registry` 表示基于 `registry` 镜像启动一个

**检查运行中的容器**

```
docker ps 
```

可以看到刚运行的 `registry`

**推送本地镜像到私有仓库**

```
# list local images
docker images

# create a test image for a big one to push
docker tag <image> <registry_server_addr>/<image>[:<tag>]

docker tag tomcat:latest 127.0.0.1:5000/tomcat:latest

# check images
docker images

# push image
push 127.0.0.1:5000/tomcat:latest
```

**检查私有仓库中的镜像**

```
curl 127.0.0.1:5000/v2/_catalog

# output
> {"repositories":["tomcat"]}
```

**从私有仓库中拉取镜像**

```
# remove local image
docker rmi -f <image>

docker rmi -f 127.0.0.1:5000/tomcat

# pull image from private registry
docker pull 127.0.0.1:5000/tomcat
```

**私有仓库对内网提供服务**

> 注意
>
> 直接将127.0.0.1修改为本机的 ip 地址是没有效果的。
>
> Docker 默认不允许非 HTTPS 方式推送镜像。

对于使用 systemd 的系统，可以在 /etc/docker/daemon.json 中写入如下内容（不存在则创建）

```
{
	"registry-mirror": [
		"http://hub-mirror.c.163.com",
		"https://registry.docker-cn.com"
	],
	"insecure-registries":[
		"192.168.1.6: 5000"
	]
}
```

> 192.168.1.6 是我本地的 ip 地址，请修改为你自己的本地 ip

