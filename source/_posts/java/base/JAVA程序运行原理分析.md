---
title: JAVA基础 | JAVA程序运行原理分析
date: 2019-01-08
tags: 
    - JAVA基础
    - JAVA高性能编程
    - 运行原理
    - 网易微专业
categories: 
    - java
---
<!-- more -->
Java程序的运行，首先会将源码文件(.java)编译成Class文件(.class)，进而jvm会去解析class文件，将其解释为操作系统可识别的指令进行运算。

## JVM 运行时数据区
![01_02_jvm运行时数据区.png](https://upload-images.jianshu.io/upload_images/5792176-c582a42c26f7f0c3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

线程独占：每个线程都会有它独立的空间，随线程生命周期而创建和销毁

线程共享：所有线程能访问这块内存数据，随虚拟机或者GC而创建和销毁

### 方法区
![01_03_jvm运行时数据区_方法区.png](https://upload-images.jianshu.io/upload_images/5792176-ceb6f3791b90fc21.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

方法区，JVM用来存储加载的：类、常量、静态变量、编译后的代码等数据。

虚拟机规范中这是一个逻辑划分区，具体实现根据不同虚拟机来实现。

如：oracle的HotSpot在java7中方法区放在永久代，java8放在元数据空间，并且通过GC机制对这个区域进行管理

### 堆内存
![01_04_jvm运行时数据区_堆内存.png](https://upload-images.jianshu.io/upload_images/5792176-b7bba10c8eee7352.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

堆内存，还可以细分为：老年代、新生代(Eden、From Survivor、To Survivor)。

JVM启动是创建，存放对象的实例。垃圾回收器主要就是管理堆内存。

如果满了，就会出现OutOfMemoryError。

### 虚拟机栈
![01_05_jvm运行时数据区_虚拟机栈.png](https://upload-images.jianshu.io/upload_images/5792176-ee54c21aed06e83f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

虚拟机栈，是为虚拟机执行JAVA方法而准备的。

每个线程在这个空间有一个私有空间，线程栈由多个栈帧(Stack Frame)组成。

一个线程会执行一个或多个方法，一个方法对应一个栈帧。

栈帧内容包含：局部变量表、操作数栈、动态链接、方法返回地址、附加信息等。

栈内存默认最大是1MB，超出则抛出StackOverflowError。

### 本地方法栈
![01_06_jvm运行时数据区_本地方法栈.png](https://upload-images.jianshu.io/upload_images/5792176-91c35323d6db2afe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

本地方法栈，是为虚拟机使用Native本地方法而准备的。

虚拟机规范没有规定具体的实现，由不同的虚拟机厂商去实现。

HotSpot虚拟机中虚拟机栈和本地方法栈的实现是一样的。同样，超出大小则抛出StackOverflowError。

### 程序计数器
![01_07_jvm运行时数据区_程序计数器.png](https://upload-images.jianshu.io/upload_images/5792176-8208ba08cd5ad146.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

程序计数器(Program Counter Register)，记录当前线程执行字节码的位置，存储的是字节码指令地址，如果执行Native方法，则计数器值为空。

每个线程都在这个空间有一个私有空间，占用内存空间很少。

CPU同一时间，只会执行一条线程中的指令。JVM多线程会轮流切换并分配CPU执行时间的方式。为了线程切换后，需要通过程序计数器来恢复正确的执行位置。


## class 文件内容
class文件包含JAVA程序执行的字节码；数据严格按照格式紧凑排列在class文件中的二进制流，中间无任何分隔符；文件开头有一个0xcafebabe(16进制)特殊的一个标志。

![01_01_class文件内容.png](https://upload-images.jianshu.io/upload_images/5792176-fbc8fe895aa560df.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 查看class文件内容

准备一个java文件，例如：
```java
public class Demo1 {
    public static void main(String[] args) {
        int x = 500;
        int y = 100;
        int a = x / y;
        int b = 50;
        System.out.println(a + b);
    }
}
```

使用命令 javac 来编译一个 .java 文件，编译成功之后会生成一个 .class 文件，例如：
```shell
javac Demo1.java
```

使用命令 javap 来解析一个 .class 文件，会输出解析结果，我们可以将解析结果保存在一个 .txt 文件中，例如：
```shell
javap -v Demo1.class>Demo1.txt
```

### class内容 - 版本号/访问标识

javap输出内容摘要：
```
public class club.bugmakers.boyneteasejava.demo.Demo1
  minor version: 0  //次版本号
  major version: 52 //主版本号
  flags: ACC_PUBLIC, ACC_SUPER  //访问标志
  ...
```
版本号规则：JDK5,6,7,8分别对应49,50,51,52

访问标志：
![01_08_class文件内容_访问标志.png](https://upload-images.jianshu.io/upload_images/5792176-b89f44898e7d2fcb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### class内容 - 常量池

javap输出内容摘要：
```
Constant pool:
   #1 = Methodref          #5.#14         // java/lang/Object."<init>":()V
   #2 = Fieldref           #15.#16        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = Methodref          #17.#18        // java/io/PrintStream.println:(I)V
   #4 = Class              #19            // club/bugmakers/boyneteasejava/demo/Demo1
   #5 = Class              #20            // java/lang/Object
   #6 = Utf8               <init>
   #7 = Utf8               ()V
   #8 = Utf8               Code
   #9 = Utf8               LineNumberTable
  #10 = Utf8               main
  #11 = Utf8               ([Ljava/lang/String;)V
  #12 = Utf8               SourceFile
  #13 = Utf8               Demo1.java
  #14 = NameAndType        #6:#7          // "<init>":()V
  #15 = Class              #21            // java/lang/System
  #16 = NameAndType        #22:#23        // out:Ljava/io/PrintStream;
  #17 = Class              #24            // java/io/PrintStream
  #18 = NameAndType        #25:#26        // println:(I)V
  #19 = Utf8               club/bugmakers/boyneteasejava/demo/Demo1
  #20 = Utf8               java/lang/Object
  #21 = Utf8               java/lang/System
  #22 = Utf8               out
  #23 = Utf8               Ljava/io/PrintStream;
  #24 = Utf8               java/io/PrintStream
  #25 = Utf8               println
  #26 = Utf8               (I)V
```

类信息包含的静态常量，编译之后就能确认，比如：类的名称、方法名称。

常量池常见类型：
![01_09_class文件内容_常量池数据类型.png](https://upload-images.jianshu.io/upload_images/5792176-8bff7e63323cbf97.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### class内容 - 构造方法

javap输出内容摘要：
```
public club.bugmakers.boyneteasejava.demo.Demo1();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 10: 0
```

Demo1这个示例中，我们并没有写构造函数。

由此可见，没有定义构造函数时，会有隐式的无参构造函数。

### class内容 - 程序入口main方法
![01_10_class文件内容_程序入口main方法.png](https://upload-images.jianshu.io/upload_images/5792176-f9868faa0133752a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[JVM指令码表](/assets/java/base/01_11_JVM指令码表.html)

## 程序完整运行分析
### 加载信息到方法区
![01_12_运行分析_加载信息到方法区.png](https://upload-images.jianshu.io/upload_images/5792176-dda55fa7b82fcc31.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### JVM创建线程来执行代码
![01_13_运行分析_JVM创建线程来执行代码.png](https://upload-images.jianshu.io/upload_images/5792176-96152fbdd5f99c9f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 线程独占空间和执行指令码
![01_14_运行分析_线程独占空间和执行指令码01.png](https://upload-images.jianshu.io/upload_images/5792176-00e3cce16aad98ed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![01_14_运行分析_线程独占空间和执行指令码02.png](https://upload-images.jianshu.io/upload_images/5792176-52e6f0dcecc4d1e1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![01_14_运行分析_线程独占空间和执行指令码03.png](https://upload-images.jianshu.io/upload_images/5792176-a3839c649bac8d69.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![01_14_运行分析_线程独占空间和执行指令码04.png](https://upload-images.jianshu.io/upload_images/5792176-73e682d20d3ff30d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
...依次执行，直到最后一个字节码指令执行完成

## 总结

本文对JVM运行的核心逻辑进行了详细剖析。

注意：

JVM运行原理中更底层实现，针对不同的操作系统或者处理器，会有不同的实现。

这也是JAVA能够实现“一处编写，到处运行”的原因。

开发人员理解到这个层次，就足够学习掌握多线程的相关知识了。