// var component = function(){
    
// }
// component.prototype = {
//     operation: function(){}
// }

var decorator = function(c){
    console.log("decorator called " + arguments.callee.name);
    this.component = c;
}
decorator.prototype = {
    operation : function(){
        return this.component.operation();
    }
    
}


var concreteDecoratorA = function(c){
    decorator.call(this,c)
    //decorator.apply(concreteDecoratorA, c);
   //Difference between call and apply?
}

concreteDecoratorA.prototype = Object.create(decorator.prototype, {
    operation: {
        value: function() {
        console.log("opertionA :");
        msg = decorator.prototype.operation.call(this);
        console.log(msg);
        return "<A>" + msg + "</A>";
    }
    }
});
concreteDecoratorA.prototype.constructor = concreteDecoratorA;

var concreteDecoratorB = function(c){
    decorator.call(this,c)
}
concreteDecoratorB.prototype = Object.create(decorator.prototype, {
    operation: {
        value: function() {
        console.log("opertionB :");
        // decorator.prototype.operation.apply(this);
        msg = decorator.prototype.operation.call(this);
        return "<B>" + msg + "</B>";
    }
    }
} );
concreteDecoratorB.prototype.constructor = concreteDecoratorB;

var concreteComponent = function(){
}
concreteComponent.prototype.operation = function(){
    console.log("concreteComponent*****")
    return ("Hello World");
}


var Client = function(){
    var output = new concreteDecoratorB(new concreteDecoratorA(new concreteComponent));
    var message = output.operation();
    console.log(message);
}

var client = new Client();
