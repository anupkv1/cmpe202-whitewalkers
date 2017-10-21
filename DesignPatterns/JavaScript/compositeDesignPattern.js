function Component()
{
}
Component.prototype = {
	printDescription : function(){},
	addChild : function(c){},// c = Component object
	removeChild : function(c){},// c = Component object
	getChild : function(i){},// i = int
}


function Composite(d){
    this.components = [];
    this.description = d;
}

Composite.prototype = Object.create(Component.prototype);

    Composite.prototype.printDescription = function()
    {
        console.log(this.description);
        this.components.forEach(function(data){
            data.printDescription();
        });

    }

    Composite.prototype.addChild = function(c){
        this.components.push(c);
    }

    Composite.prototype.removeChild = function(c){
        var index = this.components.indexOf(c);
        if (index > -1)
            this.components.splice(index,1);
    }

    Composite.prototype.getChild =function(i){
        return this.components[i];
    }
Composite.constructor = Composite;



function Leaf(d,p){
    this.description = d;
    this.price = p;

    this.printDescription = function()
    {
        console.log(this.description + " : " +this.price);
    }
}


function BuildOrder()
{
    this.getOrder = function(){
        var order = new Composite("Order");
        order.addChild(new Leaf("Crispy Onion Strings", 5.50 ));
        order.addChild(new Leaf("The Purist", 8.00 ));
        var customBurger = new Composite( "Build Your Own Burger" ) ;
        customBurger.addChild(new Leaf("Beef, 1/3 lb on a Bun", 9.50 )); // base price for 1/3 lb
        customBurger.addChild(new Leaf("Danish Blue Cheese", 0.00 )); // 1 cheese free, extra cheese +1.00
        customBurger.addChild(new Leaf("Horseradish Cheddar", 1.00 )); // extra cheese +1.00
        customBurger.addChild(new Leaf("Bermuda Red Onion", 0.00 )); // 4 toppings free, extra +.75
        customBurger.addChild(new Leaf("Black Olives", 0.00 )); // 4 toppings free, extra +.75
        customBurger.addChild(new Leaf("Carrot Strings", 0.00 )); // 4 toppings free, extra +.75
        customBurger.addChild(new Leaf("Coleslaw", 0.00 )); // 4 toppings free, extra +.75
        customBurger.addChild(new Leaf("Applewood Smoked Bacon", 1.50 )); // premium topping +1.50
        customBurger.addChild(new Leaf("Appricot Sauce", 0.00 )); // 1 sauce free, extra +.75
        order.addChild( customBurger );
        return order ;
    }
}



function Client()
{
    this.runTest = function(){
        var theOrder= new BuildOrder().getOrder();
        theOrder.printDescription();
    }
}

var c = new Client();
c.runTest();


