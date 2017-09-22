/*
PREREQUISITE : Do install node.js in your system in order to have a 

Created by : Abhishek Chaudhary
SJSU ID : 011812606
Date of Creation : 22nd September 2017

Purpose : Knowledge transfer on Objects in JavaScript
*/



var a = "hello";
var b = [];
var c = {};
var d = 20;
var e = function(){
	console.log("Hello World");
};

console.log(typeof a);//string
console.log(typeof b);//object
console.log(typeof c);//object
console.log(typeof d);//number
console.log(typeof e);//function



var employee ={
	"name" : "Abhishek",
	"id" : "78998899",
	"address" :{
		"hno" : "190",
		"street" : "Ryland Street",
		"city" : "San Jose"
	},
	"getDetails" : function(){
		console.log("The name of the employee is "+this.name);
		console.log("The address of the employee is "+this.address.hno+" "+this.address.street+" "+this.address.city);
	}
};

//These are the two ways of accessing the properties of a JSON object 
console.log(employee.name);
console.log(employee["name"]);

employee.getDetails();

//This will return all the keys corresponding to the JSON object
console.log(Object.keys(employee));
// Output : [ 'name', 'id', 'address', 'getDetails' ]


// deleting a certain property in a JSON object
delete employee.id;
console.log(Object.keys(employee));
// Output : [ 'name', 'address', 'getDetails' ] , as we can see id has been removed from the object

/******************* Creating an Object through a constructor function ************************/


function Person(name,city){
	this.name = name ;
	this.city = city ;

	this.getDetails = function(){
		console.log(this.name+" lives in "+this.city+" City");
	}
}

var abhi = new Person("Abhishek","San Jose");
abhi.getDetails();
// Abhishek lives in San Jose City


var jasmeet = new Person("Jasmeet Singh", "Mountain View");
jasmeet.getDetails();
// Jasmeet Singh lives in Mountain View City


/******************* Creating an Object through a defined prototype ************************/

/* here we are defining a prototype for a square object , all the objects that are created
from this prototypw will have all the properties defined here*/
var Square = {
	length : 10
};

console.log(typeof sqaure1);
//object

var sqaure1 = Object.create(Square);
console.log("The length of the square is "+sqaure1["length"]);
//The length of the square is 10


//Changing the length value of the square
sqaure1.length = 20;
console.log("The length of the square is "+sqaure1["length"]);
//The length of the square is 20