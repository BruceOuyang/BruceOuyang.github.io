> 【学习难度：★★★★☆，使用频率：★★☆☆☆】  
>  直接出处：[建造者模式](http://woquanke.com/books/gof/%E5%BB%BA%E9%80%A0%E8%80%85%E6%A8%A1%E5%BC%8F-Builder%20Pattern.html)  
>  梳理和学习：https://github.com/BruceOuyang/boy-design-pattern  
>  简书日期： 2018/03/08  
>  简书首页：https://www.jianshu.com/p/0fb891a7c5ed  

## 复杂对象的组装与创建——建造者模式（一）

没有人买车会只买一个轮胎或者方向盘，大家买的都是一辆包含轮胎、方向盘和发动机等多个部件的完整汽车。如何将这些部件组装成一辆完整的汽车并返回给用户，这是建造者模式需要解决的问题。建造者模式又称为生成器模式，它是一种较为复杂、使用频率也相对较低的创建型模式。建造者模式为客户端返回的不是一个简单的产品，而是一个由多个部件组成的复杂产品。  

8.1 游戏角色设计  

Sunny软件公司游戏开发小组决定开发一款名为《Sunny群侠传》的网络游戏，该游戏采用主流的RPG(Role Playing Game,角色扮演游戏)模式，玩家可以在游戏中扮演虚拟世界中的一个特定角色，角色根据不同的游戏情节和统计数据（如力量、魔法、技能等）具有不同的能力，角色也会随着不断升级而拥有更加强大的能力。  

作为RPG游戏的一个重要组成部分，需要对游戏角色进行设计，而且随着该游戏的升级将不断增加新的角色。不同类型的游戏角色，其性别、脸型、服装、发型等外部特性都有所差异，例如“天使”拥有美丽的面容和披肩的长发，并身穿一袭白裙；而“恶魔”极其丑陋，留着光头并穿一件刺眼的黑衣。 Sunny公司决定开发一个小工具来创建游戏角色，可以创建不同类型的角色并可以灵活增加新的角色。  

Sunny公司的开发人员通过分析发现，游戏角色是一个复杂对象，它包含性别、脸型等多个组成部分，不同的游戏角色其组成部分有所差异，如图8-1所示：  
![图8-1 几种不同的游戏角色造型（注：本图中的游戏角色造型来源于网络，特此说明）](../img/type1-06-01.gif)

无论是何种造型的游戏角色，它的创建步骤都大同小异，都需要逐步创建其组成部分，再将各组成部分装配成一个完整的游戏角色。如何一步步创建一个包含多个组成部分的复杂对象，建造者模式为解决此类问题而诞生。  

8.2 建造者模式概述  

建造者模式是较为复杂的创建型模式，它将客户端与包含多个组成部分（或部件）的复杂对象的创建过程分离，客户端无须知道复杂对象的内部组成部分与装配方式，只需要知道所需建造者的类型即可。它关注如何一步一步创建一个的复杂对象，不同的具体建造者定义了不同的创建过程，且具体建造者相互独立，增加新的建造者非常方便，无须修改已有代码，系统具有较好的扩展性。  

建造者模式定义如下：  

建造者模式(Builder Pattern)：将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。建造者模式是一种对象创建型模式。  

建造者模式一步一步创建一个复杂的对象，它允许用户只通过指定复杂对象的类型和内容就可以构建它们，用户不需要知道内部的具体构建细节。建造者模式结构如图8-2所示：  
![图8-2 建造者模式结构图](../img/type1-06-02.gif)

在建造者模式结构图中包含如下几个角色：  

* Builder（抽象建造者）：它为创建一个产品Product对象的各个部件指定抽象接口，在该接口中一般声明两类方法，一类方法是buildPartX()，它们用于创建复杂对象的各个部件；另一类方法是getResult()，它们用于返回复杂对象。Builder既可以是抽象类，也可以是接口。  

* ConcreteBuilder（具体建造者）：它实现了Builder接口，实现各个部件的具体构造和装配方法，定义并明确它所创建的复杂对象，也可以提供一个方法返回创建好的复杂产品对象。  

* Product（产品角色）：它是被构建的复杂对象，包含多个组成部件，具体建造者创建该产品的内部表示并定义它的装配过程。  

* Director（指挥者）：指挥者又称为导演类，它负责安排复杂对象的建造次序，指挥者与抽象建造者之间存在关联关系，可以在其construct()建造方法中调用建造者对象的部件构造与装配方法，完成复杂对象的建造。客户端一般只需要与指挥者进行交互，在客户端确定具体建造者的类型，并实例化具体建造者对象（也可以通过配置文件和反射机制），然后通过指挥者类的构造函数或者Setter方法将该对象传入指挥者类中。  

在建造者模式的定义中提到了复杂对象，那么什么是复杂对象？简单来说，复杂对象是指那些包含多个成员属性的对象，这些成员属性也称为部件或零件，如汽车包括方向盘、发动机、轮胎等部件，电子邮件包括发件人、收件人、主题、内容、附件等部件，一个典型的复杂对象类代码示例如下：  
```java
class Product  {
    //定义部件，部件可以是任意类型，包括值类型和引用类型
    private  String partA; 
    private  String partB;
    private  String partC;
    //partA的Getter方法和Setter方法省略
    //partB的Getter方法和Setter方法省略
    //partC的Getter方法和Setter方法省略
}
```  

在抽象建造者类中定义了产品的创建方法和返回方法，其典型代码如下：  
```java
abstract class Builder {
    //创建产品对象
    protected  Product product=new Product();

    public  abstract void buildPartA();
    public  abstract void buildPartB();
    public  abstract void buildPartC();

    //返回产品对象
    public  Product getResult() {
           return  product;
    }
}
```  

在抽象类Builder中声明了一系列抽象的buildPartX()方法用于创建复杂产品的各个部件，具体建造过程在ConcreteBuilder中实现，此外还提供了工厂方法getResult()，用于返回一个建造好的完整产品。  

在ConcreteBuilder中实现了buildPartX()方法，通过调用Product的setPartX()方法可以给产品对象的成员属性设值。不同的具体建造者在实现buildPartX()方法时将有所区别，如setPartX()方法的参数可能不一样，在有些具体建造者类中某些setPartX()方法无须实现（提供一个空实现）。而这些对于客户端来说都无须关心，客户端只需知道具体建造者类型即可。  

在建造者模式的结构中还引入了一个指挥者类Director，该类主要有两个作用：一方面它隔离了客户与创建过程；另一方面它控制产品的创建过程，包括某个buildPartX()方法是否被调用以及多个buildPartX()方法调用的先后次序等。指挥者针对抽象建造者编程，客户端只需要知道具体建造者的类型，即可通过指挥者类调用建造者的相关方法，返回一个完整的产品对象。在实际生活中也存在类似指挥者一样的角色，如一个客户去购买电脑，电脑销售人员相当于指挥者，只要客户确定电脑的类型，电脑销售人员可以通知电脑组装人员给客户组装一台电脑。指挥者类的代码示例如下：  
```java
class Director {
    private  Builder builder;

    public  Director(Builder builder) {
           this.builder=builder;
    }

    public  void setBuilder(Builder builder) {
           this.builder=builer;
    }

    //产品构建与组装方法
    public Product construct() {
           builder.buildPartA();
           builder.buildPartB();
           builder.buildPartC();
           return builder.getResult();
    }
}
```  

在指挥者类中可以注入一个抽象建造者类型的对象，其核心在于提供了一个建造方法construct()，在该方法中调用了builder对象的构造部件的方法，最后返回一个产品对象。  

对于客户端而言，只需关心具体的建造者即可，一般情况下，客户端类代码片段如下所示：  
```java
//……
//可通过配置文件实现
Builder  builder = new ConcreteBuilder(); 
Director director = new  Director(builder);
Product product = director.construct();
//……
```  

可以通过配置文件来存储具体建造者类ConcreteBuilder的类名，使得更换新的建造者时无须修改源代码，系统扩展更为方便。在客户端代码中，无须关心产品对象的具体组装过程，只需指定具体建造者的类型即可。  

建造者模式与抽象工厂模式有点相似，但是建造者模式返回一个完整的复杂产品，而抽象工厂模式返回一系列相关的产品；在抽象工厂模式中，客户端通过选择具体工厂来生成所需对象，而在建造者模式中，客户端通过指定具体建造者类型并指导Director类如何去生成对象，侧重于一步步构造一个复杂对象，然后将结果返回。如果将抽象工厂模式看成一个汽车配件生产厂，生成不同类型的汽车配件，那么建造者模式就是一个汽车组装厂，通过对配件进行组装返回一辆完整的汽车。  

**思考**  
> 如果没有指挥者类Director，客户端将如何构建复杂产品？  

## 复杂对象的组装与创建——建造者模式（二）  

8.3 完整解决方案  

Sunny公司开发人员决定使用建造者模式来实现游戏角色的创建，其基本结构如图8-3所示：  
![图8-3 游戏角色创建结构图](../img/type1-06-03.gif)

在图8-3中，ActorController充当指挥者，ActorBuilder充当抽象建造者，HeroBuilder、AngelBuilder和DevilBuilder充当具体建造者，Actor充当复杂产品。完整代码如下所示： //Actor角色类：复杂产品，考虑到代码的可读性，只列出部分成员属性，且成员属性的类型均为String，真实情况下，有些成员属性的类型需自定义  
```java
class Actor
{
       private  String type; //角色类型
       private  String sex; //性别
       private  String face; //脸型
       private  String costume; //服装
       private  String hairstyle; //发型

       public  void setType(String type) {
              this.type  = type;
       }
       public  void setSex(String sex) {
              this.sex  = sex;
       }
       public  void setFace(String face) {
              this.face  = face;
       }
       public  void setCostume(String costume) {
              this.costume  = costume;
       }
       public  void setHairstyle(String hairstyle) {
              this.hairstyle  = hairstyle;
       }
       public  String getType() {
              return  (this.type);
       }
       public  String getSex() {
              return  (this.sex);
       }
       public  String getFace() {
              return  (this.face);
       }
       public  String getCostume() {
              return  (this.costume);
       }
       public  String getHairstyle() {
              return  (this.hairstyle);
       }
}

//角色建造器：抽象建造者
abstract class ActorBuilder
{
       protected  Actor actor = new Actor();

       public  abstract void buildType();
       public  abstract void buildSex();
       public  abstract void buildFace();
       public  abstract void buildCostume();
       public  abstract void buildHairstyle();

    //工厂方法，返回一个完整的游戏角色对象
       public Actor createActor()
       {
              return actor;
       }
}

//英雄角色建造器：具体建造者
class HeroBuilder extends ActorBuilder
{
       public  void buildType()
       {
              actor.setType("英雄");
       }
       public  void buildSex()
       {
              actor.setSex("男");
       }
       public  void buildFace()
       {
              actor.setFace("英俊");
       }
       public  void buildCostume()
       {
              actor.setCostume("盔甲");
       }
       public  void buildHairstyle()
       {
              actor.setHairstyle("飘逸");
       }    
}

//天使角色建造器：具体建造者
class AngelBuilder extends ActorBuilder
{
       public  void buildType()
       {
              actor.setType("天使");
       }
       public  void buildSex()
       {
              actor.setSex("女");
       }
       public  void buildFace()
       {
              actor.setFace("漂亮");
       }
       public  void buildCostume()
       {
              actor.setCostume("白裙");
       }
       public  void buildHairstyle()
       {
              actor.setHairstyle("披肩长发");
       }    
}

//恶魔角色建造器：具体建造者
class DevilBuilder extends ActorBuilder
{
       public  void buildType()
       {
              actor.setType("恶魔");
       }
       public  void buildSex()
       {
              actor.setSex("妖");
       }
       public  void buildFace()
       {
              actor.setFace("丑陋");
       }
       public  void buildCostume()
       {
              actor.setCostume("黑衣");
       }
       public  void buildHairstyle()
       {
              actor.setHairstyle("光头");
       }    
}
```

指挥者类ActorController定义了construct()方法，该方法拥有一个抽象建造者ActorBuilder类型的参数，在该方法内部实现了游戏角色对象的逐步构建，代码如下所示：  
```java
//游戏角色创建控制器：指挥者
class ActorController
{
    //逐步构建复杂产品对象
       public Actor construct(ActorBuilder ab)
       {
              Actor actor;
              ab.buildType();
              ab.buildSex();
              ab.buildFace();
              ab.buildCostume();
              ab.buildHairstyle();
              actor=ab.createActor();
              return actor;
       }
}
```  

为了提高系统的灵活性和可扩展性，我们将具体建造者类的类名存储在配置文件中，并通过工具类XMLUtil来读取配置文件并反射生成对象，XMLUtil类的代码如下所示：  
```java
import javax.xml.parsers.*;
import org.w3c.dom.*;
import org.xml.sax.SAXException;
import java.io.*;
class XMLUtil
{
//该方法用于从XML配置文件中提取具体类类名，并返回一个实例对象
       public  static Object getBean()
       {
              try
              {
                     //创建文档对象
                     DocumentBuilderFactory  dFactory = DocumentBuilderFactory.newInstance();
                     DocumentBuilder  builder = dFactory.newDocumentBuilder();
                     Document  doc;                                                
                     doc  = builder.parse(new File("config.xml"));

                     //获取包含类名的文本节点
                     NodeList  nl = doc.getElementsByTagName("className");
            Node  classNode=nl.item(0).getFirstChild();
            String  cName=classNode.getNodeValue();

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

配置文件config.xml中存储了具体建造者类的类名，代码如下所示：  
```xml
<?xml version="1.0"?>
<config>
       <className>AngelBuilder</className>
</config>   
```  

编写如下客户端测试代码：  
```java
class Client
{
       public  static void main(String args[])
       {
            ActorBuilder ab; //针对抽象建造者编程
            ab =  (ActorBuilder)XMLUtil.getBean(); //反射生成具体建造者对象

            ActorController ac = new  ActorController();
            Actor actor;
            actor = ac.construct(ab); //通过指挥者创建完整的建造者对象

            String  type = actor.getType();
            System.out.println(type  + "的外观：");
            System.out.println("性别：" + actor.getSex());
            System.out.println("面容：" + actor.getFace());
            System.out.println("服装：" + actor.getCostume());
            System.out.println("发型：" + actor.getHairstyle());
       }
}
```  

编译并运行程序，输出结果如下：  
```
天使的外观：
性别：女
面容：漂亮
服装：白裙
发型：披肩长发
```  

在建造者模式中，客户端只需实例化指挥者类，指挥者类针对抽象建造者编程，客户端根据需要传入具体的建造者类型，指挥者将指导具体建造者一步一步构造一个完整的产品（逐步调用具体建造者的buildX()方法），相同的构造过程可以创建完全不同的产品。在游戏角色实例中，如果需要更换角色，只需要修改配置文件，更换具体角色建造者类即可；如果需要增加新角色，可以增加一个新的具体角色建造者类作为抽象角色建造者的子类，再修改配置文件即可，原有代码无须修改，完全符合“开闭原则”。  

## 复杂对象的组装与创建——建造者模式（三）  

8.4 关于Director的进一步讨论  

指挥者类Director在建造者模式中扮演非常重要的作用，简单的Director类用于指导具体建造者如何构建产品，它按一定次序调用Builder的buildPartX()方法，控制调用的先后次序，并向客户端返回一个完整的产品对象。下面我们讨论几种Director的高级应用方式：  

1.省略Director  

在有些情况下，为了简化系统结构，可以将Director和抽象建造者Builder进行合并，在Builder中提供逐步构建复杂产品对象的construct()方法。由于Builder类通常为抽象类，因此可以将construct()方法定义为静态(static)方法。如果将游戏角色设计中的指挥者类ActorController省略，ActorBuilder类的代码修改如下：  
```java
abstract class ActorBuilder
{
       protected static Actor actor = new  Actor();

       public  abstract void buildType();
       public  abstract void buildSex();
       public  abstract void buildFace();
       public  abstract void buildCostume();
       public  abstract void buildHairstyle();

       public static Actor  construct(ActorBuilder ab)
       {
              ab.buildType();
              ab.buildSex();
              ab.buildFace();
              ab.buildCostume();
              ab.buildHairstyle();
              return actor;
       }
}
```  

对应的客户端代码也将发生修改，其代码片段如下所示：  
```java
        ……
        ActorBuilder  ab;
        ab  = (ActorBuilder)XMLUtil.getBean();

        Actor  actor;
        actor =  ActorBuilder.construct(ab);
        ……
```  

除此之外，还有一种更简单的处理方法，可以将construct()方法的参数去掉，直接在construct()方法中调用buildPartX()方法，代码如下所示：  
```java
abstract class ActorBuilder
{
       protected  Actor actor = new Actor();

       public  abstract void buildType();
       public  abstract void buildSex();
       public  abstract void buildFace();
       public  abstract void buildCostume();
       public  abstract void buildHairstyle();

       public Actor construct()
       {
              this.buildType();
              this.buildSex();
              this.buildFace();
              this.buildCostume();
              this.buildHairstyle();
              return actor;
       }
}
```  

客户端代码代码片段如下所示：  
```java
        ……
        ActorBuilder  ab;
        ab  = (ActorBuilder)XMLUtil.getBean();
        
        Actor  actor;
        actor = ab.construct();
        ……
```  

此时，construct()方法定义了其他buildPartX()方法调用的次序，为其他方法的执行提供了一个流程模板，这与我们在后面要学习的模板方法模式非常类似。  

以上两种对Director类的省略方式都不影响系统的灵活性和可扩展性，同时还简化了系统结构，但加重了抽象建造者类的职责，如果construct()方法较为复杂，待构建产品的组成部分较多，建议还是将construct()方法单独封装在Director中，这样做更符合“单一职责原则”。  

2.钩子方法的引入  

建造者模式除了逐步构建一个复杂产品对象外，还可以通过Director类来更加精细地控制产品的创建过程，例如增加一类称之为钩子方法(HookMethod)的特殊方法来控制是否对某个buildPartX()的调用。  

钩子方法的返回类型通常为boolean类型，方法名一般为isXXX()，钩子方法定义在抽象建造者类中。例如我们可以在游戏角色的抽象建造者类ActorBuilder中定义一个方法isBareheaded()，用于判断某个角色是否为“光头(Bareheaded)”，在ActorBuilder为之提供一个默认实现，其返回值为false，代码如下所示：  
```java
abstract class ActorBuilder
{
       protected  Actor actor = new Actor();

       public  abstract void buildType();
       public  abstract void buildSex();
       public  abstract void buildFace();
       public  abstract void buildCostume();
       public  abstract void buildHairstyle();

       //钩子方法
       public boolean isBareheaded()
       {
              return false;
       }

       public  Actor createActor()
       {
              return  actor;
       }
}
```  

如果某个角色无须构建头发部件，例如“恶魔(Devil)”，则对应的具体建造器DevilBuilder将覆盖isBareheaded()方法，并将返回值改为true，代码如下所示：  
```java
class DevilBuilder extends ActorBuilder
{
       public  void buildType()
       {
              actor.setType("恶魔");
       }
       public  void buildSex()
       {
              actor.setSex("妖");
       }
       public  void buildFace()
       {
              actor.setFace("丑陋");
       }
       public  void buildCostume()
       {
              actor.setCostume("黑衣");
       }
       public  void buildHairstyle()
       {
              actor.setHairstyle("光头");
       }
       //覆盖钩子方法
       public boolean isBareheaded()
       {
              return true;
       }     
}
```  

此时，指挥者类ActorController的代码修改如下：  
```java
class ActorController
{
       public  Actor construct(ActorBuilder ab)
       {
              Actor  actor;
              ab.buildType();
              ab.buildSex();
              ab.buildFace();
              ab.buildCostume();
              //通过钩子方法来控制产品的构建
              if(!ab.isBareheaded())
              {
                     ab. buildHairstyle();
              }
              actor=ab.createActor();
              return  actor;
       }
}
```  

当在客户端代码中指定具体建造者类型并通过指挥者来实现产品的逐步构建时，将调用钩子方法isBareheaded()来判断游戏角色是否有头发，如果isBareheaded()方法返回true，即没有头发，则跳过构建发型的方法buildHairstyle()；否则将执行buildHairstyle()方法。通过引入钩子方法，我们可以在Director中对复杂产品的构建进行精细的控制，不仅指定buildPartX()方法的执行顺序，还可以控制是否需要执行某个buildPartX()方法。  

8.5 建造者模式总结

建造者模式的核心在于如何一步步构建一个包含多个组成部件的完整对象，使用相同的构建过程构建不同的产品，在软件开发中，如果我们需要创建复杂对象并希望系统具备很好的灵活性和可扩展性可以考虑使用建造者模式。

1. 主要优点

建造者模式的主要优点如下：

(1) 在建造者模式中，客户端不必知道产品内部组成的细节，将产品本身与产品的创建过程解耦，使得相同的创建过程可以创建不同的产品对象。  

(2) 每一个具体建造者都相对独立，而与其他的具体建造者无关，因此可以很方便地替换具体建造者或增加新的具体建造者，用户使用不同的具体建造者即可得到不同的产品对象。由于指挥者类针对抽象建造者编程，增加新的具体建造者无须修改原有类库的代码，系统扩展方便，符合“开闭原则”  

(3) 可以更加精细地控制产品的创建过程。将复杂产品的创建步骤分解在不同的方法中，使得创建过程更加清晰，也更方便使用程序来控制创建过程。  

2. 主要缺点  

建造者模式的主要缺点如下：  

(1) 建造者模式所创建的产品一般具有较多的共同点，其组成部分相似，如果产品之间的差异性很大，例如很多组成部分都不相同，不适合使用建造者模式，因此其使用范围受到一定的限制。  

(2) 如果产品的内部变化复杂，可能会导致需要定义很多具体建造者类来实现这种变化，导致系统变得很庞大，增加系统的理解难度和运行成本。  

3. 适用场景  

在以下情况下可以考虑使用建造者模式：  

(1) 需要生成的产品对象有复杂的内部结构，这些产品对象通常包含多个成员属性。  

(2) 需要生成的产品对象的属性相互依赖，需要指定其生成顺序。  

(3) 对象的创建过程独立于创建该对象的类。在建造者模式中通过引入了指挥者类，将创建过程封装在指挥者类中，而不在建造者类和客户类中。  

(4) 隔离复杂对象的创建和使用，并使得相同的创建过程可以创建不同的产品。  

**练习**

Sunny软件公司欲开发一个视频播放软件，为了给用户使用提供方便，该播放软件提供多种界面显示模式，如完整模式、精简模式、记忆模式、网络模式等。在不同的显示模式下主界面的组成元素有所差异，如在完整模式下将显示菜单、播放列表、主窗口、控制条等，在精简模式下只显示主窗口和控制条，而在记忆模式下将显示主窗口、控制条、收藏列表等。尝试使用建造者模式设计该软件。

> 练习会在[我的github](https://github.com/BruceOuyang/boy-design-pattern)上做掉

