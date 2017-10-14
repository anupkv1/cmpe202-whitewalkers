function SubjectProxy(){

}
SubjectProxy.prototype = {

	readData : function(authToken){},
	writeData : function(authToken,data){}
}

function RealSubject(){
	this.theData = "";

	this.readData = function(){
		return this.theData;
	}
	this.writeData = function(data){
		this.theData = data;
	}


}

function AccessProxy(){
	this.subject = new RealSubject();

	this.readData = function(authToken){
		console.log("Read "+authToken);
		if ( authToken == "1234567890" )
            return this.subject.readData() ;
        else
            throw "Unauthorized Access Read" ;
	}

	this.writeData = function(authToken,data){
		console.log("Write "+authToken);
        if ( authToken== "1234567890" )
            this.subject.writeData(data);
        else
            throw "Unauthorized Access Write" ;
	}

}


function CachingProxy(){
    this.subject = new RealSubject();
    this.dataCache = null;
    this.cacheExpired = false;
}
CachingProxy.prototype = Object.create(SubjectProxy.prototype);
CachingProxy.prototype.readData = function(authToken){
        if (this.dataCache != null && !this.cacheExpired) {
            return this.dataCache;
        }
        else {
            this.dataCache = this.subject.readData();
            this.cacheExpired = false;
            return this.dataCache;
        }

} 
CachingProxy.prototype.writeData = function(authToken,data){
        this.subject.writeData(data);
        this.dataCache = data;
        this.cacheExpired = false;
}
CachingProxy.constructor = CachingProxy;


function RemotingProxy()
{
	this.httpClient = (function(){
		this.get = function(url){
			return "The Remote Data!" ;
		}

		this.put = function(url,data){
			console.log("Remote Host Update Processed!");
		}

		return {
			"get":this.get,
			"put":this.put
		}
	}());
}
RemotingProxy.prototype = Object.create(SubjectProxy.prototype)
RemotingProxy.prototype.readData = function(auth){
		return this.httpClient.get( "http://remoteserver/data/id/12345" ) ;
}

RemotingProxy.prototype.writeData = function(authToken,data){
		 this.httpClient.put( "http://remoteserver/data/id/12345", data);
	}
RemotingProxy.constructor = RemotingProxy;



function Client(){
    var proxy1 = new AccessProxy() ;
    var proxy2 = new CachingProxy() ;
    var proxy3 = new RemotingProxy() ;

    this.runTest = function(){
            try {
            // read console.log   
            console.log( proxy1.readData("1234567890") );
            console.log( proxy2.readData("1234567890") );
            console.log( proxy3.readData("1234567890") );
            // cache hit
            console.log( proxy2.readData("1234567890") );
            // write
            proxy1.writeData("1234567890", "New Data");
            proxy2.writeData("1234567890", "New Data");
            proxy3.writeData("1234567890", "New Data");
            // access violation
            proxy1.readData("0000000000");
            console.log(proxy2.readData("1234567890"));
            // proxy3.readData("1234567890");
            // proxy1.readData("1234567890");
        }
        catch (e)
        {
            console.log( e );
        }

    }
}

var c = new Client();
c.runTest();
