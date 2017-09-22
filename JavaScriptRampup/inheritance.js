/*
PREREQUISITE : Do install node.js in your system in order to have a 

Created by : Abhishek Chaudhary
SJSU ID : 011812606
Date of Creation : 22nd September 2017

Purpose : Knowledge transfer on Inheritance in JavaScript
Note : Will be discusssing this in detail in the meetup
*/

function Box(length,breadth){
	this.length = length;
	this.breadth = breadth;
	this.getArea = function(){
		console.log("The area of the Box is : "+this.length*this.breadth);
	}
}

console.log(typeof Box); // function

var r1 = new Box(10,20);

Box.prototype.height = 30;

Box.prototype.getVolume = function() {
	console.log("The volume of the Box is : "+this.length*this.breadth*this.height);
};

console.log(r1);
//Box { length: 10, breadth: 20, getArea: [Function] }, this wont comprise the properties pointed by __proto__

console.log(r1.__proto__);
//Box { height: 30, getVolume: [Function] }

r1.getArea();//The area of the Box is : 200
r1.getVolume();//The volume of the Box is : 6000