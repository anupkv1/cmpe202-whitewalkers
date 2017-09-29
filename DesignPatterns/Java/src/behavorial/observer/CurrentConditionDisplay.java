package behavorial.observer;

public class CurrentConditionDisplay implements Observer, DisplayElement {
	private float temprature;
	private float humidity;
	private float pressure;
	private Subject weatherData; 
	
	public CurrentConditionDisplay(Subject weatherData){
		this.weatherData = weatherData;
		weatherData.registerObserver(this);
	}
	
	public void unregister(){
		this.weatherData.unregisterObserever(this);
	}
	
	@Override
	public void display() {
		// TODO Auto-generated method stub
		System.out.println(toString());
	}

	@Override
	public void update(float temp, float humidity, float pressure) {
		// TODO Auto-generated method stub
		this.temprature =temp;
		this.humidity = humidity;
		display();

	}
	
	public String toString(){
		StringBuffer strbuf = new StringBuffer();
		strbuf.append("Current Conditions: ");
		strbuf.append(temprature);
		strbuf.append(humidity);
		//strbuf.append(pressure);
		return strbuf.toString();
	}
	


}
