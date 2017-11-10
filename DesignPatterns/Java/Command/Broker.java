package com.designPattern.Command;

/*
 * This class is the command object which invokes the method of the receiver*/
import java.util.ArrayList;
import java.util.List;

   public class Broker {
   private List<Order> orderList = new ArrayList<Order>(); 

   public void takeOrder(Order order){
      orderList.add(order);		
   }

   public void placeOrders(){
   
      for (Order order : orderList) {
         order.execute();
      }
      //once the orders are executed they are removed from the list
      orderList.clear();
   }
}
