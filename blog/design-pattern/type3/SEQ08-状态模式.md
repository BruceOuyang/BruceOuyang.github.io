> 【学习难度：★★★☆☆，使用频率：★★★☆☆】  
>  直接出处：[状态模式](http://woquanke.com/books/gof/%E7%8A%B6%E6%80%81%E6%A8%A1%E5%BC%8F-State%20Pattern.html)  
>  梳理和学习：https://github.com/BruceOuyang/boy-design-pattern  
>  简书日期： 2018/03/29  
>  简书首页：https://www.jianshu.com/p/0fb891a7c5ed  

## 处理对象的多种状态及其相互转换——状态模式（一）

“人有悲欢离合，月有阴晴圆缺”，包括人在内，很多事物都具有多种状态，而且在不同状态下会具有不同的行为，这些状态在特定条件下还将发生相互转换。就像水，它可以凝固成冰，也可以受热蒸发后变成水蒸汽，水可以流动，冰可以雕刻，蒸汽可以扩散。我们可以用UML状态图来描述H2O的三种状态，如图1所示：  
![图1 H2O的三种状态（未考虑临界点）](../img/type3-08-01.jpeg)  

在软件系统中，有些对象也像水一样具有多种状态，这些状态在某些情况下能够相互转换，而且对象在不同的状态下也将具有不同的行为。为了更好地对这些具有多种状态的对象进行设计，我们可以使用一种被称之为状态模式的设计模式，本章我们将学习用于描述对象状态及其转换的状态模式。

1.银行系统中的账户类设计

Sunny软件公司欲为某银行开发一套信用卡业务系统，银行账户(Account)是该系统的核心类之一，通过分析，Sunny软件公司开发人员发现在该系统中，账户存在三种状态，且在不同状态下账户存在不同的行为，具体说明如下：

(1) 如果账户中余额大于等于0，则账户的状态为正常状态(Normal State)，此时用户既可以向该账户存款也可以从该账户取款；

(2) 如果账户中余额小于0，并且大于-2000，则账户的状态为透支状态(Overdraft State)，此时用户既可以向该账户存款也可以从该账户取款，但需要按天计算利息；

(3) 如果账户中余额等于-2000，那么账户的状态为受限状态(Restricted State)，此时用户只能向该账户存款，不能再从中取款，同时也将按天计算利息；

(4) 根据余额的不同，以上三种状态可发生相互转换。

Sunny软件公司开发人员对银行账户类进行分析，绘制了如图2所示UML状态图：  
![图2 银行账户状态图](../img/type3-08-02.jpeg)  

在图2中，NormalState表示正常状态，OverdraftState表示透支状态，RestrictedState表示受限状态，在这三种状态下账户对象拥有不同的行为，方法deposit()用于存款，withdraw()用于取款，computeInterest()用于计算利息，stateCheck()用于在每一次执行存款和取款操作后根据余额来判断是否要进行状态转换并实现状态转换，相同的方法在不同的状态中可能会有不同的实现。为了实现不同状态下对象的各种行为以及对象状态之间的相互转换，Sunny软件公司开发人员设计了一个较为庞大的账户类Account，其中部分代码如下所示：  
```java
class Account {  
    private String state; //状态  
    private int balance; //余额  
    
    // ......  

    //存款操作    
    public void deposit() {  
        //存款  
        stateCheck();     
    }  

    //取款操作  
    public void withdraw() {  
        if (state.equalsIgnoreCase("NormalState") || state.equalsIgnoreCase("OverdraftState ")) {  
            //取款  
            stateCheck();  
        }  
        else {  
            //取款受限  
        }  
    }  

    //计算利息操作  
    public void computeInterest() {  
        if(state.equalsIgnoreCase("OverdraftState") || state.equalsIgnoreCase("RestrictedState ")) {  
            //计算利息  
        }  
    }  

    //状态检查和转换操作  
    public void stateCheck() {  
        if (balance >= 0) {  
            state = "NormalState";  
        }  
        else if (balance > -2000 && balance < 0) {  
            state = "OverdraftState";  
        }  
        else if (balance == -2000) {  
            state = "RestrictedState";  
        }  
        else if (balance < -2000) {  
            //操作受限  
        }  
    }  
    // ......  
}
```

分析上述代码，我们不难发现存在如下几个问题：

(1) 几乎每个方法中都包含状态判断语句，以判断在该状态下是否具有该方法以及在特定状态下该方法如何实现，导致代码非常冗长，可维护性较差；

(2) 拥有一个较为复杂的stateCheck()方法，包含大量的if…else if…else…语句用于进行状态转换，代码测试难度较大，且不易于维护；

(3) 系统扩展性较差，如果需要增加一种新的状态，如冻结状态（Frozen State，在该状态下既不允许存款也不允许取款），需要对原有代码进行大量修改，扩展起来非常麻烦。

为了解决这些问题，我们可以使用状态模式，在状态模式中，我们将对象在每一个状态下的行为和状态转移语句封装在一个个状态类中，通过这些状态类来分散冗长的条件转移语句，让系统具有更好的灵活性和可扩展性，状态模式可以在一定程度上解决上述问题。

## 处理对象的多种状态及其相互转换——状态模式（二）

2.状态模式概述

状态模式用于解决系统中复杂对象的状态转换以及不同状态下行为的封装问题。当系统中某个对象存在多个状态，这些状态之间可以进行转换，而且对象在不同状态下行为不相同时可以使用状态模式。状态模式将一个对象的状态从该对象中分离出来，封装到专门的状态类中，使得对象状态可以灵活变化，对于客户端而言，无须关心对象状态的转换以及对象所处的当前状态，无论对于何种状态的对象，客户端都可以一致处理。

状态模式定义如下：

状态模式(State Pattern)：允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。其别名为状态对象(Objects for States)，状态模式是一种对象行为型模式。

在状态模式中引入了抽象状态类和具体状态类，它们是状态模式的核心，其结构如图3所示：  
![图3 状态模式结构图](../img/type3-08-03.jpeg)  

在状态模式结构图中包含如下几个角色：

* Context（环境类）：环境类又称为上下文类，它是拥有多种状态的对象。由于环境类的状态存在多样性且在不同状态下对象的行为有所不同，因此将状态独立出去形成单独的状态类。在环境类中维护一个抽象状态类State的实例，这个实例定义当前状态，在具体实现时，它是一个State子类的对象。

* State（抽象状态类）：它用于定义一个接口以封装与环境类的一个特定状态相关的行为，在抽象状态类中声明了各种不同状态对应的方法，而在其子类中实现类这些方法，由于不同状态下对象的行为可能不同，因此在不同子类中方法的实现可能存在不同，相同的方法可以写在抽象状态类中。

* ConcreteState（具体状态类）：它是抽象状态类的子类，每一个子类实现一个与环境类的一个状态相关的行为，每一个具体状态类对应环境的一个具体状态，不同的具体状态类其行为有所不同。

在状态模式中，我们将对象在不同状态下的行为封装到不同的状态类中，为了让系统具有更好的灵活性和可扩展性，同时对各状态下的共有行为进行封装，我们需要对状态进行抽象，引入了抽象状态类角色，其典型代码如下所示：  
```java
abstract class State {  
    //声明抽象业务方法，不同的具体状态类可以不同的实现  
    public abstract void handle();  
}
```

在抽象状态类的子类即具体状态类中实现了在抽象状态类中声明的业务方法，不同的具体状态类可以提供完全不同的方法实现，在实际使用时，在一个状态类中可能包含多个业务方法，如果在具体状态类中某些业务方法的实现完全相同，可以将这些方法移至抽象状态类，实现代码的复用，典型的具体状态类代码如下所示：  
```java
class ConcreteState extends State {  
    public void handle() {  
        //方法具体实现代码  
    }  
}
```

环境类维持一个对抽象状态类的引用，通过setState()方法可以向环境类注入不同的状态对象，再在环境类的业务方法中调用状态对象的方法，典型代码如下所示：  
```java
class Context {  
    private State state; //维持一个对抽象状态对象的引用  
    private int value; //其他属性值，该属性值的变化可能会导致对象状态发生变化  

    //设置状态对象  
    public void setState(State state) {  
        this.state = state;  
    }  

    public void request() {  
        //其他代码  
        state.handle(); //调用状态对象的业务方法  
        //其他代码  
    }  
}
```

环境类实际上是真正拥有状态的对象，我们只是将环境类中与状态有关的代码提取出来封装到专门的状态类中。在状态模式结构图中，环境类Context与抽象状态类State之间存在单向关联关系，在Context中定义了一个State对象。在实际使用时，它们之间可能存在更为复杂的关系，State与Context之间可能也存在依赖或者关联关系。

在状态模式的使用过程中，一个对象的状态之间还可以进行相互转换，通常有两种实现状态转换的方式：

(1) 统一由环境类来负责状态之间的转换，此时，环境类还充当了状态管理器(State Manager)角色，在环境类的业务方法中通过对某些属性值的判断实现状态转换，还可以提供一个专门的方法用于实现属性判断和状态转换，如下代码片段所示：  
```java
//……  
     public void changeState() {  
        //判断属性值，根据属性值进行状态转换  
         if (value == 0) {  
            this.setState(new ConcreteStateA());  
        }  
        else if (value == 1) {  
            this.setState(new ConcreteStateB());  
        }  
        //......  
    }  
//……
```

(2) 由具体状态类来负责状态之间的转换，可以在具体状态类的业务方法中判断环境类的某些属性值再根据情况为环境类设置新的状态对象，实现状态转换，同样，也可以提供一个专门的方法来负责属性值的判断和状态转换。此时，状态类与环境类之间就将存在依赖或关联关系，因为状态类需要访问环境类中的属性值，如下代码片段所示：  
```java
//……  
     public void changeState(Context ctx) {  
        //根据环境对象中的属性值进行状态转换  
        if (ctx.getValue() == 1) {  
            ctx.setState(new ConcreteStateB());  
        }  
        else if (ctx.getValue() == 2) {  
            ctx.setState(new ConcreteStateC());  
        }  
        //......  
     }
//……
```

**思考**  
> 理解两种状态转换方式的异同？  

## 处理对象的多种状态及其相互转换——状态模式（三）

3.完整解决方案

Sunny软件公司开发人员使用状态模式来解决账户状态的转换问题，客户端只需要执行简单的存款和取款操作，系统根据余额将自动转换到相应的状态，其基本结构如图4所示：  
![图4 银行账户结构图](../img/type3-08-04.jpeg)  

在图4中，Account充当环境类角色，AccountState充当抽象状态角色，NormalState、OverdraftState和RestrictedState充当具体状态角色。完整代码如下所示（温馨提示：代码有点长，需要有耐心！）：  
```java
//银行账户：环境类  
class Account {  
    private AccountState state; //维持一个对抽象状态对象的引用  
    private String owner; //开户名  
    private double balance = 0; //账户余额  

    public Account(String owner,double init) {  
        this.owner = owner;  
        this.balance = balance;  
        this.state = new NormalState(this); //设置初始状态  
        System.out.println(this.owner + "开户，初始金额为" + init);   
        System.out.println("---------------------------------------------");      
    }  

    public double getBalance() {  
        return this.balance;  
    }  

    public void setBalance(double balance) {  
        this.balance = balance;  
    }  

    public void setState(AccountState state) {  
        this.state = state;  
    }  

    public void deposit(double amount) {  
        System.out.println(this.owner + "存款" + amount);  
        state.deposit(amount); //调用状态对象的deposit()方法  
        System.out.println("现在余额为"+ this.balance);  
        System.out.println("现在帐户状态为"+ this.state.getClass().getName());  
        System.out.println("---------------------------------------------");              
    }  

    public void withdraw(double amount) {  
        System.out.println(this.owner + "取款" + amount);  
        state.withdraw(amount); //调用状态对象的withdraw()方法  
        System.out.println("现在余额为"+ this.balance);  
        System.out.println("现在帐户状态为"+ this. state.getClass().getName());          
        System.out.println("---------------------------------------------");  
    }  

    public void computeInterest()  
    {  
        state.computeInterest(); //调用状态对象的computeInterest()方法  
    }  
}  

//抽象状态类  
abstract class AccountState {  
    protected Account acc;  
    public abstract void deposit(double amount);  
    public abstract void withdraw(double amount);  
    public abstract void computeInterest();  
    public abstract void stateCheck();  
}  

//正常状态：具体状态类  
class NormalState extends AccountState {  
    public NormalState(Account acc) {  
        this.acc = acc;  
    }  

public NormalState(AccountState state) {  
        this.acc = state.acc;  
    }  

    public void deposit(double amount) {  
        acc.setBalance(acc.getBalance() + amount);  
        stateCheck();  
    }  

    public void withdraw(double amount) {  
        acc.setBalance(acc.getBalance() - amount);  
        stateCheck();  
    }  

    public void computeInterest()  
    {  
        System.out.println("正常状态，无须支付利息！");  
    }  

    //状态转换  
    public void stateCheck() {  
        if (acc.getBalance() > -2000 && acc.getBalance() <= 0) {  
            acc.setState(new OverdraftState(this));  
        }  
        else if (acc.getBalance() == -2000) {  
            acc.setState(new RestrictedState(this));  
        }  
        else if (acc.getBalance() < -2000) {  
            System.out.println("操作受限！");  
        }     
    }     
}    

//透支状态：具体状态类  
class OverdraftState extends AccountState  
{  
    public OverdraftState(AccountState state) {  
        this.acc = state.acc;  
    }  

    public void deposit(double amount) {  
        acc.setBalance(acc.getBalance() + amount);  
        stateCheck();  
    }  

    public void withdraw(double amount) {  
        acc.setBalance(acc.getBalance() - amount);  
        stateCheck();  
    }  

    public void computeInterest() {  
        System.out.println("计算利息！");  
    }  

    //状态转换  
    public void stateCheck() {  
        if (acc.getBalance() > 0) {  
            acc.setState(new NormalState(this));  
        }  
        else if (acc.getBalance() == -2000) {  
            acc.setState(new RestrictedState(this));  
        }  
        else if (acc.getBalance() < -2000) {  
            System.out.println("操作受限！");  
        }  
    }  
}  

//受限状态：具体状态类  
class RestrictedState extends AccountState {  
    public RestrictedState(AccountState state) {  
        this.acc = state.acc;  
    }  

    public void deposit(double amount) {  
        acc.setBalance(acc.getBalance() + amount);  
        stateCheck();  
    }  

    public void withdraw(double amount) {  
        System.out.println("帐号受限，取款失败");  
    }  

    public void computeInterest() {  
        System.out.println("计算利息！");  
    }  

    //状态转换  
    public void stateCheck() {  
        if(acc.getBalance() > 0) {  
            acc.setState(new NormalState(this));  
        }  
        else if(acc.getBalance() > -2000) {  
            acc.setState(new OverdraftState(this));  
        }  
    }  
}
```

编写如下客户端测试代码：  
```java
class Client {  
    public static void main(String args[]) {  
        Account acc = new Account("段誉",0.0);  
        acc.deposit(1000);  
        acc.withdraw(2000);  
        acc.deposit(3000);  
        acc.withdraw(4000);  
        acc.withdraw(1000);  
        acc.computeInterest();  
    }  
}
```

编译并运行程序，输出结果如下：  
```
段誉开户，初始金额为0.0
---------------------------------------------
段誉存款1000.0
现在余额为1000.0
现在帐户状态为NormalState
---------------------------------------------
段誉取款2000.0
现在余额为-1000.0
现在帐户状态为OverdraftState
---------------------------------------------
段誉存款3000.0
现在余额为2000.0
现在帐户状态为NormalState
---------------------------------------------
段誉取款4000.0
现在余额为-2000.0
现在帐户状态为RestrictedState
---------------------------------------------
段誉取款1000.0
帐号受限，取款失败
现在余额为-2000.0
现在帐户状态为RestrictedState
---------------------------------------------
计算利息！
``` 

## 处理对象的多种状态及其相互转换——状态模式（四）

4.共享状态

在有些情况下，多个环境对象可能需要共享同一个状态，如果希望在系统中实现多个环境对象共享一个或多个状态对象，那么需要将这些状态对象定义为环境类的静态成员对象。

下面通过一个简单实例来说明如何实现共享状态：

如果某系统要求两个开关对象要么都处于开的状态，要么都处于关的状态，在使用时它们的状态必须保持一致，开关可以由开转换到关，也可以由关转换到开。

可以使用状态模式来实现开关的设计，其结构如图5所示：  
![图5 开关及其状态设计结构图](../img/type3-08-05.jpeg)  

开关类Switch代码如下所示：  
```java
class Switch {  
    private static State state,onState,offState; //定义三个静态的状态对象  
    private String name;  

    public Switch(String name) {  
        this.name = name;  
        onState = new OnState();  
        offState = new OffState();  
        this.state = onState;  
    }  

    public void setState(State state) {  
        this.state = state;  
    }  

    public static State getState(String type) {  
        if (type.equalsIgnoreCase("on")) {  
            return onState;  
        }  
        else {  
            return offState;  
        }  
    }  

    //打开开关  
    public void on() {  
        System.out.print(name);  
        state.on(this);  
    }
    //关闭开关  
    public void off() {  
        System.out.print(name);  
        state.off(this);  
    }  
}
```

抽象状态类如下代码所示：  
```java
abstract class State {  
    public abstract void on(Switch s);  
    public abstract void off(Switch s);  
}
```

两个具体状态类如下代码所示：  
```java
//打开状态  
class OnState extends State {  
    public void on(Switch s) {  
        System.out.println("已经打开！");  
    }  

    public void off(Switch s) {  
        System.out.println("关闭！");  
        s.setState(Switch.getState("off"));  
    }  
}  

//关闭状态  
class OffState extends State {  
    public void on(Switch s) {  
        System.out.println("打开！");  
        s.setState(Switch.getState("on"));  
    }  

    public void off(Switch s) {  
        System.out.println("已经关闭！");  
    }  
}
```  

编写如下客户端代码进行测试：  
```java
class Client {  
    public static void main(String args[]) {  
        Switch s1,s2;  
        s1=new Switch("开关1");  
        s2=new Switch("开关2");  

        s1.on();  
        s2.on();  
        s1.off();  
        s2.off();  
        s2.on();  
        s1.on();      
    }  
}
```

输出结果如下：  
```
开关1已经打开！
开关2已经打开！
开关1关闭！
开关2已经关闭！
开关2打开！
开关1已经打开！
```

从输出结果可以得知两个开关共享相同的状态，如果第一个开关关闭，则第二个开关也将关闭，再次关闭时将输出“已经关闭”；打开时也将得到类似结果。

## 处理对象的多种状态及其相互转换——状态模式（五）

5.使用环境类实现状态转换

在状态模式中实现状态转换时，具体状态类可通过调用环境类Context的setState()方法进行状态的转换操作，也可以统一由环境类Context来实现状态的转换。此时，增加新的具体状态类可能需要修改其他具体状态类或者环境类的源代码，否则系统无法转换到新增状态。但是对于客户端来说，无须关心状态类，可以为环境类设置默认的状态类，而将状态的转换工作交给具体状态类或环境类来完成，具体的转换细节对于客户端而言是透明的。

在上面的“银行账户状态转换”实例中，我们通过具体状态类来实现状态的转换，在每一个具体状态类中都包含一个stateCheck()方法，在该方法内部实现状态的转换，除此之外，我们还可以通过环境类来实现状态转换，环境类作为一个状态管理器，统一实现各种状态之间的转换操作。

下面通过一个包含循环状态的简单实例来说明如何使用环境类实现状态转换：

Sunny软件公司某开发人员欲开发一个屏幕放大镜工具，其具体功能描述如下：

用户单击“放大镜”按钮之后屏幕将放大一倍，再点击一次“放大镜”按钮屏幕再放大一倍，第三次点击该按钮后屏幕将还原到默认大小。

可以考虑使用状态模式来设计该屏幕放大镜工具，我们定义三个屏幕状态类NormalState、LargerState和LargestState来对应屏幕的三种状态，分别是正常状态、二倍放大状态和四倍放大状态，屏幕类Screen充当环境类，其结构如图6所示：  
![图6 屏幕放大镜工具结构图](../img/type3-08-06.jpeg)  

本实例核心代码如下所示：  
```java
//屏幕类  
class Screen {  
    //枚举所有的状态，currentState表示当前状态  
    private State currentState, normalState, largerState, largestState;  

    public Screen() {  
        this.normalState = new NormalState(); //创建正常状态对象  
        this.largerState = new LargerState(); //创建二倍放大状态对象  
        this.largestState = new LargestState(); //创建四倍放大状态对象  
        this.currentState = normalState; //设置初始状态  
        this.currentState.display();  
    }  

    public void setState(State state) {  
        this.currentState = state;  
    }  

    //单击事件处理方法，封转了对状态类中业务方法的调用和状态的转换  
    public void onClick() {  
        if (this.currentState == normalState) {  
            this.setState(largerState);  
            this.currentState.display();  
        }  
        else if (this.currentState == largerState) {  
            this.setState(largestState);  
            this.currentState.display();  
        }  
        else if (this.currentState == largestState) {  
            this.setState(normalState);  
            this.currentState.display();  
        }  
    }  
}  

//抽象状态类  
abstract class State {  
    public abstract void display();  
}  

//正常状态类  
class NormalState extends State{  
    public void display() {  
        System.out.println("正常大小！");  
    }  
}  

//二倍状态类  
class LargerState extends State{  
    public void display() {  
        System.out.println("二倍大小！");  
    }  
}  

//四倍状态类  
class LargestState extends State{  
    public void display() {  
        System.out.println("四倍大小！");  
    }  
}
```

在上述代码中，所有的状态转换操作都由环境类Screen来实现，此时，环境类充当了状态管理器角色。如果需要增加新的状态，例如“八倍状态类”，需要修改环境类，这在一定程度上违背了“开闭原则”，但对其他状态类没有任何影响。

编写如下客户端代码进行测试：  
```java
class Client {  
    public static void main(String args[]) {  
        Screen screen = new Screen();  
        screen.onClick();  
        screen.onClick();  
        screen.onClick();  
    }  
}
```

输出结果如下：  
```
正常大小！
二倍大小！
四倍大小！
正常大小！
```

## 处理对象的多种状态及其相互转换——状态模式（六）

6.状态模式总结

状态模式将一个对象在不同状态下的不同行为封装在一个个状态类中，通过设置不同的状态对象可以让环境对象拥有不同的行为，而状态转换的细节对于客户端而言是透明的，方便了客户端的使用。在实际开发中，状态模式具有较高的使用频率，在工作流和游戏开发中状态模式都得到了广泛的应用，例如公文状态的转换、游戏中角色的升级等。

1. 主要优点  

状态模式的主要优点如下：

(1) 封装了状态的转换规则，在状态模式中可以将状态的转换代码封装在环境类或者具体状态类中，可以对状态转换代码进行集中管理，而不是分散在一个个业务方法中。

(2) 将所有与某个状态有关的行为放到一个类中，只需要注入一个不同的状态对象即可使环境对象拥有不同的行为。

(3) 允许状态转换逻辑与状态对象合成一体，而不是提供一个巨大的条件语句块，状态模式可以让我们避免使用庞大的条件语句来将业务方法和状态转换代码交织在一起。

(4) 可以让多个环境对象共享一个状态对象，从而减少系统中对象的个数。

2. 主要缺点  

状态模式的主要缺点如下：

(1) 状态模式的使用必然会增加系统中类和对象的个数，导致系统运行开销增大。

(2) 状态模式的结构与实现都较为复杂，如果使用不当将导致程序结构和代码的混乱，增加系统设计的难度。

(3) 状态模式对“开闭原则”的支持并不太好，增加新的状态类需要修改那些负责状态转换的源代码，否则无法转换到新增状态；而且修改某个状态类的行为也需修改对应类的源代码。

3. 适用场景  

在以下情况下可以考虑使用状态模式：

(1) 对象的行为依赖于它的状态（如某些属性值），状态的改变将导致行为的变化。

(2) 在代码中包含大量与对象状态有关的条件语句，这些条件语句的出现，会导致代码的可维护性和灵活性变差，不能方便地增加和删除状态，并且导致客户类与类库之间的耦合增强。

**练习**  
> Sunny软件公司欲开发一款纸牌游戏软件，在该游戏软件中用户角色具有入门级(Primary)、熟练级(Secondary)、高手级(Professional)和骨灰级(Final)四种等级，角色的等级与其积分相对应，游戏胜利将增加积分，失败则扣除积分。入门级具有最基本的游戏功能play() ，熟练级增加了游戏胜利积分加倍功能doubleScore()，高手级在熟练级基础上再增加换牌功能changeCards()，骨灰级在高手级基础上再增加偷看他人的牌功能peekCards()。

试使用状态模式来设计该系统。

7.练习

(1) 分析如下代码：  
```java
class TestXYZ {  
    int behaviour;  
    //Getter and Setter  
    //......  
    public void handleAll() {  
        if (behaviour == 0) { //do something }  
        else if (behaviour == 1) { //do something }  
        else if (behaviour == 2) { //do something }  
        else if (behaviour == 3) { //do something }  
        //... some more else if ...  
    }  
}
```

为了提高代码的扩展性和健壮性，可以使用( )设计模式来进行重构。 A. Visitor（访问者） B. Facade（外观） C. Memento（备忘录） D. State（状态）

(2) 传输门是传输系统中的重要装置。传输门具有Open（打开）、Closed（关闭）、Opening（正在打开）、StayOpen（保持打开）、Closing（正在关闭）五种状态。触发状态的转换事件有click、complete和timeout三种。事件与其相应的状态转换如图7所示。  
![图7 传输门响应事件与其状态转换图](../img/type3-08-07.jpeg)

试使用状态模式对传输门进行状态模拟，要求绘制相应的类图并编程模拟实现。

> 练习会在[我的github](https://github.com/BruceOuyang/boy-design-pattern)上做掉

