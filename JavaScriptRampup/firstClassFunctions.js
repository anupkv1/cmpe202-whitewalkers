/*
PREREQUISITE : Do install node.js in your system in order to have a 

Created by : Abhishek Chaudhary
SJSU ID : 011812606
Date of Creation : 22nd September 2017
*/

/*
Everything you can with other datatypes in Javascript , you can do the same witn the functions i.e.
they are just a kind of a datatype like arrays and strings, you can pass the fucntions like an 
argument to other functions just like you pass variable and objects.
*/

var helloWorld = function(){
	console.log("This is the first function")
}

function callHelloFunction(functionToBeCalled)
{
	functionToBeCalled();
}

//here the function helloWorld is being passed an an argument to the callHelloFunction function
callHelloFunction(helloWorld);

callHelloFunction(function(){
	console.log("This is the anonymous function")
});


// here the typeof operator is being used in the print statement 
// this will outoput as function as variable helloword is of type function
console.log(typeof helloWorld);

/*
Function expression is a block of code the results in a particular value. Such expression are
created for the purpose of executing them only once, so they are often termed as self invoked functions
*/
var x = 10;
var y = 20;
var sum = function(x,y){
	console.log(x);
	console.log(y);
	return x+y;
}(x,y); // here the function declaration is being ended with parenthesis or its call itself 
// x and y have been set outside this function and are being passed as an argument

console.log("This sum is "+sum);


//Self invoked functions
/*
The following function has been defined in parenthesis i.e. there exist a closure that bounds this
we cannot explicitly call this function from outside it can only be self invoked once, in the end 
a number is being passed to this and it is being checked whether this is prime or not
*/
(function(number){
	var c = 0;
	for(i=1;i<=number;i++){
		if(number%i == 0){
			c++;
		}
	}

	if(c ==2){
		console.log("Number is Prime")
	}
	else{
		console.log("Number is not Prime")
	}
})(787);


/*
Here in this self invoked functions is getting a number that is being evaluated from an 
anonyumous function which is return the sum of two variable x and y, the sum hence returned
will be then checked for the prime number logic
*/
(function(number){
	var c = 0;
	for(i=1;i<=number;i++){
		if(number%i == 0){
			c++;
		}
	}

	if(c ==2){
		console.log("Number is Prime")
	}
	else{
		console.log("Number is not Prime")
	}
})(function(x,y){
	return x+y;
}(x,y));
