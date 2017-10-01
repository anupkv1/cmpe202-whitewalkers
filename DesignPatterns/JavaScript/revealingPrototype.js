/*
PREREQUISITE : Do install node.js in your system in order to have a 

Created by : Abhishek Chaudhary
SJSU ID : 011812606
Date of Creation : 28th September 2017
*/

/*
In prototype pattern, each object instance gets a copy of all functions/properties each time an 
object is created, only one set of functions/properties exists across all objects, resulting in less 
memory consumption. Or it can also be cocluded that the functions and properties are defined once
per prototype rather than per object

Here the code is litte different that traditional prototype, we are revealing the properties
attached to the prototype through an object being returned
*/


// To summarise this we take the real world example of a Car

//here we are defining a constructor function for creating the instance of type Car
var Car = function(name){
	this.name = name;
}

/*from now on all the methods and properties on the Car will be defined on the __proto__
property of the project this will result in sharing the common properties through all the instances
created from the Car, these properties wont be local to the object rather commmon to all the 
object created through Car constructor function
*/
Car.prototype = function(){

	var start = function() {
	// body...
	console.log("Starting the engine of the Car : "+this.name);
	};

	var stop = function() {
	// body...
	console.log("Stopping the engine of the Car : "+this.name)
};

	return {
		start:start,
		stop:stop

	}
}();/* here we are self invoking the function which returns an object having references to start and 
stop function attached to the prototype */	
// adding methods to the prototype makes the logic efficient in memory usage



var audi = new Car("Audi");
var bmw = new Car("BMW");

audi.start();
bmw.start();
audi.stop();
bmw.stop();
console.log(audi);
console.log(bmw);

console.log(audi.__proto__);
console.log(bmw.__proto__);


/*
Output : 
Starting the engine of the Car : Audi
Starting the engine of the Car : BMW
Stopping the engine of the Car : Audi
Stopping the engine of the Car : BMW
Car { name: 'Audi' }
Car { name: 'BMW' }
Car { start: [Function], stop: [Function] }
Car { start: [Function], stop: [Function] }

As analysed from the output:
Line 71 to 74 :
	We are starting and stopping the engine of different cars

Line 75-76
	Objects audi and bmw hold only the property defined in its constructor function

Line 77-78
	start and stop functionalities are added only to proto of Car and not to individual objects

*/