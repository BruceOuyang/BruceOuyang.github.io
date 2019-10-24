---
title: Spring | Transaction 事物
date: 2019-04-21 23:57
tags: 
    - spring
    - transaction
categories: 
    - spring
---
<!-- more -->

### Spring 事物抽象

* 一致的事物模型
    * JDBC/Hibernate/MyBatis
    * DataSource/JTA
    
#### 事物抽象的核心接口

**PlatformTransactionManager**
* DataSrouceTransactionManager
* HibernateTransactionManager
* JtaTransactionManager

```java
void commit(TransactionStatus status) throws TransactionException;
void rollback(TransactionStatus status) throws TransactionException;
TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;
```

#### 事物传播特性
// todo

#### 事物隔离级别
// todo