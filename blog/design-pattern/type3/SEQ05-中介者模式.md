> 【学习难度：★★★☆☆，使用频率：★★☆☆☆】  
>  直接出处：[中介者模式](http://woquanke.com/books/gof/%E8%BF%AD%E4%BB%A3%E5%99%A8%E6%A8%A1%E5%BC%8F-Iterator%20Pattern.html)  
>  梳理和学习：https://github.com/BruceOuyang/boy-design-pattern  
>  简书日期： 2018/03/24  
>  简书首页：https://www.jianshu.com/p/0fb891a7c5ed  

## 协调多个对象之间的交互——中介者模式（一）

腾讯公司推出的QQ作为一款免费的即时聊天软件深受广大用户的喜爱，它已经成为很多人学习、工作和生活的一部分（不要告诉我你没有QQ哦）。在QQ聊天中，一般有两种聊天方式：第一种是用户与用户直接聊天，第二种是通过QQ群聊天，如图20-1所示。如果我们使用图20-1(A)所示方式，一个用户如果要与别的用户聊天或发送文件，通常需要加其他用户为好友，用户与用户之间存在多对多的联系，这将导致系统中用户之间的关系非常复杂，一个用户如果要将相同的信息或文件发送给其他所有用户，必须一个一个的发送，于是QQ群产生了，如图20-1(B)所示，如果使用QQ群，一个用户就可以向多个用户发送相同的信息和文件而无须一一进行发送，只需要将信息或文件发送到群中或作为群共享即可，群的作用就是将发送者所发送的信息和文件转发给每一个接收者用户。通过引入群的机制，将极大减少系统中用户之间的两两通信，用户与用户之间的联系可以通过群来实现。  
![图20-1 QQ聊天示意图](../img/type3-05-01.jpeg)  

在有些软件中，某些类/对象之间的相互调用关系错综复杂，类似QQ用户之间的关系，此时，我们特别需要一个类似“QQ群”一样的中间类来协调这些类/对象之间的复杂关系，以降低系统的耦合度。有一个设计模式正为此而诞生，它就是本章将要介绍的中介者模式。

20.1 客户信息管理窗口的初始设计

Sunny软件公司欲开发一套CRM系统，其中包含一个客户信息管理模块，所设计的“客户信息管理窗口”界面效果图如图20-2所示：  
![图20-2 “客户信息管理窗口”界面图](../img/type3-05-02.jpeg)  

Sunny公司开发人员通过分析发现，在图20-2中，界面组件之间存在较为复杂的交互关系：如果删除一个客户，要在客户列表(List)中删掉对应的项，客户选择组合框(ComboBox)中客户名称也将减少一个；如果增加一个客户信息，客户列表中需增加一个客户，且组合框中也将增加一项。

如果实现界面组件之间的交互是Sunny公司开发人员必须面对的一个问题？

Sunny公司开发人员对组件之间的交互关系进行了分析，结果如下：

(1) 当用户单击“增加”按钮、“删除”按钮、“修改”按钮或“查询”按钮时，界面左侧的“客户选择组合框”、“客户列表”以及界面中的文本框将产生响应。

(2) 当用户通过“客户选择组合框”选中某个客户姓名时，“客户列表”和文本框将产生响应。

(3) 当用户通过“客户列表”选中某个客户姓名时，“客户选择组合框”和文本框将产生响应。

于是，Sunny公司开发人员根据组件之间的交互关系绘制了如图20-3所示初始类图：  
![图20-3 “客户信息管理窗口”原始类图](../img/type3-05-03.jpeg)  

与类图20-3所对应的框架代码片段如下：  
```java
//按钮类  
class Button {  
    private List list;  
    private ComboBox cb;  
    private TextBox tb;  
    ......  

    //界面组件的交互  
    public void change() {  
        list.update();  
        cb.update();  
        tb.update();  
    }  

    public void update() {  
        ......  
    }  
    ......  
}  

//列表框类  
class List {  
    private ComboBox cb;  
    private TextBox tb;  
    ......  

//界面组件的交互  
    public void change() {  
        cb.update();  
        tb.update();  
    }  

    public void update() {  
        ......  
    }  
    ......    
}  

//组合框类  
class ComboBox {  
    private List list;  
    private TextBox tb;  
    ......  

//界面组件的交互  
    public void change() {  
        list.update();  
        tb.update();  
    }  

    public void update() {  
        ......  
    }  
    ......    
}  

//文本框类  
class TextBox {  
    public void update() {  
        ......  
    }  
    ......    
}
```

分析图20-3所示初始结构图和上述代码，我们不难发现该设计方案存在如下问题：  

(1) 系统结构复杂且耦合度高：每一个界面组件都与多个其他组件之间产生相互关联和调用，若一个界面组件对象发生变化，需要跟踪与之有关联的其他所有组件并进行处理，系统组件之间呈现一种较为复杂的网状结构，组件之间的耦合度高。

(2) 组件的可重用性差：由于每一个组件和其他组件之间都具有很强的关联，若没有其他组件的支持，一个组件很难被另一个系统或模块重用，这些组件表现出来更像一个不可分割的整体，而在实际使用时，我们往往需要每一个组件都能够单独重用，而不是重用一个由多个组件组成的复杂结构。

(3) 系统的可扩展性差：如果在上述系统中增加一个新的组件类，则必须修改与之交互的其他组件类的源代码，将导致多个类的源代码需要修改，同样，如果要删除一个组件也存在类似的问题，这违反了“开闭原则”，可扩展性和灵活性欠佳。

> 由于存在上述问题，Sunny公司开发人员不得不对原有系统进行重构，那如何重构呢？大家想到了“迪米特法则”，引入一个“第三者”来降低现有系统中类之间的耦合度。由这个“第三者”来封装并协调原有组件两两之间复杂的引用关系，使之成为一个松耦合的系统，这个“第三者”又称为“中介者”，中介者模式因此而得名。下面让我们正式进入中介者模式的学习，学会如何使用中介者类来协调多个类/对象之间的交互，以达到降低系统耦合度的目的。

## 协调多个对象之间的交互——中介者模式（二）

20.2 中介者模式概述

如果在一个系统中对象之间的联系呈现为网状结构，如图20-4所示。对象之间存在大量的多对多联系，将导致系统非常复杂，这些对象既会影响别的对象，也会被别的对象所影响，这些对象称为同事对象，它们之间通过彼此的相互作用实现系统的行为。在网状结构中，几乎每个对象都需要与其他对象发生相互作用，而这种相互作用表现为一个对象与另外一个对象的直接耦合，这将导致一个过度耦合的系统。  
![图20-4 对象之间存在复杂关系的网状结构](../img/type3-05-04.jpeg)  

中介者模式可以使对象之间的关系数量急剧减少，通过引入中介者对象，可以将系统的网状结构变成以中介者为中心的星形结构，如图20-5所示。在这个星形结构中，同事对象不再直接与另一个对象联系，它通过中介者对象与另一个对象发生相互作用。中介者对象的存在保证了对象结构上的稳定，也就是说，系统的结构不会因为新对象的引入带来大量的修改工作。  
![图20-5 引入中介者对象的星型结构](../img/type3-05-05.jpeg)

如果在一个系统中对象之间存在多对多的相互关系，我们可以将对象之间的一些交互行为从各个对象中分离出来，并集中封装在一个中介者对象中，并由该中介者进行统一协调，这样对象之间多对多的复杂关系就转化为相对简单的一对多关系。通过引入中介者来简化对象之间的复杂交互，中介者模式是“迪米特法则”的一个典型应用。

中介者模式定义如下：

> 中介者模式(Mediator Pattern)：用一个中介对象（中介者）来封装一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。中介者模式又称为调停者模式，它是一种对象行为型模式。

在中介者模式中，我们引入了用于协调其他对象/类之间相互调用的中介者类，为了让系统具有更好的灵活性和可扩展性，通常还提供了抽象中介者，其结构图如图20-6所示：  
![图20-6 中介者模式结构图](../img/type3-05-06.jpeg)  

在中介者模式结构图中包含如下几个角色：

* Mediator（抽象中介者）：它定义一个接口，该接口用于与各同事对象之间进行通信。

* ConcreteMediator（具体中介者）：它是抽象中介者的子类，通过协调各个同事对象来实现协作行为，它维持了对各个同事对象的引用。

* Colleague（抽象同事类）：它定义各个同事类公有的方法，并声明了一些抽象方法来供子类实现，同时它维持了一个对抽象中介者类的引用，其子类可以通过该引用来与中介者通信。

* ConcreteColleague（具体同事类）：它是抽象同事类的子类；每一个同事对象在需要和其他同事对象通信时，先与中介者通信，通过中介者来间接完成与其他同事类的通信；在具体同事类中实现了在抽象同事类中声明的抽象方法。

中介者模式的核心在于中介者类的引入，在中介者模式中，中介者类承担了两方面的职责：

(1) 中转作用（结构性）：通过中介者提供的中转作用，各个同事对象就不再需要显式引用其他同事，当需要和其他同事进行通信时，可通过中介者来实现间接调用。该中转作用属于中介者在结构上的支持。 

(2) 协调作用（行为性）：中介者可以更进一步的对同事之间的关系进行封装，同事可以一致的和中介者进行交互，而不需要指明中介者需要具体怎么做，中介者根据封装在自身内部的协调逻辑，对同事的请求进行进一步处理，将同事成员之间的关系行为进行分离和封装。该协调作用属于中介者在行为上的支持。

在中介者模式中，典型的抽象中介者类代码如下所示：
```java
abstract class Mediator {  
    protected ArrayList<Colleague> colleagues; //用于存储同事对象  

    //注册方法，用于增加同事对象  
    public void register(Colleague colleague) {  
        colleagues.add(colleague);  
    }  

    //声明抽象的业务方法  
    public abstract void operation();  
} 
```

在抽象中介者中可以定义一个同事类的集合，用于存储同事对象并提供注册方法，同时声明了具体中介者类所具有的方法。在具体中介者类中将实现这些抽象方法，典型的具体中介者类代码如下所示：  
```java
class ConcreteMediator extends Mediator {  
    //实现业务方法，封装同事之间的调用  
    public void operation() {  
        ......  
        ((Colleague)(colleagues.get(0))).method1(); //通过中介者调用同事类的方法  
        ......  
    }  
}
```

在具体中介者类中将调用同事类的方法，调用时可以增加一些自己的业务代码对调用进行控制。

在抽象同事类中维持了一个抽象中介者的引用，用于调用中介者的方法，典型的抽象同事类代码如下所示：  
```java
abstract class Colleague {  
    protected Mediator mediator; //维持一个抽象中介者的引用  

    public Colleague(Mediator mediator) {  
        this.mediator=mediator;  
    }  

    public abstract void method1(); //声明自身方法，处理自己的行为  

    //定义依赖方法，与中介者进行通信  
    public void method2() {  
        mediator.operation();  
    }  
}
```

在抽象同事类中声明了同事类的抽象方法，而在具体同事类中将实现这些方法，典型的具体同事类代码如下所示：  
```java
class ConcreteColleague extends Colleague {  
    public ConcreteColleague(Mediator mediator) {  
        super(mediator);  
    }  

    //实现自身方法  
    public void method1() {  
        ......  
    }  
}
```

在具体同事类ConcreteColleague中实现了在抽象同事类中声明的方法，其中方法method1()是同事类的自身方法(Self-Method)，用于处理自己的行为，而方法method2()是依赖方法(Depend-Method)，用于调用在中介者中定义的方法，依赖中介者来完成相应的行为，例如调用另一个同事类的相关方法。

**思考**
> 如何理解同事类中的自身方法与依赖方法？

## 协调多个对象之间的交互——中介者模式（三）

20.3 完整解决方案

为了协调界面组件对象之间的复杂交互关系，Sunny公司开发人员使用中介者模式来设计客户信息管理窗口，其结构示意图如图20-7所示：  
![图20-7 引入了中介者类的“客户信息管理窗口”结构示意图](../img/type3-05-07.jpeg)  

图20-7只是一个重构之后的结构示意图，在具体实现时，为了确保系统具有更好的灵活性和可扩展性，我们需要定义抽象中介者和抽象组件类，其中抽象组件类是所有具体组件类的公共父类，完整类图如图20-8所示：  
![图20-8 重构后的“客户信息管理窗口”结构图](../img/type3-05-08.jpeg)  

在图20-8中，Component充当抽象同事类，Button、List、ComboBox和TextBox充当具体同事类，Mediator充当抽象中介者类，ConcreteMediator充当具体中介者类，ConcreteMediator维持了对具体同事类的引用，为了简化ConcreteMediator类的代码，我们在其中只定义了一个Button对象和一个TextBox对象。完整代码如下所示：  
```java
//抽象中介者  
abstract class Mediator {  
    public abstract void componentChanged(Component c);  
}  

//具体中介者  
class ConcreteMediator extends Mediator {  
    //维持对各个同事对象的引用  
    public Button addButton;  
    public List list;  
    public TextBox userNameTextBox;  
    public ComboBox cb;  

    //封装同事对象之间的交互  
    public void componentChanged(Component c) {  
        //单击按钮  
if(c == addButton) {  
            System.out.println("--单击增加按钮--");  
            list.update();  
            cb.update();  
            userNameTextBox.update();  
        }  
        //从列表框选择客户  
        else if(c == list) {  
            System.out.println("--从列表框选择客户--");  
            cb.select();  
            userNameTextBox.setText();  
        }  
        //从组合框选择客户  
        else if(c == cb) {  
            System.out.println("--从组合框选择客户--");  
            cb.select();  
            userNameTextBox.setText();  
        }  
    }  
}  

//抽象组件类：抽象同事类  
abstract class Component {  
    protected Mediator mediator;  

    public void setMediator(Mediator mediator) {  
        this.mediator = mediator;  
    }  

    //转发调用  
    public void changed() {  
        mediator.componentChanged(this);  
    }  

    public abstract void update();    
}  

//按钮类：具体同事类  
class Button extends Component {  
    public void update() {  
        //按钮不产生交互  
    }  
}  

//列表框类：具体同事类  
class List extends Component {  
    public void update() {  
        System.out.println("列表框增加一项：张无忌。");  
    }  

    public void select() {  
        System.out.println("列表框选中项：小龙女。");  
    }  
}  

//组合框类：具体同事类  
class ComboBox extends Component {  
    public void update() {  
        System.out.println("组合框增加一项：张无忌。");  
    }  

    public void select() {  
        System.out.println("组合框选中项：小龙女。");  
    }  
}  

//文本框类：具体同事类  
class TextBox extends Component {  
    public void update() {  
        System.out.println("客户信息增加成功后文本框清空。");  
    }  

    public void setText() {  
        System.out.println("文本框显示：小龙女。");  
    }  
}
```

编写如下客户端测试代码：  
```java
class Client {  
    public static void main(String args[]) {  
        //定义中介者对象  
        ConcreteMediator mediator;  
        mediator = new ConcreteMediator();  

        //定义同事对象  
        Button addBT = new Button();  
        List list = new List();  
        ComboBox cb = new ComboBox();  
        TextBox userNameTB = new TextBox();  

        addBT.setMediator(mediator);  
        list.setMediator(mediator);  
        cb.setMediator(mediator);  
        userNameTB.setMediator(mediator);  

        mediator.addButton = addBT;  
        mediator.list = list;  
        mediator.cb = cb;  
        mediator.userNameTextBox = userNameTB;  

        addBT.changed();  
        System.out.println("-----------------------------");  
        list.changed();  
    }  
}
```

编译并运行程序，输出结果如下：  
```
--单击增加按钮--
列表框增加一项：张无忌。
组合框增加一项：张无忌。
客户信息增加成功后文本框清空。
-----------------------------
--从列表框选择客户--
组合框选中项：小龙女。
文本框显示：小龙女。
```

## 协调多个对象之间的交互——中介者模式（四）

20.4 中介者与同事类的扩展

Sunny软件公司CRM系统的客户对“客户信息管理窗口”提出了一个修改意见：要求在窗口的下端能够及时显示当前系统中客户信息的总数。修改之后的界面如图20-9所示：  
![图20-9 修改之后的“客户信息管理窗口”界面图](../img/type3-05-09.jpeg)  

从图20-9中我们不难发现，可以通过增加一个文本标签(Label)来显示客户信息总数，而且当用户点击“增加”按钮或者“删除”按钮时，将改变文本标签的内容。

由于使用了中介者模式，在原有系统中增加新的组件（即新的同事类）将变得很容易，我们至少有如下两种解决方案：

【解决方案一】增加一个界面组件类Label，修改原有的具体中介者类ConcreteMediator，增加一个对Label对象的引用，然后修改componentChanged()方法中其他相关组件对象的业务处理代码，原有组件类无须任何修改，客户端代码也需针对新增组件Label进行适当修改。

【解决方案二】与方案一相同，首先增加一个Label类，但不修改原有具体中介者类ConcreteMediator的代码，而是增加一个ConcreteMediator的子类SubConcreteMediator来实现对Label对象的引用，然后在新增的中介者类SubConcreteMediator中通过覆盖componentChanged()方法来实现所有组件（包括新增Label组件）之间的交互，同样，原有组件类无须做任何修改，客户端代码需少许修改。

引入Label之后“客户信息管理窗口”类结构示意图如图20-10所示：  
![图20-10 增加Label组件类后的“客户信息管理窗口”结构示意图](../img/type3-05-10.jpeg)  

由于【解决方案二】无须修改ConcreteMediator类，更符合“开闭原则”，因此我们选择该解决方案来对新增Label类进行处理，对应的完整类图如图20-11所示：  
![图20-11 修改之后的“客户信息管理窗口”结构图](../img/type3-05-11.jpeg)
  

在图20-11中，新增了具体同事类Label和具体中介者类SubConcreteMediator，代码如下所示：  
```java
//文本标签类：具体同事类  
class Label extends Component {  
    public void update() {  
        System.out.println("文本标签内容改变，客户信息总数加1。");  
    }  
}  

//新增具体中介者类  
class SubConcreteMediator extends ConcreteMediator {  
    //增加对Label对象的引用  
    public Label label;  

    public void componentChanged(Component c) {  
        //单击按钮  
if(c == addButton) {  
            System.out.println("--单击增加按钮--");  
            list.update();  
            cb.update();  
            userNameTextBox.update();  
            label.update(); //文本标签更新  
        }  
        //从列表框选择客户  
        else if(c == list) {  
            System.out.println("--从列表框选择客户--");  
            cb.select();  
            userNameTextBox.setText();  
        }  
        //从组合框选择客户  
        else if(c == cb) {  
            System.out.println("--从组合框选择客户--");  
            cb.select();  
            userNameTextBox.setText();  
        }  
    }  
}
```

修改客户端测试代码：  
```java
class Client {  
    public static void main(String args[]) {  
        //用新增具体中介者定义中介者对象  
        SubConcreteMediator mediator;  
        mediator = new SubConcreteMediator();  

        Button addBT = new Button();  
        List list = new List();  
        ComboBox cb = new ComboBox();  
        TextBox userNameTB = new TextBox();  
        Label label = new Label();  

        addBT.setMediator(mediator);  
        list.setMediator(mediator);  
        cb.setMediator(mediator);  
        userNameTB.setMediator(mediator);  
        label.setMediator(mediator);  

        mediator.addButton = addBT;  
        mediator.list = list;  
        mediator.cb = cb;  
        mediator.userNameTextBox = userNameTB;  
        mediator.label = label;  

        addBT.changed();  
        System.out.println("-----------------------------");  
        list.changed();  
    }  
}
```

编译并运行程序，输出结果如下：  
```
--单击增加按钮--
列表框增加一项：张无忌。
组合框增加一项：张无忌。
客户信息增加成功后文本框清空。
文本标签内容改变，客户信息总数加1。
-----------------------------
--从列表框选择客户--
组合框选中项：小龙女。
文本框显示：小龙女。
```

由于在本实例中不同的组件类（即不同的同事类）所拥有的方法并不完全相同，因此中介者类没有针对抽象同事类编程，导致在具体中介者类中需要维持对具体同事类的引用，客户端代码无法完全透明地对待所有同事类和中介者类。在某些情况下，如果设计得当，可以在客户端透明地对同事类和中介者类编程，这样系统将具有更好的灵活性和可扩展性。

**思考**

> 如果不使用中介者模式，按照图20-3所示设计方案，增加新组件时原有系统该如何修改？

在中介者模式的实际使用过程中，如果需要引入新的具体同事类，只需要继承抽象同事类并实现其中的方法即可，由于具体同事类之间并无直接的引用关系，因此原有所有同事类无须进行任何修改，它们与新增同事对象之间的交互可以通过修改或者增加具体中介者类来实现；如果需要在原有系统中增加新的具体中介者类，只需要继承抽象中介者类（或已有的具体中介者类）并覆盖其中定义的方法即可，在新的具体中介者中可以通过不同的方式来处理对象之间的交互，也可以增加对新增同事的引用和调用。在客户端中只需要修改少许代码（如果引入配置文件的话有时可以不修改任何代码）就可以实现中介者的更换。

## 协调多个对象之间的交互——中介者模式（五）

20.4 中介者模式总结

中介者模式将一个网状的系统结构变成一个以中介者对象为中心的星形结构，在这个星型结构中，使用中介者对象与其他对象的一对多关系来取代原有对象之间的多对多关系。中介者模式在事件驱动类软件中应用较为广泛，特别是基于GUI（Graphical User Interface，图形用户界面）的应用软件，此外，在类与类之间存在错综复杂的关联关系的系统中，中介者模式都能得到较好的应用。

1. 主要优点
中介者模式的主要优点如下：

(1) 中介者模式简化了对象之间的交互，它用中介者和同事的一对多交互代替了原来同事之间的多对多交互，一对多关系更容易理解、维护和扩展，将原本难以理解的网状结构转换成相对简单的星型结构。

(2) 中介者模式可将各同事对象解耦。中介者有利于各同事之间的松耦合，我们可以独立的改变和复用每一个同事和中介者，增加新的中介者和新的同事类都比较方便，更好地符合“开闭原则”。

(3) 可以减少子类生成，中介者将原本分布于多个对象间的行为集中在一起，改变这些行为只需生成新的中介者子类即可，这使各个同事类可被重用，无须对同事类进行扩展。

2. 主要缺点
中介者模式的主要缺点如下：

在具体中介者类中包含了大量同事之间的交互细节，可能会导致具体中介者类非常复杂，使得系统难以维护。

3. 适用场景

在以下情况下可以考虑使用中介者模式：

(1) 系统中对象之间存在复杂的引用关系，系统结构混乱且难以理解。

(2) 一个对象由于引用了其他很多对象并且直接和这些对象通信，导致难以复用该对象。

(3) 想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类。可以通过引入中介者类来实现，在中介者中定义对象交互的公共行为，如果需要改变行为则可以增加新的具体中介者类。

**练习**

> Sunny软件公司欲开发一套图形界面类库。该类库需要包含若干预定义的窗格(Pane)对象，例如TextPane、ListPane、GraphicPane等，窗格之间不允许直接引用。基于该类库的应用由一个包含一组窗格的窗口(Window)组成，窗口需要协调窗格之间的行为。试采用中介者模式设计该系统。

2010年上半年 软件设计师 下午试卷 第三题

【说明】

某运输公司决定为新的售票机开发车票销售的控制软件。图I给出了售票机的面板示意图以及相关的控制部件。
![图I 售票机面板示意图](../img/type3-05-12.jpeg)  

售票机相关部件的作用如下所述：

(1) 目的地键盘用来输入行程目的地的代码（例如，200表示总站）。

(2) 乘客可以通过车票键盘选择车票种类（单程票、多次往返票和座席种类）。

(3) 继续/取消键盘上的取消按钮用于取消购票过程，继续按钮允许乘客连续购买多张票。

(4) 显示屏显示所有的系统输出和用户提示信息。

(5) 插卡口接受MCard（现金卡），硬币口和纸币槽接受现金。

(6) 打印机用于输出车票。

(7) 所有部件均可实现自检并恢复到初始状态。

现采用面向对象方法开发该系统，使用UML进行建模，系统的顶层用例图和类图分别如图II和图III所示。

图II 顶层用例图
![图III 类图](../img/type3-05-13.jpeg)  

【问题1】

根据说明中的描述，给出图II中A1和A2所对应的执行者，U1所对应的用例，以及(1)、(2)处所对应的关系。

【问题2】

根据说明中的描述，给出图III中缺少的C1-C4所对应的类名以及(3)-(6)处所对应的多重度。

【问题3】

图III中的类图设计采用了中介者(Mediator)设计模式，请说明该模式的内涵。

> 练习会在[我的github](https://github.com/BruceOuyang/boy-design-pattern)上做掉

