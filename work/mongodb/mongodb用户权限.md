### MongoDB 用户权限管理 <!--{docsify-ignore}-->
#### 1、创建不受限制的超级用户
```js
db.createUser({
    user: "root",
    pwd: "pwd",
    roles: ["root"]
})
```

#### 2、创建 admin 超级管理员
```js
use admin

db.createUser({
    user: "admin",
    pwd: "admin",
    customData: {
        "description": "administrator"
    },
    roles: [
        {role: "userAdminAnyDatabase", db: "admin"}
    ]
})
```

> 超级用户的 role 有两种：userAdmin 或 userAdminAnyDatabase(比前者多了对所有数据库的访问权限)  
> db 是指定数据库。（注意：不能用 admin 库中的用户登录其他数据库，只能查看当前数据库中的用户）

#### 3、创建一个业务库，并创建其管理员
```js
use biz_01

db.biz_01.insert({"test": 1})

db.createUser({
    user: "user01",
    pwd: "user01",
    customData: {
        name: "user01",
        email: "user01@qq.cm",
        age: "25"
    },
    roles: [
        {role: "readWrite", db: "biz_01"}， // biz_01 库读写
        'read' // 其他库只读
    ]
})
```

> 数据库用户角色：read、readWrite  
> 数据库管理角色：dbAdmin、dbOwner、userAdmin  
> 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManage，只在admin库中可用  
> 备份恢复角色：backup、restore  
> 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase，只在admin库中可用  
> 超级用户角色：root，只在admin库中可用  
> 内部角色：__system

#### 4、查看创建的数据库和用户

查看数据库
```js
show dbs
```

查看用户
```js
show users

db.system.users.find()

db.runCommand({
    usersInfo: "user01"
})
```

#### 5、修改密码
```js
use admin

db.changeUserPassword("username", "newpwd")

db.runCommand({
    updateUser: "username",
    pwd: "newpwd",
    customeData: {
        description: "..."
    }
})
```

#### 6、删除用户和数据库
```js
use admin

db.dropUser("username")

db.drop("dbname")
```

