package behavorial.observer;

import java.util.ArrayList;
import java.util.Observable;
import java.util.Observer;

public class WeatherDataObservable extends Observable {
	
	private float temprature;
	private float humidity;
	private float pressure;
	
	public WeatherDataObservable(){

	}

	public void measurmentChanged(){
		setChanged();
		notifyObservers();
	}
	
	public void setMesurements(float temp, float humidity, float pressure){
		this.setTemprature(temp);
		this.setHumidity(humidity);
		this.setPressure(pressure);
		measurmentChanged();
	}
	
	
	public static void main(String[] args){
		WeatherDataObservable weatherData = new WeatherDataObservable();
		ForcastDisplay fd = new ForcastDisplay(weatherData);
		
		weatherData.setMesurements(50.0f, 65, 30.4f);
		weatherData.setMesurements(50.0f, 65, 30.4f);
		fd.unregister();
		weatherData.setMesurements(50.0f, 65, 30.4f);
	}

	public float getTemprature() {
		return temprature;
	}

	public void setTemprature(float temprature) {
		this.temprature = temprature;
	}

	public float getHumidity() {
		return humidity;
	}

	public void setHumidity(float humidity) {
		this.humidity = humidity;
	}

	public float getPressure() {
		return pressure;
	}

	public void setPressure(float pressure) {
		this.pressure = pressure;
	}
}
