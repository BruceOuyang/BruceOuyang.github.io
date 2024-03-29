> 【学习难度：★★☆☆☆，使用频率：★★★☆☆】  
>  直接出处：[访问者模式](http://woquanke.com/books/gof/%E8%AE%BF%E9%97%AE%E8%80%85%E6%A8%A1%E5%BC%8F-Visitor%20Pattern.html)  
>  梳理和学习：https://github.com/BruceOuyang/boy-design-pattern  
>  简书日期： 2018/04/03  
>  简书首页：https://www.jianshu.com/p/0fb891a7c5ed  

## 操作复杂对象结构——访问者模式（一）

想必大家都去过医院，虽然没有人喜欢去医院（爱岗敬业的医务工作人员除外，微笑）。在医生开具处方单（药单）后，很多医院都存在如下处理流程：划价人员拿到处方单之后根据药品名称和数量计算总价，药房工作人员根据药品名称和数量准备药品，如图26-1所示：  
![图26-1 医院处方单处理示意图](../img/type3-11-01.gif)  

在图26-1中，我们可以将处方单看成一个药品信息的集合，里面包含了一种或多种不同类型的药品信息，不同类型的工作人员（如划价人员和药房工作人员）在操作同一个药品信息集合时将提供不同的处理方式，而且可能还会增加新类型的工作人员来操作处方单。

在软件开发中，有时候我们也需要处理像处方单这样的集合对象结构，在该对象结构中存储了多个不同类型的对象信息，而且对同一对象结构中的元素的操作方式并不唯一，可能需要提供多种不同的处理方式，还有可能增加新的处理方式。在设计模式中，有一种模式可以满足上述要求，其模式动机就是以不同的方式操作复杂对象结构，该模式就是我们本章将要介绍的访问者模式。

26.1 OA系统中员工数据汇总

Sunny软件公司欲为某银行开发一套OA系统，在该OA系统中包含一个员工信息管理子系统，该银行员工包括正式员工和临时工，每周人力资源部和财务部等部门需要对员工数据进行汇总，汇总数据包括员工工作时间、员工工资等。该公司基本制度如下：  

(1) 正式员工(Full time Employee)每周工作时间为40小时，不同级别、不同部门的员工每周基本工资不同；如果超过40小时，超出部分按照100元/小时作为加班费；如果少于40小时，所缺时间按照请假处理，请假所扣工资以80元/小时计算，直到基本工资扣除到零为止。除了记录实际工作时间外，人力资源部需记录加班时长或请假时长，作为员工平时表现的一项依据。

(2) 临时工(Part time Employee)每周工作时间不固定，基本工资按小时计算，不同岗位的临时工小时工资不同。人力资源部只需记录实际工作时间。

人力资源部和财务部工作人员可以根据各自的需要对员工数据进行汇总处理，人力资源部负责汇总每周员工工作时间，而财务部负责计算每周员工工资。

Sunny软件公司开发人员针对上述需求，提出了一个初始解决方案，其核心代码如下所示：  
```java
import java.util.*;  

class EmployeeList  
{  
    private ArrayList<Employee> list = new ArrayList<Employee>(); //员工集合  

    //增加员工  
    public void addEmployee(Employee employee)   
    {  
        list.add(employee);  
    }  

    //处理员工数据  
    public void handle(String departmentName)  
    {  
        if(departmentName.equalsIgnoreCase("财务部")) //财务部处理员工数据  
        {  
            for(Object obj : list)  
            {  
                if(obj.getClass().getName().equalsIgnoreCase("FulltimeEmployee"))  
                {  
                    System.out.println("财务部处理全职员工数据！");           
                }  
                else   
                {  
                    System.out.println("财务部处理兼职员工数据！");  
                }  
            }  
        }  
        else if(departmentName.equalsIgnoreCase("人力资源部")) //人力资源部处理员工数据  
        {  
            for(Object obj : list)  
            {  
                if(obj.getClass().getName().equalsIgnoreCase("FulltimeEmployee"))  
                {  
                    System.out.println("人力资源部处理全职员工数据！");                     
                }  
                else   
                {  
                    System.out.println("人力资源部处理兼职员工数据！");  
                }  
            }             
        }  
    }  
}
```

在EmployeeList类的handle()方法中，通过对部门名称和员工类型进行判断，不同部门对不同类型的员工进行了不同的处理，满足了员工数据汇总的要求。但是该解决方案存在如下几个问题：

(1) EmployeeList类非常庞大，它将各个部门处理各类员工数据的代码集中在一个类中，在具体实现时，代码将相当冗长，EmployeeList类承担了过多的职责，既不方便代码的复用，也不利于系统的扩展，违背了“单一职责原则”。

(2)在代码中包含大量的“if…else…”条件判断语句，既需要对不同部门进行判断，又需要对不同类型的员工进行判断，还将出现嵌套的条件判断语句，导致测试和维护难度增大。

(3)如果要增加一个新的部门来操作员工集合，不得不修改EmployeeList类的源代码，在handle()方法中增加一个新的条件判断语句和一些业务处理代码来实现新部门的访问操作。这违背了“开闭原则”，系统的灵活性和可扩展性有待提高。

(4)如果要增加一种新类型的员工，同样需要修改EmployeeList类的源代码，在不同部门的处理代码中增加对新类型员工的处理逻辑，这也违背了“开闭原则”。 如何解决上述问题？如何为同一集合对象中的元素提供多种不同的操作方式？访问者模式就是一个值得考虑的解决方案，它可以在一定程度上解决上述问题（解决大部分问题）。访问者模式可以为为不同类型的元素提供多种访问操作方式，而且可以在不修改原有系统的情况下增加新的操作方式。

## 操作复杂对象结构——访问者模式（二）

26.2 访问者模式概述

访问者模式是一种较为复杂的行为型设计模式，它包含访问者和被访问元素两个主要组成部分，这些被访问的元素通常具有不同的类型，且不同的访问者可以对它们进行不同的访问操作。例如处方单中的各种药品信息就是被访问的元素，而划价人员和药房工作人员就是访问者。访问者模式使得用户可以在不修改现有系统的情况下扩展系统的功能，为这些不同类型的元素增加新的操作。

在使用访问者模式时，被访问元素通常不是单独存在的，它们存储在一个集合中，这个集合被称为“对象结构”，访问者通过遍历对象结构实现对其中存储的元素的逐个操作。

访问者模式定义如下：

访问者模式(Visitor Pattern):提供一个作用于某对象结构中的各元素的操作表示，它使我们可以在不改变各元素的类的前提下定义作用于这些元素的新操作。访问者模式是一种对象行为型模式。

访问者模式的结构较为复杂，其结构如图26-2所示：  
![图26-2 访问者模式结构图](../img/type3-11-02.gif)  

在访问者模式结构图中包含如下几个角色：

* Vistor（抽象访问者）：抽象访问者为对象结构中每一个具体元素类ConcreteElement声明一个访问操作，从这个操作的名称或参数类型可以清楚知道需要访问的具体元素的类型，具体访问者需要实现这些操作方法，定义对这些元素的访问操作。

* ConcreteVisitor（具体访问者）：具体访问者实现了每个由抽象访问者声明的操作，每一个操作用于访问对象结构中一种类型的元素。

* Element（抽象元素）：抽象元素一般是抽象类或者接口，它定义一个accept()方法，该方法通常以一个抽象访问者作为参数。【稍后将介绍为什么要这样设计。】

* ConcreteElement（具体元素）：具体元素实现了accept()方法，在accept()方法中调用访问者的访问方法以便完成对一个元素的操作。

* ObjectStructure（对象结构）：对象结构是一个元素的集合，它用于存放元素对象，并且提供了遍历其内部元素的方法。它可以结合组合模式来实现，也可以是一个简单的集合对象，如一个List对象或一个Set对象。

访问者模式中对象结构存储了不同类型的元素对象，以供不同访问者访问。访问者模式包括两个层次结构，一个是访问者层次结构，提供了抽象访问者和具体访问者，一个是元素层次结构，提供了抽象元素和具体元素。相同的访问者可以以不同的方式访问不同的元素，相同的元素可以接受不同访问者以不同访问方式访问。在访问者模式中，增加新的访问者无须修改原有系统，系统具有较好的可扩展性。

在访问者模式中，抽象访问者定义了访问元素对象的方法，通常为每一种类型的元素对象都提供一个访问方法，而具体访问者可以实现这些访问方法。这些访问方法的命名一般有两种方式：一种是直接在方法名中标明待访问元素对象的具体类型，如visitElementA(ElementA elementA)，还有一种是统一取名为visit()，通过参数类型的不同来定义一系列重载的visit()方法。当然，如果所有的访问者对某一类型的元素的访问操作都相同，则可以将操作代码移到抽象访问者类中，其典型代码如下所示：  
```java
abstract class Visitor  
{  
    public abstract void visit(ConcreteElementA elementA);  
    public abstract void visit(ConcreteElementB elementB);  
    public void visit(ConcreteElementC elementC)  
    {  
        //元素ConcreteElementC操作代码  
    }  
}
```

在这里使用了重载visit()方法的方式来定义多个方法用于操作不同类型的元素对象。在抽象访问者Visitor类的子类ConcreteVisitor中实现了抽象的访问方法，用于定义对不同类型元素对象的操作，具体访问者类典型代码如下所示：  
```java
class ConcreteVisitor extends Visitor  
{  
    public void visit(ConcreteElementA elementA)  
    {  
        //元素ConcreteElementA操作代码  
    }  
    public void visit(ConcreteElementB elementB)  
    {  
        //元素ConcreteElementB操作代码  
    }  
}
```

对于元素类而言，在其中一般都定义了一个accept()方法，用于接受访问者的访问，典型的抽象元素类代码如下所示：  
```java
interface Element  
{  
    public void accept(Visitor visitor);  
}
```

需要注意的是该方法传入了一个抽象访问者Visitor类型的参数，即针对抽象访问者进行编程，而不是具体访问者，在程序运行时再确定具体访问者的类型，并调用具体访问者对象的visit()方法实现对元素对象的操作。在抽象元素类Element的子类中实现了accept()方法，用于接受访问者的访问，在具体元素类中还可以定义不同类型的元素所特有的业务方法，其典型代码如下所示：  
```java
class ConcreteElementA implements Element  
{  
    public void accept(Visitor visitor)  
    {  
        visitor.visit(this);  
    }  

    public void operationA()  
    {  
        //业务方法  
    }  
}
```

在具体元素类ConcreteElementA的accept()方法中，通过调用Visitor类的visit()方法实现对元素的访问，并以当前对象作为visit()方法的参数。其具体执行过程如下：

(1) 调用具体元素类的accept(Visitor visitor)方法，并将Visitor子类对象作为其参数；

(2) 在具体元素类accept(Visitor visitor)方法内部调用传入的Visitor对象的visit()方法，如visit(ConcreteElementA elementA)，将当前具体元素类对象(this)作为参数，如visitor.visit(this)；

(3) 执行Visitor对象的visit()方法，在其中还可以调用具体元素对象的业务方法。

这种调用机制也称为“双重分派”，正因为使用了双重分派机制，使得增加新的访问者无须修改现有类库代码，只需将新的访问者对象作为参数传入具体元素对象的accept()方法，程序运行时将回调在新增Visitor类中定义的visit()方法，从而增加新的元素访问方式。

**思考**
> 双重分派机制如何用代码实现？

在访问者模式中，对象结构是一个集合，它用于存储元素对象并接受访问者的访问，其典型代码如下所示：  
```java
class ObjectStructure  
{  
    private ArrayList<Element> list = new ArrayList<Element>(); //定义一个集合用于存储元素对象  

    public void accept(Visitor visitor)  
    {  
        Iterator i=list.iterator();  

        while(i.hasNext())  
        {  
            ((Element)i.next()).accept(visitor); //遍历访问集合中的每一个元素  
        }  
    }  

    public void addElement(Element element)  
    {  
        list.add(element);  
    }  

    public void removeElement(Element element)  
    {  
        list.remove(element);  
    }  
}
```

在对象结构中可以使用迭代器对存储在集合中的元素对象进行遍历，并逐个调用每一个对象的accept()方法，实现对元素对象的访问操作。

**思考**
> 访问者模式是否符合“开闭原则”？【从增加新的访问者和增加新的元素两方面考虑。】

## 操作复杂对象结构——访问者模式（三）

26.3 完整解决方案

Sunny软件公司开发人员使用访问者模式对OA系统中员工数据汇总模块进行重构，使得系统可以很方便地增加新类型的访问者，更加符合“单一职责原则”和“开闭原则”，重构后的基本结构如图26-3所示：  
![图26-3 员工数据汇总模块结构图](../img/type3-11-03.gif)  

在图26-3中，FADepartment表示财务部，HRDepartment表示人力资源部，它们充当具体访问者角色，其抽象父类Department充当抽象访问者角色；EmployeeList充当对象结构，用于存储员工列表；FulltimeEmployee表示正式员工，ParttimeEmployee表示临时工，它们充当具体元素角色，其父接口Employee充当抽象元素角色。完整代码如下所示：  
```java
import java.util.*;  

//员工类：抽象元素类  
interface Employee  
{  
    public void accept(Department handler); //接受一个抽象访问者访问  
}  

//全职员工类：具体元素类  
class FulltimeEmployee implements Employee  
{  
    private String name;  
    private double weeklyWage;  
    private int workTime;  

    public FulltimeEmployee(String name,double weeklyWage,int workTime)  
    {  
        this.name = name;  
        this.weeklyWage = weeklyWage;  
        this.workTime = workTime;  
    }     

    public void setName(String name)   
    {  
        this.name = name;   
    }  

    public void setWeeklyWage(double weeklyWage)   
    {  
        this.weeklyWage = weeklyWage;   
    }  

    public void setWorkTime(int workTime)   
    {  
        this.workTime = workTime;   
    }  

    public String getName()   
    {  
        return (this.name);   
    }  

    public double getWeeklyWage()   
    {  
        return (this.weeklyWage);   
    }  

    public int getWorkTime()   
    {  
        return (this.workTime);   
    }  

    public void accept(Department handler)  
    {  
        handler.visit(this); //调用访问者的访问方法  
    }  
}  

//兼职员工类：具体元素类  
class ParttimeEmployee implements Employee  
{  
    private String name;  
    private double hourWage;  
    private int workTime;  

    public ParttimeEmployee(String name,double hourWage,int workTime)  
    {  
        this.name = name;  
        this.hourWage = hourWage;  
        this.workTime = workTime;  
    }     

    public void setName(String name)   
    {  
        this.name = name;   
    }  

    public void setHourWage(double hourWage)   
    {  
        this.hourWage = hourWage;   
    }  

    public void setWorkTime(int workTime)   
    {  
        this.workTime = workTime;   
    }  

    public String getName()   
    {  
        return (this.name);   
    }  

    public double getHourWage()   
    {  
        return (this.hourWage);   
    }  

    public int getWorkTime()   
    {  
        return (this.workTime);   
    }  

    public void accept(Department handler)  
    {  
        handler.visit(this); //调用访问者的访问方法  
    }  
}  

//部门类：抽象访问者类  
abstract class Department  
{  
    //声明一组重载的访问方法，用于访问不同类型的具体元素  
    public abstract void visit(FulltimeEmployee employee);  
    public abstract void visit(ParttimeEmployee employee);    
}  

//财务部类：具体访问者类  
class FADepartment extends Department  
{  
    //实现财务部对全职员工的访问  
    public void visit(FulltimeEmployee employee)  
    {  
        int workTime = employee.getWorkTime();  
        double weekWage = employee.getWeeklyWage();  
        if(workTime > 40)  
        {  
            weekWage = weekWage + (workTime - 40) * 100;  
        }  
        else if(workTime < 40)  
        {  
            weekWage = weekWage - (40 - workTime) * 80;  
            if(weekWage < 0)  
            {  
                weekWage = 0;  
            }  
        }  
        System.out.println("正式员工" + employee.getName() + "实际工资为：" + weekWage + "元。");             
    }  

    //实现财务部对兼职员工的访问  
    public void visit(ParttimeEmployee employee)  
    {  
        int workTime = employee.getWorkTime();  
        double hourWage = employee.getHourWage();  
        System.out.println("临时工" + employee.getName() + "实际工资为：" + workTime * hourWage + "元。");       
    }         
}  

//人力资源部类：具体访问者类  
class HRDepartment extends Department  
{  
    //实现人力资源部对全职员工的访问  
    public void visit(FulltimeEmployee employee)  
    {  
        int workTime = employee.getWorkTime();  
        System.out.println("正式员工" + employee.getName() + "实际工作时间为：" + workTime + "小时。");  
        if(workTime > 40)  
        {  
            System.out.println("正式员工" + employee.getName() + "加班时间为：" + (workTime - 40) + "小时。");  
        }  
        else if(workTime < 40)  
        {  
            System.out.println("正式员工" + employee.getName() + "请假时间为：" + (40 - workTime) + "小时。");  
        }                         
    }  

    //实现人力资源部对兼职员工的访问  
    public void visit(ParttimeEmployee employee)  
    {  
        int workTime = employee.getWorkTime();  
        System.out.println("临时工" + employee.getName() + "实际工作时间为：" + workTime + "小时。");  
    }         
}  

//员工列表类：对象结构  
class EmployeeList  
{  
    //定义一个集合用于存储员工对象  
    private ArrayList<Employee> list = new ArrayList<Employee>();  

    public void addEmployee(Employee employee)  
    {  
        list.add(employee);  
    }  

    //遍历访问员工集合中的每一个员工对象  
    public void accept(Department handler)  
    {  
        for(Object obj : list)  
        {  
            ((Employee)obj).accept(handler);  
        }  
    }  
}
```

为了提高系统的灵活性和可扩展性，我们将具体访问者类的类名存储在配置文件中，并通过工具类XMLUtil来读取配置文件并反射生成对象，XMLUtil类的代码如下所示：  
```java
import javax.xml.parsers.*;  
import org.w3c.dom.*;  
import org.xml.sax.SAXException;  
import java.io.*;  
class XMLUtil  
{  
    //该方法用于从XML配置文件中提取具体类类名，并返回一个实例对象  
    public static Object getBean()  
    {  
        try  
        {  
            //创建文档对象  
            DocumentBuilderFactory dFactory = DocumentBuilderFactory.newInstance();  
            DocumentBuilder builder = dFactory.newDocumentBuilder();  
            Document doc;                             
            doc = builder.parse(new File("config.xml"));   

            //获取包含类名的文本节点  
            NodeList nl = doc.getElementsByTagName("className");  
            Node classNode=nl.item(0).getFirstChild();  
            String cName=classNode.getNodeValue();  

            //通过类名生成实例对象并将其返回  
            Class c=Class.forName(cName);  
            Object obj=c.newInstance();  
            return obj;  
        }     
        catch(Exception e)  
        {  
            e.printStackTrace();  
            return null;  
        }  
    }  
}
```  

配置文件config.xml中存储了具体访问者类的类名，代码如下所示：  
```xml
<?xml version="1.0"?>  
<config>  
    <className>FADepartment</className>  
</config>
```

编写如下客户端测试代码：  
```java
class Client  
{  
    public static void main(String args[])  
    {  
        EmployeeList list = new EmployeeList();  
        Employee fte1,fte2,fte3,pte1,pte2;  

        fte1 = new FulltimeEmployee("张无忌",3200.00,45);  
        fte2 = new FulltimeEmployee("杨过",2000.00,40);  
        fte3 = new FulltimeEmployee("段誉",2400.00,38);  
        pte1 = new ParttimeEmployee("洪七公",80.00,20);  
        pte2 = new ParttimeEmployee("郭靖",60.00,18);  

        list.addEmployee(fte1);  
        list.addEmployee(fte2);  
        list.addEmployee(fte3);  
        list.addEmployee(pte1);  
        list.addEmployee(pte2);  

        Department dep;  
        dep = (Department)XMLUtil.getBean();  
        list.accept(dep);  
    }  
}
```  

编译并运行程序，输出结果如下：  
```
正式员工张无忌实际工资为：3700.0元。
正式员工杨过实际工资为：2000.0元。
正式员工段誉实际工资为：2240.0元。
临时工洪七公实际工资为：1600.0元。
临时工郭靖实际工资为：1080.0元。
```  

如果需要更换具体访问者类，无须修改源代码，只需修改配置文件，例如将访问者类由财务部改为人力资源部，只需将存储在配置文件中的具体访问者类FADepartment改为HRDepartment，如下代码所示：  
```xml
<?xml version="1.0"?>  
<config>  
    <className>HRDepartment</className>  
</config>
```

重新运行客户端程序，输出结果如下：  
```
正式员工张无忌实际工作时间为：45小时。
正式员工张无忌加班时间为：5小时。
正式员工杨过实际工作时间为：40小时。
正式员工段誉实际工作时间为：38小时。
正式员工段誉请假时间为：2小时。
临时工洪七公实际工作时间为：20小时。
临时工郭靖实际工作时间为：18小时。
```

如果要在系统中增加一种新的访问者，无须修改源代码，只要增加一个新的具体访问者类即可，在该具体访问者中封装了新的操作元素对象的方法。从增加新的访问者的角度来看，访问者模式符合“开闭原则”。

如果要在系统中增加一种新的具体元素，例如增加一种新的员工类型为“退休人员”，由于原有系统并未提供相应的访问接口（在抽象访问者中没有声明任何访问“退休人员”的方法），因此必须对原有系统进行修改，在原有的抽象访问者类和具体访问者类中增加相应的访问方法。从增加新的元素的角度来看，访问者模式违背了“开闭原则”。

综上所述，访问者模式与抽象工厂模式类似，对“开闭原则”的支持具有倾斜性，可以很方便地添加新的访问者，但是添加新的元素较为麻烦。

## 操作复杂对象结构——访问者模式（四）

26.4 访问者模式与组合模式联用

在访问者模式中，包含一个用于存储元素对象集合的对象结构，我们通常可以使用迭代器来遍历对象结构，同时具体元素之间可以存在整体与部分关系，有些元素作为容器对象，有些元素作为成员对象，可以使用组合模式来组织元素。引入组合模式后的访问者模式结构图如图26-4所示：  
![图26-4 访问者模式与组合模式联用示意图](../img/type3-11-04.gif)  

需要注意的是，在图26-4所示结构中，由于叶子元素的遍历操作已经在容器元素中完成，因此要防止单独将已增加到容器元素中的叶子元素再次加入对象结构中，对象结构中只保存容器元素和孤立的叶子元素。

26.5 访问者模式总结

由于访问者模式的使用条件较为苛刻，本身结构也较为复杂，因此在实际应用中使用频率不是特别高。当系统中存在一个较为复杂的对象结构，且不同访问者对其所采取的操作也不相同时，可以考虑使用访问者模式进行设计。在XML文档解析、编译器的设计、复杂集合对象的处理等领域访问者模式得到了一定的应用。

1.主要优点

访问者模式的主要优点如下：

(1) 增加新的访问操作很方便。使用访问者模式，增加新的访问操作就意味着增加一个新的具体访问者类，实现简单，无须修改源代码，符合“开闭原则”。

(2) 将有关元素对象的访问行为集中到一个访问者对象中，而不是分散在一个个的元素类中。类的职责更加清晰，有利于对象结构中元素对象的复用，相同的对象结构可以供多个不同的访问者访问。

(3) 让用户能够在不修改现有元素类层次结构的情况下，定义作用于该层次结构的操作。

2.主要缺点

访问者模式的主要缺点如下：

(1) 增加新的元素类很困难。在访问者模式中，每增加一个新的元素类都意味着要在抽象访问者角色中增加一个新的抽象操作，并在每一个具体访问者类中增加相应的具体操作，这违背了“开闭原则”的要求。

(2) 破坏封装。访问者模式要求访问者对象访问并调用每一个元素对象的操作，这意味着元素对象有时候必须暴露一些自己的内部操作和内部状态，否则无法供访问者访问。

3.适用场景

在以下情况下可以考虑使用访问者模式：

(1) 一个对象结构包含多个类型的对象，希望对这些对象实施一些依赖其具体类型的操作。在访问者中针对每一种具体的类型都提供了一个访问操作，不同类型的对象可以有不同的访问操作。

(2) 需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而需要避免让这些操作“污染”这些对象的类，也不希望在增加新操作时修改这些类。访问者模式使得我们可以将相关的访问操作集中起来定义在访问者类中，对象结构可以被多个不同的访问者类所使用，将对象本身与对象的访问操作分离。

(3) 对象结构中对象对应的类很少改变，但经常需要在此对象结构上定义新的操作。

**练习**
> Sunny软件公司欲为某高校开发一套奖励审批系统，该系统可以实现教师奖励和学生奖励的审批(Award Check)，如果教师发表论文数超过10篇或者学生论文超过2篇可以评选科研奖，如果教师教学反馈分大于等于90分或者学生平均成绩大于等于90分可以评选成绩优秀奖。试使用访问者模式设计该系统，以判断候选人集合中的教师或学生是否符合某种获奖要求。

> 练习会在[我的github](https://github.com/BruceOuyang/boy-design-pattern)上做掉

