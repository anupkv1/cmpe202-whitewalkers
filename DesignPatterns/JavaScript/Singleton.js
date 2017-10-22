var Singleton = (function(){
    var instance;

    return {
        getInstance: function() {
            if (!instance) {
                console.log("Print test 1 Obj");
                instance = new Object("Test Object");
            }
        return instance;
        }
    }
})();

var Client = function(){
    //var obj = new Singleton();

    // access the singleton instance
    theSingleton = Singleton.getInstance() ;
    console.log(theSingleton);

    // access the singleton instance 2nd time
    theSingleton = Singleton.getInstance() ;
    console.log(theSingleton);
    
}

var client = new Client();