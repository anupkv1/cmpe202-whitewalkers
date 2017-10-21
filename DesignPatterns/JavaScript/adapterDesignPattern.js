function Adaptee(){
}
Adaptee.prototype.printMessage = function(){	
}

function Target(){
}
Target.prototype.sayHello = function(){
}


function AdapteeObject()
{
	this.targetObject = "";
}
AdapteeObject.prototype = Object.create(Adaptee.prototype);
AdapteeObject.prototype.printMessage = function(msg)
{
		console.log(msg);
}
AdapteeObject.constructor = AdapteeObject;

function TargetObject()
{
	this.adaptee = new AdapteeObject();
}
TargetObject.prototype = Object.create(Target.prototype);
TargetObject.prototype.sayHello = function()
{
		this.adaptee.printMessage("Hello Function of AdapteeObject");
}
TargetObject.constructor = TargetObject;


function Client(){

    this.runTest = function()
  	{
        var obj = new TargetObject();
        obj.sayHello();
    }
}

var c = new Client();
c.runTest();
