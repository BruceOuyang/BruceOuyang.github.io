> 【学习难度：★★☆☆☆，使用频率：★★☆☆☆】  
>  直接出处：[备忘录模式](http://woquanke.com/books/gof/%E5%A4%87%E5%BF%98%E5%BD%95%E6%A8%A1%E5%BC%8F-Memento%20Pattern.html)  
>  梳理和学习：https://github.com/BruceOuyang/boy-design-pattern  
>  简书日期： 2018/03/26  
>  简书首页：https://www.jianshu.com/p/0fb891a7c5ed  

## 撤销功能的实现——备忘录模式（一）

每个人都有过后悔的时候，但人生并无后悔药，有些错误一旦发生就无法再挽回，有些人一旦错过就不会再回来，有些话一旦说出口就不可能再收回，这就是人生。为了不后悔，凡事我们都需要三思而后行。说了这么多，大家可能已经晕了，不是在学设计模式吗？为什么弄出这么一堆人生感悟来，呵呵，别着急，本章将介绍一种让我们可以在软件中实现后悔机制的设计模式——备忘录模式，它是软件中的“后悔药”，是软件中的“月光宝盒”。话不多说，下面就让我们进入备忘录模式的学习。

21.1 可悔棋的中国象棋

Sunny软件公司欲开发一款可以运行在Android平台的触摸式中国象棋软件，由于考虑到有些用户是“菜鸟”，经常不小心走错棋；还有些用户因为不习惯使用手指在手机屏幕上拖动棋子，常常出现操作失误，因此该中国象棋软件要提供“悔棋”功能，用户走错棋或操作失误后可恢复到前一个步骤。如图21-1所示：  
![图21-1 Android版中国象棋软件界面示意图](../img/type3-06-01.jpeg)  

如何实现“悔棋”功能是Sunny软件公司开发人员需要面对的一个重要问题，“悔棋”就是让系统恢复到某个历史状态，在很多软件中通常称之为“撤销”。下面我们来简单分析一下撤销功能的实现原理：

在实现撤销时，首先必须保存软件系统的历史状态，当用户需要取消错误操作并且返回到某个历史状态时，可以取出事先保存的历史状态来覆盖当前状态。如图21-2所示：  
![图21-2撤销功能示意图](../img/type3-06-02.jpeg)  

备忘录模式正为解决此类撤销问题而诞生，它为我们的软件提供了“后悔药”，通过使用备忘录模式可以使系统恢复到某一特定的历史状态。

## 撤销功能的实现——备忘录模式（二）

21.2 备忘录模式概述

备忘录模式提供了一种状态恢复的实现机制，使得用户可以方便地回到一个特定的历史步骤，当新的状态无效或者存在问题时，可以使用暂时存储起来的备忘录将状态复原，当前很多软件都提供了撤销(Undo)操作，其中就使用了备忘录模式。

备忘录模式定义如下：  
> 备忘录模式(Memento Pattern)：在不破坏封装的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，这样可以在以后将对象恢复到原先保存的状态。它是一种对象行为型模式，其别名为Token。  

备忘录模式的核心是备忘录类以及用于管理备忘录的负责人类的设计，其结构如图21-3所示：  
![图21-3 备忘录模式结构图](../img/type3-06-03.jpeg)  

在备忘录模式结构图中包含如下几个角色：

* Originator（原发器）：它是一个普通类，可以创建一个备忘录，并存储它的当前内部状态，也可以使用备忘录来恢复其内部状态，一般将需要保存内部状态的类设计为原发器。  

* Memento（备忘录)：存储原发器的内部状态，根据原发器来决定保存哪些内部状态。备忘录的设计一般可以参考原发器的设计，根据实际需要确定备忘录类中的属性。需要注意的是，除了原发器本身与负责人类之外，备忘录对象不能直接供其他类使用，原发器的设计在不同的编程语言中实现机制会有所不同。  

* Caretaker（负责人）：负责人又称为管理者，它负责保存备忘录，但是不能对备忘录的内容进行操作或检查。在负责人类中可以存储一个或多个备忘录对象，它只负责存储对象，而不能修改对象，也无须知道对象的实现细节。  

理解备忘录模式并不难，但关键在于如何设计备忘录类和负责人类。由于在备忘录中存储的是原发器的中间状态，因此需要防止原发器以外的其他对象访问备忘录，特别是不允许其他对象来修改备忘录。

下面我们通过简单的示例代码来说明如何使用Java语言实现备忘录模式：

在使用备忘录模式时，首先应该存在一个原发器类Originator，在真实业务中，原发器类是一个具体的业务类，它包含一些用于存储成员数据的属性，典型代码如下所示：  
```java
package dp.memento;  
public class Originator {  
    private String state;  

    public Originator(){}  

　　// 创建一个备忘录对象  
    public Memento createMemento() {  
　　　　return new Memento(this);  
    }  

　　// 根据备忘录对象恢复原发器状态  
    public void restoreMemento(Memento m) {  
　　　　 state = m.state;  
    }  

    public void setState(String state) {  
        this.state=state;  
    }  

    public String getState() {  
        return this.state;  
    }  
}
``` 

对于备忘录类Memento而言，它通常提供了与原发器相对应的属性（可以是全部，也可以是部分）用于存储原发器的状态，典型的备忘录类设计代码如下：  
```java
package dp.memento;  
//备忘录类，默认可见性，包内可见  
class Memento {  
    private String state;  

    public Memento(Originator o) {  
　　　　state = o.getState();  
    }  

    public void setState(String state) {  
        this.state=state;  
    }  

    public String getState() {  
        return this.state;  
    }  
}
```

在设计备忘录类时需要考虑其封装性，除了Originator类，不允许其他类来调用备忘录类Memento的构造函数与相关方法，如果不考虑封装性，允许其他类调用setState()等方法，将导致在备忘录中保存的历史状态发生改变，通过撤销操作所恢复的状态就不再是真实的历史状态，备忘录模式也就失去了本身的意义。

在使用Java语言实现备忘录模式时，一般通过将Memento类与Originator类定义在同一个包(package)中来实现封装，在Java语言中可使用默认访问标识符来定义Memento类，即保证其包内可见。只有Originator类可以对Memento进行访问，而限制了其他类对Memento的访问。在 Memento中保存了Originator的state值，如果Originator中的state值改变之后需撤销，可以通过调用它的restoreMemento()方法进行恢复。

对于负责人类Caretaker，它用于保存备忘录对象，并提供getMemento()方法用于向客户端返回一个备忘录对象，原发器通过使用这个备忘录对象可以回到某个历史状态。典型的负责人类的实现代码如下：  
```java
package dp.memento;  
public class Caretaker {  
    private Memento memento;  

    public Memento getMemento() {  
        return memento;  
    }  

    public void setMemento(Memento memento) {  
        this.memento=memento;  
    }  
}
```

在Caretaker类中不应该直接调用Memento中的状态改变方法，它的作用仅仅用于存储备忘录对象。将原发器备份生成的备忘录对象存储在其中，当用户需要对原发器进行恢复时再将存储在其中的备忘录对象取出。

**思考**  
> 能否通过原型模式来创建备忘录对象？系统该如何设计？

## 撤销功能的实现——备忘录模式（三）

21.3 完整解决方案

为了实现撤销功能，Sunny公司开发人员决定使用备忘录模式来设计中国象棋软件，其基本结构如图21-4所示：  
![图21-4中国象棋棋子撤销功能结构图](../img/type3-06-04.jpeg)  

在图21-4中，Chessman充当原发器，ChessmanMemento充当备忘录，MementoCaretaker充当负责人，在MementoCaretaker中定义了一个ChessmanMemento类型的对象，用于存储备忘录。完整代码如下所示：  
```java
//象棋棋子类：原发器  
class Chessman {  
    private String label;  
    private int x;  
    private int y;  

    public Chessman(String label,int x,int y) {  
        this.label = label;  
        this.x = x;  
        this.y = y;  
    }  

    public void setLabel(String label) {  
        this.label = label;   
    }  

    public void setX(int x) {  
        this.x = x;   
    }  

    public void setY(int y) {  
        this.y = y;   
    }  

    public String getLabel() {  
        return (this.label);   
    }  

    public int getX() {  
        return (this.x);   
    }  

    public int getY() {  
        return (this.y);   
    }  

    //保存状态  
    public ChessmanMemento save() {  
        return new ChessmanMemento(this.label,this.x,this.y);  
    }  

    //恢复状态  
    public void restore(ChessmanMemento memento) {  
        this.label = memento.getLabel();  
        this.x = memento.getX();  
        this.y = memento.getY();  
    }  
}  

//象棋棋子备忘录类：备忘录  
class ChessmanMemento {  
    private String label;  
    private int x;  
    private int y;  

    public ChessmanMemento(String label,int x,int y) {  
        this.label = label;  
        this.x = x;  
        this.y = y;  
    }  

    public void setLabel(String label) {  
        this.label = label;   
    }  

    public void setX(int x) {  
        this.x = x;   
    }  

    public void setY(int y) {  
        this.y = y;   
    }  

    public String getLabel() {  
        return (this.label);   
    }  

    public int getX() {  
        return (this.x);   
    }  

    public int getY() {  
        return (this.y);   
    }     
}  

//象棋棋子备忘录管理类：负责人  
class MementoCaretaker {  
    private ChessmanMemento memento;  

    public ChessmanMemento getMemento() {  
        return memento;  
    }  

    public void setMemento(ChessmanMemento memento) {  
        this.memento = memento;  
    }  
}  
```

编写如下客户端测试代码：  
```java
class Client {  
    public static void main(String args[]) {  
        MementoCaretaker mc = new MementoCaretaker();  
        Chessman chess = new Chessman("车",1,1);  
        display(chess);  
        mc.setMemento(chess.save()); //保存状态       
        chess.setY(4);  
        display(chess);  
        mc.setMemento(chess.save()); //保存状态  
        display(chess);  
        chess.setX(5);  
        display(chess);  
        System.out.println("******悔棋******");     
        chess.restore(mc.getMemento()); //恢复状态  
        display(chess);  
    }  

    public static void display(Chessman chess) {  
        System.out.println("棋子" + chess.getLabel() + "当前位置为：" + "第" + chess.getX() + "行" + "第" + chess.getY() + "列。");  
    }  
}
```

编译并运行程序，输出结果如下：  
```
棋子车当前位置为：第1行第1列。
棋子车当前位置为：第1行第4列。
棋子车当前位置为：第1行第4列。
棋子车当前位置为：第5行第4列。
******悔棋******
棋子车当前位置为：第1行第4列。
```

## 撤销功能的实现——备忘录模式（四）

21.4 实现多次撤销

Sunny软件公司开发人员通过使用备忘录模式实现了中国象棋棋子的撤销操作，但是使用上述代码只能实现一次撤销，因为在负责人类中只定义一个备忘录对象来保存状态，后面保存的状态会将前一次保存的状态覆盖，但有时候用户需要撤销多步操作。如何实现多次撤销呢？本节将提供一种多次撤销的解决方案，那就是在负责人类中定义一个集合来存储多个备忘录，每个备忘录负责保存一个历史状态，在撤销时可以对备忘录集合进行逆向遍历，回到一个指定的历史状态，而且还可以对备忘录集合进行正向遍历，实现重做(Redo)操作，即取消撤销，让对象状态得到恢复。

改进之后的中国象棋棋子撤销功能结构图如图21-5所示：  
![图21-5改进之后的中国象棋棋子撤销功能结构图](../img/type3-06-05.jpeg)  

在图21-5中，我们对负责人类MementoCaretaker进行了修改，在其中定义了一个ArrayList类型的集合对象来存储多个备忘录，其代码如下所示：  
```java
import java.util.*;  

class MementoCaretaker {  
    //定义一个集合来存储多个备忘录  
    private ArrayList mementolist = new ArrayList();  

    public ChessmanMemento getMemento(int i) {  
        return (ChessmanMemento)mementolist.get(i);  
    }  

    public void setMemento(ChessmanMemento memento) {  
        mementolist.add(memento);  
    }  
}
```

编写如下客户端测试代码：  
```java
class Client {  
private static int index = -1; //定义一个索引来记录当前状态所在位置  
    private static MementoCaretaker mc = new MementoCaretaker();  

    public static void main(String args[]) {  
        Chessman chess = new Chessman("车",1,1);  
        play(chess);          
        chess.setY(4);  
        play(chess);  
        chess.setX(5);  
        play(chess);      
        undo(chess,index);  
        undo(chess,index);    
        redo(chess,index);  
        redo(chess,index);  
    }  

    //下棋  
    public static void play(Chessman chess) {  
        mc.setMemento(chess.save()); //保存备忘录  
        index ++;   
        System.out.println("棋子" + chess.getLabel() + "当前位置为：" + "第" + chess.getX() + "行" + "第" + chess.getY() + "列。");  
    }  

    //悔棋  
    public static void undo(Chessman chess,int i) {  
        System.out.println("******悔棋******");  
        index --;   
        chess.restore(mc.getMemento(i-1)); //撤销到上一个备忘录  
        System.out.println("棋子" + chess.getLabel() + "当前位置为：" + "第" + chess.getX() + "行" + "第" + chess.getY() + "列。");  
    }  

    //撤销悔棋  
    public static void redo(Chessman chess,int i) {  
        System.out.println("******撤销悔棋******");   
        index ++;   
        chess.restore(mc.getMemento(i+1)); //恢复到下一个备忘录  
        System.out.println("棋子" + chess.getLabel() + "当前位置为：" + "第" + chess.getX() + "行" + "第" + chess.getY() + "列。");  
    }  
}
```

编译并运行程序，输出结果如下：  
```
棋子车当前位置为：第1行第1列。
棋子车当前位置为：第1行第4列。
棋子车当前位置为：第5行第4列。
******悔棋******
棋子车当前位置为：第1行第4列。
******悔棋******
棋子车当前位置为：第1行第1列。
******撤销悔棋******
棋子车当前位置为：第1行第4列。
******撤销悔棋******
棋子车当前位置为：第5行第4列。
```

**扩展**  
> 本实例只能实现最简单的Undo和Redo操作，并未考虑对象状态在操作过程中出现分支的情况。如果在撤销到某个历史状态之后，用户再修改对象状态，此后执行Undo操作时可能会发生对象状态错误，大家可以思考其产生原因。【注：可将对象状态的改变绘制成一张树状图进行分析。】
>  
>  在实际开发中，可以使用链表或者堆栈来处理有分支的对象状态改变，大家可通过链表或者堆栈对上述实例进行改进。

## 撤销功能的实现——备忘录模式（五）

21.5 再谈备忘录的封装

备忘录是一个很特殊的对象，只有原发器对它拥有控制的权力，负责人只负责管理，而其他类无法访问到备忘录，因此我们需要对备忘录进行封装。

为了实现对备忘录对象的封装，需要对备忘录的调用进行控制，对于原发器而言，它可以调用备忘录的所有信息，允许原发器访问返回到先前状态所需的所有数据；对于负责人而言，只负责备忘录的保存并将备忘录传递给其他对象；对于其他对象而言，只需要从负责人处取出备忘录对象并将原发器对象的状态恢复，而无须关心备忘录的保存细节。理想的情况是只允许生成该备忘录的那个原发器访问备忘录的内部状态。

在实际开发中，原发器与备忘录之间的关系是非常特殊的，它们要分享信息而不让其他类知道，实现的方法因编程语言的不同而有所差异，在C++中可以使用friend关键字，让原发器类和备忘录类成为友元类，互相之间可以访问对象的一些私有的属性；在Java语言中可以将原发器类和备忘录类放在一个包中，让它们之间满足默认的包内可见性，也可以将备忘录类作为原发器类的内部类，使得只有原发器才可以访问备忘录中的数据，其他对象都无法使用备忘录中的数据。

**思考**  
> 如何使用内部类来实现备忘录模式？  

21.6 备忘录模式总结

备忘录模式在很多软件的使用过程中普遍存在，但是在应用软件开发中，它的使用频率并不太高，因为现在很多基于窗体和浏览器的应用软件并没有提供撤销操作。如果需要为软件提供撤销功能，备忘录模式无疑是一种很好的解决方案。在一些字处理软件、图像编辑软件、数据库管理系统等软件中备忘录模式都得到了很好的应用。

1.主要优点

备忘录模式的主要优点如下：

(1)它提供了一种状态恢复的实现机制，使得用户可以方便地回到一个特定的历史步骤，当新的状态无效或者存在问题时，可以使用暂时存储起来的备忘录将状态复原。

(2)备忘录实现了对信息的封装，一个备忘录对象是一种原发器对象状态的表示，不会被其他代码所改动。备忘录保存了原发器的状态，采用列表、堆栈等集合来存储备忘录对象可以实现多次撤销操作。

2.主要缺点

备忘录模式的主要缺点如下：

资源消耗过大，如果需要保存的原发器类的成员变量太多，就不可避免需要占用大量的存储空间，每保存一次对象的状态都需要消耗一定的系统资源。

3.适用场景

在以下情况下可以考虑使用备忘录模式：

(1)保存一个对象在某一个时刻的全部状态或部分状态，这样以后需要时它能够恢复到先前的状态，实现撤销操作。

(2)防止外界对象破坏一个对象历史状态的封装性，避免将对象历史状态的实现细节暴露给外界对象。

**练习**  
> Sunny软件公司正在开发一款RPG网游，为了给玩家提供更多方便，在游戏过程中可以设置一个恢复点，用于保存当前的游戏场景，如果在后续游戏过程中玩家角色“不幸牺牲”，可以返回到先前保存的场景，从所设恢复点开始重新游戏。试使用备忘录模式设计该功能。

> 练习会在[我的github](https://github.com/BruceOuyang/boy-design-pattern)上做掉

