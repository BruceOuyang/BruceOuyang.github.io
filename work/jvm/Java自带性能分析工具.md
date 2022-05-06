## JVM性能监控分析工具 <!-- {docsify-ignore} -->
tool | remark
:- | :-
jps | 主要用来输出JVM中运行的进程状态信息，全称 Java Virtual Machine Process Status Tool 
jstack | 主要用来查看某个Java进程内的线程堆栈信息，使用率很高 
jmap | 用来查看堆内存使用状况，一般结合jhat使用 
jhat | 用来分析jmap导出的数据信息 
jstat | JVM统计监测工具 
hprof | 能够展现CPU使用率，统计堆内存使用情况

### jps 用法
#### 1、语法
```bash
jps [options] [hostid]
```
参数说明
* options
  - -q 不输出类名、Jar名和传入main方法的参数
  - -m 输出传入main方法的参数
  - -l 输出main类或Jar的全限名
  - -v 输出传入JVM的参数
* hostid
  如果不指定hostid就默认为当前主机或服务器

#### 2、示例  
纯输出
```bash
[root@localhost ~]# jps
79426 Jps
44639 dongsee.jar
```

带参数
```bash
[root@localhost ~]# jps -l -m -v
79307 sun.tools.jps.Jps -l -m -v -Dapplication.home=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.292.b10-1.el7_9.x86_64 -Xms8m
44639 /opt/apps/dongsee/dongsee.jar --spring.profiles.active=dev
```
> 第一列的数字为进程id，即其他命令需要用到的 pid

### jstack 用法
#### 1、语法
```bash
jstack [option] pid
jstack [option] executable core
jstack [option] [server-id@]remote-hostname-or-ip
```
* options
  - -l long listings，会打印出额外的锁信息，在发生死锁时可以用jstack -l pid来观察锁持有情况
  - -m mixed mode，不仅会输出Java堆栈信息，还会输出C/C++堆栈信息（比如Native方法）

#### 2、示例

找出某个Java进程中最耗费CPU的Java线程并定位堆栈信息，一般步骤：

* 1）找到 pid
```bash
[root@localhost ~]# jps
79426 Jps
44639 dongsee.jar
```
> 这里我们用 dongsee.jar 来测试，它的 pid 为 44639 

* 2）找到 pid 最占资源的线程id
```bash
[root@localhost ~]# top -Hp 44639
top - 18:07:01 up 9 days,  2:56,  3 users,  load average: 0.03, 0.05, 0.05
Threads:  68 total,   0 running,  68 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.3 us,  0.9 sy,  0.0 ni, 96.3 id,  0.3 wa,  0.0 hi,  0.2 si,  0.0 st
KiB Mem :  8581928 total,  1076676 free,  7182236 used,   323016 buff/cache
KiB Swap:  4390908 total,  3593724 free,   797184 used.  1153924 avail Mem 

   PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND       
 44758 root      20   0 4894932 984064   5024 S  4.0 11.5  13:55.12 System Clock    
 44736 root      20   0 4894932 984064   5024 S  0.7 11.5   1:13.61 SimplePauseDete 
 44737 root      20   0 4894932 984064   5024 S  0.7 11.5   1:12.71 SimplePauseDete 
 44647 root      20   0 4894932 984064   5024 S  0.3 11.5   0:40.59 C2 CompilerThre 
 44738 root      20   0 4894932 984064   5024 S  0.3 11.5   1:14.60 SimplePauseDete 
 44741 root      20   0 4894932 984064   5024 S  0.3 11.5   0:02.90 QuartzScheduler  
 44639 root      20   0 4894932 984064   5024 S  0.0 11.5   0:00.02 java      
 44640 root      20   0 4894932 984064   5024 S  0.0 11.5   0:18.71 java      
 44641 root      20   0 4894932 984064   5024 S  0.0 11.5   0:00.93 java
```
> 输出的第一个就是最占资源的线程了，第一列及它的id，这里是 44758 

* 3）将线程id转为十六进制
```bash
[root@localhost ~]# printf '%x\n' 44758
aed6
```
> 十六进制的 aed6 在堆栈中会有打印

* 4）抓取堆栈信息
```bash
[root@localhost ~]# jstack -l 44639 > jstack.44639
```
> jstack.44639 这个文件名可以随意命名，用来存放堆栈信息

> 可根据线程状态统计排序
> ```
> grep java.lang.Thread.State jstack.44639 | awk '{print $2$3$4$5}' | sort | uniq -c
> ```

* 5）从堆栈信息中过滤出线程id相关堆栈信息
```bash
[root@localhost ~]# cat jstack.44639 | grep aed6 -A 20
"System Clock" #61 daemon prio=5 os_prio=0 tid=0x00007fe5b4189000 nid=0xaed6 runnable [0x00007fe581ef6000]
   java.lang.Thread.State: TIMED_WAITING (parking)
	at sun.misc.Unsafe.park(Native Method)
	- parking to wait for  <0x00000007b79bc288> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
	at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:215)
	at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(AbstractQueuedSynchronizer.java:2078)
	at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(ScheduledThreadPoolExecutor.java:1093)
	at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(ScheduledThreadPoolExecutor.java:809)
	at java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1074)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1134)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
	at java.lang.Thread.run(Thread.java:748)
   Locked ownable synchronizers:
	- None
"DestroyJavaVM" #60 prio=5 os_prio=0 tid=0x00007fe5e004b800 nid=0xae60 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE
   Locked ownable synchronizers:
	- None
```
> `grep -A n` 展示关键字向下n行，`grep -C n` 展示关键字向下和向下各n行

* 6）根据堆栈信息排查代码逻辑

需根据自己的情况具体分析


### jmap 用法
> jmap（Memory Map）  和 jhat（Java Heap Analysis Tool）一般一起使用

#### 1、语法
```bash
jmap [option] pid
jmap [option] executable core
jmap [option] [server-id@]remote-hostname-or-ip
```

#### 2、示例
* 1）使用 `jmap -heap pid` 查看进程堆内存使用情况，包括使用的GC算法、堆配置参数和各代中堆内存使用情况
```bash
[root@localhost jvm]# jmap -heap 44639
Attaching to process ID 44639, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.292-b10
using thread-local object allocation.
Parallel GC with 2 thread(s)
Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 2197815296 (2096.0MB)
   NewSize                  = 46137344 (44.0MB)
   MaxNewSize               = 732430336 (698.5MB)
   OldSize                  = 92274688 (88.0MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)
Heap Usage:
PS Young Generation
Eden Space:
   capacity = 413138944 (394.0MB)
   used     = 135221512 (128.95728302001953MB)
   free     = 277917432 (265.04271697998047MB)
   32.730274878177546% used
From Space:
   capacity = 12582912 (12.0MB)
   used     = 12513352 (11.933662414550781MB)
   free     = 69560 (0.06633758544921875MB)
   99.44718678792317% used
To Space:
   capacity = 19398656 (18.5MB)
   used     = 0 (0.0MB)
   free     = 19398656 (18.5MB)
   0.0% used
PS Old Generation
   capacity = 182976512 (174.5MB)
   used     = 77980528 (74.36802673339844MB)
   free     = 104995984 (100.13197326660156MB)
   42.61778036297905% used
50915 interned Strings occupying 5130928 bytes.
```

* 2）使用 `jmap -histo[:live] pid` 查看堆内存中的对象数目、大小统计直方图，如果带上live则只统计活对象
```bash
[root@localhost jvm]# jmap -histo 44639
 num     #instances         #bytes  class name
   1:        848943       81145048  [C
   2:        771442       24686144  java.util.concurrent.locks.AbstractQueuedSynchronizer$Node
   3:         70155       14315008  [B
   4:         91315       14074080  [I
   5:        551817       13243608  java.lang.String
   6:        141630       12463440  java.lang.reflect.Method
   7:        168286        9054200  [Ljava.lang.Object;
   8:        139992        4479744  java.util.concurrent.ConcurrentHashMap$Node
   9:         45002        3483720  [Ljava.util.HashMap$Node;
  10:         84402        3376080  java.util.LinkedHashMap$Entry
  11:        148810        3194464  [Ljava.lang.Class;
```

 class name是对象类型，说明如下
```
B  byte
C  char
D  double
F  float
I  int
J  long
Z  boolean
[  数组，如[I表示int[]
[L+类名 其他对象
```

* 3）用jmap把进程内存使用情况dump到文件中，再用jhat分析查看  
先 jmap dump 
```bash
jmap -dump:format=b,file=/tmp/dump.dat 44639
```
后 jhat 查看
```bash
jhat -port 7001 /tmp/dump.dat
```
> port 可以自定义，访问 http://ip:7001 即可查看 jhat 的分析结果


