'use strict';
class Handler {
    constructor() {}
    HandleRequest() {}
}

class ConcreteHandler1 extends Handler {
    constructor() {
        super()
        this.successor = null
    }

    setSuccessor(successor) {
        this.successor = successor
    }

    HandleRequest(request) {
        if (request === 'R1')
            console.log('This one is handled by ConcreteHandler1')
        else {
            if (this.successor != null)
                this.successor.HandleRequest(request)
        }
    }
}

class ConcreteHandler2 extends Handler {
    constructor() {
        super()
        this.successor = null
    }
    setSuccessor(successor) {
        this.successor = successor
    }

    HandleRequest(request) {
        if (request === 'R2')
            console.log('This one is handled by ConcreteHandler2')
        else {
            if (this.successor != null)
                this.successor.HandleRequest(request)
        }
    }
}

class ConcreteHandler3 extends Handler {
    constructor() {
        super()
    }

    setSuccessor(successor) {
        this.successor = successor
    }

    HandleRequest(request) {
        if (request === 'R3')
            console.log('This one is handled by ConcreteHandler3')
        else {
            if (this.successor != null)
                this.successor.HandleRequest(request)
        }
    }
}

function test() {
    var handle1 = new ConcreteHandler1()
    var handle2 = new ConcreteHandler2()
    var handle3 = new ConcreteHandler3()
    handle1.setSuccessor(handle2)
    handle2.setSuccessor(handle3)
    handle1.HandleRequest('R2')
    handle1.HandleRequest('R3')
    handle1.HandleRequest('R1')
    handle1.HandleRequest('RX')
}
test()