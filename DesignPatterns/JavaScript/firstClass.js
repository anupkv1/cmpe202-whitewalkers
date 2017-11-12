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
