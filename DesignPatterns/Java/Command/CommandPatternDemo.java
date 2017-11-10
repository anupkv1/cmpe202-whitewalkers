package com.designPattern.Command;

/*
 * Command pattern is a data driven design pattern and falls under behavioral pattern category.
 *  A request is wrapped under an object as command and passed to invoker object. 
 *  Invoker object looks for the appropriate object which can handle this command and passes 
 *  the command to the corresponding object which executes the command.Today's pattern is the Command, 
 *  which allows the requester of a particular action to be decoupled from the object that performs the action. 
 *  Where the Chain of Responsibility pattern forwarded requests along a chain, the Command pattern forwards the 
 *  request to a specific module.


*/
public class CommandPatternDemo {
	   public static void main(String[] args) {
	      Stock abcStock = new Stock();

	      BuyStock buyStockOrder = new BuyStock(abcStock);
	      SellStock sellStockOrder = new SellStock(abcStock);

	      Broker broker = new Broker();
	      broker.takeOrder(buyStockOrder);
	      broker.takeOrder(sellStockOrder);

	      broker.placeOrders();
	   }
	}
