/* Implementation of Chain of responsibility - What object is going to fullfil the request  */
var concrete_handleA = function() {
    this.successor = null;
}

concrete_handleA.prototype = {

    setSuccessor: function(next) {
        this.successor = next ;
	},

    handleRequest: function(request) {
        console.log("R1 got the request...");
        if ( request.toUpperCase() == "R1" )
        {
            console.log( arguments.callee.name + " => This one is mine!"); //Not able to display class name used as prototype
        }
        else
        {
            this.successor != null && this.successor.handleRequest(request);
        }
    }
}

var concrete_handleB = function() {
    this.successor = null;
}

concrete_handleB.prototype = {

    setSuccessor: function(next) {
        this.successor = next ;
	},

    handleRequest: function(request) {
        console.log("R2 got the request...");
        if ( request.toUpperCase() == "R2" )
        {
            console.log( arguments.callee.name + " => This one is mine!");
        }
        else
        {
            this.successor != null && this.successor.handleRequest(request);
        }
    }
}

var concrete_handleC = function() {
    this.successor = null;
}

concrete_handleC.prototype = {

    setSuccessor: function(next) {
        this.successor = next ;
	},

    handleRequest: function(request) {
        console.log("R3 got the request...");
        if ( request.toUpperCase() == "R3" )
        {
            console.log(arguments.callee.name + " => This one is mine!");
        }
        else
        {
            this.successor != null && this.successor.handleRequest(request);
        }
    }
}

var Client = function(){
    var h1 = new concrete_handleA(),
    h2 = new concrete_handleB();
    h3 = new concrete_handleC();

    h1.setSuccessor(h2);
    h2.setSuccessor(h3);

    this.receiver = h1;
}

Client.prototype.handleRequest = function(request){
    this.receiver.handleRequest(request)
}

var client = new Client();
client.handleRequest("R1");
client.handleRequest("R2");
client.handleRequest("R3");