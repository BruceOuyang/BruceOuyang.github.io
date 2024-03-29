> 【学习难度：★★☆☆☆，使用频率：★★★☆☆】  
>  直接出处：[模板方法模式](http://woquanke.com/books/gof/%E6%A8%A1%E6%9D%BF%E6%96%B9%E6%B3%95%E6%A8%A1%E5%BC%8F-Template%20Method%20Pattern.html)  
>  梳理和学习：https://github.com/BruceOuyang/boy-design-pattern  
>  简书日期： 2018/04/02  
>  简书首页：https://www.jianshu.com/p/0fb891a7c5ed  

## 模板方法模式深度解析（一）

1 模板方法模式概述

在现实生活中，很多事情都包含几个实现步骤，例如请客吃饭，无论吃什么，一般都包含点单、吃东西、买单等几个步骤，通常情况下这几个步骤的次序是：点单 --> 吃东西 --> 买单。在这三个步骤中，点单和买单大同小异，最大的区别在于第二步——吃什么？吃面条和吃满汉全席可大不相同，如图1所示：  
![图1 请客吃饭示意图](../img/type3-10-01.jpeg)  

在软件开发中，有时也会遇到类似的情况，某个方法的实现需要多个步骤（类似“请客”），其中有些步骤是固定的（类似“点单”和“买单”），而有些步骤并不固定，存在可变性（类似“吃东西”）。为了提高代码的复用性和系统的灵活性，可以使用一种称之为模板方法模式的设计模式来对这类情况进行设计，在模板方法模式中，将实现功能的每一个步骤所对应的方法称为基本方法（例如“点单”、“吃东西”和“买单”），而调用这些基本方法同时定义基本方法的执行次序的方法称为模板方法（例如“请客”）。在模板方法模式中，可以将相同的代码放在父类中，例如将模板方法“请客”以及基本方法“点单”和“买单”的实现放在父类中，而对于基本方法“吃东西”，在父类中只做一个声明，将其具体实现放在不同的子类中，在一个子类中提供“吃面条”的实现，而另一个子类提供“吃满汉全席”的实现。通过使用模板方法模式，一方面提高了代码的复用性，另一方面还可以利用面向对象的多态性，在运行时选择一种具体子类，实现完整的“请客”方法，提高系统的灵活性和可扩展性。  

模板方法模式定义如下：  
> 模板方法模式：定义一个操作中算法的框架，而将一些步骤延迟到子类中。模板方法模式使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。
>  
> Template Method Pattern: Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.

模板方法模式是一种基于继承的代码复用技术，它是一种类行为型模式。

模板方法模式是结构最简单的行为型设计模式，在其结构中只存在父类与子类之间的继承关系。通过使用模板方法模式，可以将一些复杂流程的实现步骤封装在一系列基本方法中，在抽象父类中提供一个称之为模板方法的方法来定义这些基本方法的执行次序，而通过其子类来覆盖某些步骤，从而使得相同的算法框架可以有不同的执行结果。模板方法模式提供了一个模板方法来定义算法框架，而某些具体步骤的实现可以在其子类中完成。

2 模板方法模式结构与实现

2.1 模式结构

模板方法模式结构比较简单，其核心是抽象类和其中的模板方法的设计，其结构如图2所示：  
![图2 模板方法模式结构图](../img/type3-10-02.jpeg)  

由图2可知，模板方法模式包含如下两个角色：

(1) AbstractClass（抽象类）：在抽象类中定义了一系列基本操作(PrimitiveOperations)，这些基本操作可以是具体的，也可以是抽象的，每一个基本操作对应算法的一个步骤，在其子类中可以重定义或实现这些步骤。同时，在抽象类中实现了一个模板方法(Template Method)，用于定义一个算法的框架，模板方法不仅可以调用在抽象类中实现的基本方法，也可以调用在抽象类的子类中实现的基本方法，还可以调用其他对象中的方法。

(2) ConcreteClass（具体子类）：它是抽象类的子类，用于实现在父类中声明的抽象基本操作以完成子类特定算法的步骤，也可以覆盖在父类中已经实现的具体基本操作。

2.2 模式实现

在实现模板方法模式时，开发抽象类的软件设计师和开发具体子类的软件设计师之间可以进行协作。一个设计师负责给出一个算法的轮廓和框架，另一些设计师则负责给出这个算法的各个逻辑步骤。实现这些具体逻辑步骤的方法即为基本方法，而将这些基本方法汇总起来的方法即为模板方法，模板方法模式的名字也因此而来。下面将详细介绍模板方法和基本方法：

2.2.1 模板方法  

一个模板方法是定义在抽象类中的、把基本操作方法组合在一起形成一个总算法或一个总行为的方法。这个模板方法定义在抽象类中，并由子类不加以修改地完全继承下来。模板方法是一个具体方法，它给出了一个顶层逻辑框架，而逻辑的组成步骤在抽象类中可以是具体方法，也可以是抽象方法。由于模板方法是具体方法，因此模板方法模式中的抽象层只能是抽象类，而不是接口。

2.2.2 基本方法  

基本方法是实现算法各个步骤的方法，是模板方法的组成部分。基本方法又可以分为三种：抽象方法(Abstract Method)、具体方法(Concrete Method)和钩子方法(Hook Method)。

(1) 抽象方法：一个抽象方法由抽象类声明、由其具体子类实现。在C#语言里一个抽象方法以abstract关键字标识。

(2) 具体方法：一个具体方法由一个抽象类或具体类声明并实现，其子类可以进行覆盖也可以直接继承。

(3) 钩子方法：一个钩子方法由一个抽象类或具体类声明并实现，而其子类可能会加以扩展。通常在父类中给出的实现是一个空实现（可使用virtual关键字将其定义为虚函数），并以该空实现作为方法的默认实现，当然钩子方法也可以提供一个非空的默认实现。

在模板方法模式中，钩子方法有两类：第一类钩子方法可以与一些具体步骤“挂钩”，以实现在不同条件下执行模板方法中的不同步骤，这类钩子方法的返回类型通常是bool类型的，这类方法名一般为IsXXX()，用于对某个条件进行判断，如果条件满足则执行某一步骤，否则将不执行，如下代码片段所示：  
```
……  
//模板方法  
public void TemplateMethod()   
{  
Open();  
Display();  
//通过钩子方法来确定某步骤是否执行  
if (IsPrint())   
{  
    Print();  
}  
}  

//钩子方法  
public bool IsPrint()  
{  
    return true;  
}  
……
```

在代码中IsPrint()方法即是钩子方法，它可以决定Print()方法是否执行，一般情况下，钩子方法的返回值为true，如果不希望某方法执行，可以在其子类中覆盖钩子方法，将其返回值改为false即可，这种类型的钩子方法可以控制方法的执行，对一个算法进行约束。

还有一类钩子方法就是实现体为空的具体方法，子类可以根据需要覆盖或者继承这些钩子方法，与抽象方法相比，这类钩子方法的好处在于子类如果没有覆盖父类中定义的钩子方法，编译可以正常通过，但是如果没有覆盖父类中声明的抽象方法，编译将报错。

在模板方法模式中，抽象类的典型代码如下：  
```java
abstract class AbstractClass   
{  
    //模板方法  
    public void TemplateMethod()   
    {  
            PrimitiveOperation1();  
            PrimitiveOperation2();  
            PrimitiveOperation3();  
    }  
    
    //基本方法—具体方法  
    public void PrimitiveOperation1()   
    {  
        //实现代码  
    }  
    
    //基本方法—抽象方法  
    public abstract void PrimitiveOperation2();      
    
    //基本方法—钩子方法  
    public abstract void PrimitiveOperation3()     
    {  
        
    }  
}
```

在抽象类中，模板方法TemplateMethod()定义了算法的框架，在模板方法中调用基本方法以实现完整的算法，每一个基本方法如PrimitiveOperation1()、PrimitiveOperation2()等均实现了算法的一部分，对于所有子类都相同的基本方法可在父类提供具体实现，例如PrimitiveOperation1()，否则在父类声明为抽象方法或钩子方法，由不同的子类提供不同的实现，例如PrimitiveOperation2()和PrimitiveOperation3()。

可在抽象类的子类中提供抽象步骤的实现，也可覆盖父类中已经实现的具体方法，具体子类的典型代码如下：  
```java
class ConcreteClass extends AbstractClass   
{  
    public void PrimitiveOperation2()   
    {  
        //实现代码  
    }  
    
    public void PrimitiveOperation3()   
    {  
        //实现代码  
    }  
}
```

在模板方法模式中，由于面向对象的多态性，子类对象在运行时将覆盖父类对象，子类中定义的方法也将覆盖父类中定义的方法，因此程序在运行时，具体子类的基本方法将覆盖父类中定义的基本方法，子类的钩子方法也将覆盖父类的钩子方法，从而可以通过在子类中实现的钩子方法对父类方法的执行进行约束，实现子类对父类行为的反向控制。

## 模板方法模式深度解析（二）

3 模板方法模式应用实例

下面通过一个应用实例来进一步学习和理解模板方法模式。

3.1 实例说明  

某软件公司欲为某银行的业务支撑系统开发一个利息计算模块，利息计算流程如下：

(1) 系统根据账号和密码验证用户信息，如果用户信息错误，系统显示出错提示；

(2) 如果用户信息正确，则根据用户类型的不同使用不同的利息计算公式计算利息（如活期账户和定期账户具有不同的利息计算公式）；

(3) 系统显示利息。

试使用模板方法模式设计该利息计算模块。

3.2 实例类图  

通过分析，本实例结构图如图3所示。  
![图3 银行利息计算模块结构图](../img/type3-10-03.jpeg)  

在图3中，Account充当抽象类角色，CurrentAccount和SavingAccount充当具体子类角色。

3.3 实例代码

(1) Account：账户类，充当抽象类。  
```java
abstract class Account  
{  
    //基本方法——具体方法  
    public bool Validate(string account, string password)   
    {  
        Console.WriteLine("账号：{0}", account);  
        Console.WriteLine("密码：{0}", password);  
        //模拟登录  
        if (account.Equals("张无忌") && password.Equals("123456"))   
        {  
            return true;  
        }  
        else   
        {  
            return false;  
        }  
    }  

    //基本方法——抽象方法  
    public abstract void CalculateInterest();  

    //基本方法——具体方法  
    public void Display()   
    {  
        Console.WriteLine("显示利息！");  
    }  

    //模板方法  
    public void Handle(string account, string password)   
    {  
        if (!Validate(account,password))   
        {  
            Console.WriteLine("账户或密码错误！");  
            return;  
        }  
        CalculateInterest();  
        Display();  
    }  
} 
```  

(2) CurrentAccount：活期账户类，充当具体子类。  
```java
class CurrentAccount extends Account  
{  
    //覆盖父类的抽象基本方法  
    public void CalculateInterest()   
    {  
        Console.WriteLine("按活期利率计算利息！");  
    }  
}  
```  

(3) SavingAccount：定期账户类，充当具体子类。  
```java
class SavingAccount extends Account  
{  
    //覆盖父类的抽象基本方法  
    public void CalculateInterest()   
    {  
        Console.WriteLine("按定期利率计算利息！");  
    }  
}  
```  

(4) 配置文件App.config，在配置文件中存储了具体子类的类名。  
```xml
<?xml version="1.0" encoding="utf-8" ?>  
<configuration>  
  <appSettings>  
    <add key="subClass" value="TemplateMethodSample.CurrentAccount"/>  
  </appSettings>  
</configuration>
```  

(5) Program：客户端测试类  
```java
class Program  
{  
    static void Main(string[] args)  
    {  
        Account account;  
        //读取配置文件  
        string subClassStr = ConfigurationManager.AppSettings["subClass"];  
        //反射生成对象  
        account = (Account)Assembly.Load("TemplateMethodSample").CreateInstance(subClassStr);  
        account.Handle("张无忌", "123456");  
        Console.Read();  
    }  
}  
```

3.4 结果及分析  

编译并运行程序，输出结果如下：  
```
账号：张无忌
密码：123456
按活期利率计算利息！
显示利息！
```

如果需要更换具体子类，无须修改源代码，只需修改配置文件App.config，例如将活期账户(CurrentAccount)改为定期账户(Saving Account)，只需将存储在配置文件中的具体子类CurrentAccount改为SavingAccount，如下代码所示：  
```xml
<?xml version="1.0" encoding="utf-8" ?>  
<configuration>  
  <appSettings>  
    <add key="subClass" value="TemplateMethodSample.SavingAccount"/>  
  </appSettings>  
</configuration>
```

重新运行客户端程序，输出结果如下：  
```
账号：张无忌
密码：123456
按定期利率计算利息！
显示利息！
```

> 如果需要增加新的具体子类（新的账户类型），原有代码均无须修改，完全符合开闭原则。

## 模板方法模式深度解析（三）

4 钩子方法的使用

模板方法模式中，在父类中提供了一个定义算法框架的模板方法，还提供了一系列抽象方法、具体方法和钩子方法，其中钩子方法的引入使得子类可以控制父类的行为。最简单的钩子方法就是空方法，代码如下：  
```
public virtual void Display() {   }
```

当然也可以在钩子方法中定义一个默认的实现，如果子类不覆盖钩子方法，则执行父类的默认实现代码。

另一种钩子方法可以实现对其他方法进行约束，这种钩子方法通常返回一个bool类型，即返回true或false，用来判断是否执行某一个基本方法，下面通过一个实例来说明这种钩子方法的使用。

某软件公司欲为销售管理系统提供一个数据图表显示功能，该功能的实现包括如下几个步骤：

(1) 从数据源获取数据；

(2) 将数据转换为XML格式；

(3) 以某种图表方式显示XML格式的数据。

该功能支持多种数据源和多种图表显示方式，但所有的图表显示操作都基于XML格式的数据，因此可能需要对数据进行转换，如果从数据源获取的数据已经是XML数据则无须转换。

由于该数据图表显示功能的三个步骤次序是固定的，且存在公共代码（例如数据格式转换代码），满足模板方法模式的适用条件，可以使用模板方法模式对其进行设计。因为数据格式的不同，XML数据可以直接显示，而其他格式的数据需要进行转换，因此第(2)步“将数据转换为XML格式”的执行存在不确定性，为了解决这个问题，可以定义一个钩子方法IsNotXMLData()来对数据转换方法进行控制。通过分析，该图表显示功能的基本结构如图4所示：  
![图4 数据图表显示功能结构图](../img/type3-10-04.jpeg)  

可以将公共方法和框架代码放在抽象父类中，代码如下：  
```java
abstract class DataViewer  
{  
    //抽象方法：获取数据  
    public abstract void GetData();  

    //具体方法：转换数据  
    public void ConvertData()   
    {  
        Console.WriteLine("将数据转换为XML格式。");  
    }  

    //抽象方法：显示数据  
    public abstract void DisplayData();  

    //钩子方法：判断是否为XML格式的数据  
    public virtual bool IsNotXMLData()  
    {  
        return true;  
    }  

    //模板方法  
    public void Process()  
    {  
        GetData();  
        //如果不是XML格式的数据则进行数据转换  
        if (IsNotXMLData())  
        {  
            ConvertData();  
        }  
        DisplayData();  
    }  
}  
```

在上面的代码中，引入了一个钩子方法IsNotXMLData()，其返回类型为bool类型，在模板方法中通过它来对数据转换方法ConvertData()进行约束，该钩子方法的默认返回值为true，在子类中可以根据实际情况覆盖该方法，其中用于显示XML格式数据的具体子类XMLDataViewer代码如下： 
```java
class XMLDataViewer extends DataViewer  
{  
    //实现父类方法：获取数据  
    public override void GetData()   
    {  
        Console.WriteLine("从XML文件中获取数据。");  
    }  

    //实现父类方法：显示数据，默认以柱状图方式显示，可结合桥接模式来改进  
    public override void DisplayData()   
    {  
        Console.WriteLine("以柱状图显示数据。");  
    }  

    //覆盖父类的钩子方法  
    public override bool IsNotXMLData()  
    {  
        return false;  
    }  
} 
```

在具体子类XMLDataViewer中覆盖了钩子方法IsNotXMLData()，返回false，表示该数据已为XML格式，无须执行数据转换方法ConvertData()，客户端代码如下：  
```java
class Program  
{  
    static void Main(string[] args)  
    {  
        DataViewer dv;  
        dv = new XMLDataViewer();  
        dv.Process();  
        Console.Read();  
    }  
}  
```

该程序运行结果如下：  
```
从XML文件中获取数据。
以柱状图显示数据。
```

5 模板方法模式效果与适用场景

模板方法模式是基于继承的代码复用技术，它体现了面向对象的诸多重要思想，是一种使用较为频繁的模式。模板方法模式广泛应用于框架设计中，以确保通过父类来控制处理流程的逻辑顺序（如框架的初始化，测试流程的设置等）。

5.1 模式优点

模板方法模式的主要优点如下：

(1) 在父类中形式化地定义一个算法，而由它的子类来实现细节的处理，在子类实现详细的处理算法时并不会改变算法中步骤的执行次序。

(2) 模板方法模式是一种代码复用技术，它在类库设计中尤为重要，它提取了类库中的公共行为，将公共行为放在父类中，而通过其子类来实现不同的行为，它鼓励我们恰当使用继承来实现代码复用。

(3) 可实现一种反向控制结构，通过子类覆盖父类的钩子方法来决定某一特定步骤是否需要执行。

(4) 在模板方法模式中可以通过子类来覆盖父类的基本方法，不同的子类可以提供基本方法的不同实现，更换和增加新的子类很方便，符合单一职责原则和开闭原则。

5.2 模式缺点

模板方法模式的主要缺点如下：

需要为每一个基本方法的不同实现提供一个子类，如果父类中可变的基本方法太多，将会导致类的个数增加，系统更加庞大，设计也更加抽象，此时，可结合桥接模式来进行设计。

5.3 模式适用场景

在以下情况下可以考虑使用模板方法模式：

(1) 对一些复杂的算法进行分割，将其算法中固定不变的部分设计为模板方法和父类具体方法，而一些可以改变的细节由其子类来实现。即：一次性实现一个算法的不变部分，并将可变的行为留给子类来实现。

(2) 各子类中公共的行为应被提取出来并集中到一个公共父类中以避免代码重复。

(3) 需要通过子类来决定父类算法中某个步骤是否执行，实现子类对父类的反向控制。

