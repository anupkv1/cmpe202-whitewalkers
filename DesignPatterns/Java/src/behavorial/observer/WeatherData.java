package behavorial.observer;

import java.util.ArrayList;

public class WeatherData implements Subject {
	private ArrayList<Observer> Observers;
	private float temprature;
	private float humidity;
	private float pressure;
	
	public WeatherData(){
		Observers = new ArrayList<Observer>();
	}
	
	@Override
	public void registerObserver(Observer o) {
		// TODO Auto-generated method stub
		Observers.add(o);
	}

	@Override
	public void unregisterObserever(Observer o) {
		// TODO Auto-generated method stub
		int index = Observers.indexOf(o);
		if (index >= 0) {
			Observers.remove(index);
		}
	}

	@Override
	public void notifyObservers() {
		// TODO Auto-generated method stub
		for (int i=0; i < Observers.size(); i++){
			Observer observer = (Observer) Observers.get(i);
			observer.update(temprature, humidity, pressure);
		}
	}

	public void measurmentChanged(){
		notifyObservers();
	}
	
	public void setMesurements(float temp, float humidity, float pressure){
		this.temprature = temp;
		this.humidity = humidity;
		this.pressure = pressure;
		measurmentChanged();
	}
	
	public static void main(String[] args){
		WeatherData weatherData = new WeatherData();
		CurrentConditionDisplay ccd = new CurrentConditionDisplay(weatherData);
		weatherData.setMesurements(50.0f, 65, 30.4f);
		weatherData.setMesurements(50.0f, 65, 30.4f);
		ccd.unregister();
		weatherData.setMesurements(50.0f, 65, 30.4f);
	}
}
