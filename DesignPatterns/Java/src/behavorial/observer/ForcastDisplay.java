package behavorial.observer;

import java.util.Observable;
import java.util.Observer;
public class ForcastDisplay implements Observer, DisplayElement{
	private float lastPressure, currentPressure = 29.92f;
	private Observable observable;
	
	public ForcastDisplay(Observable observable){
		this.observable = observable;
		observable.addObserver(this);
	}

	public void unregister(){
		this.observable.deleteObserver(this);
	}
	@Override
	public void display() {
		// TODO Auto-generated method stub
		System.out.println(lastPressure + " --- " + currentPressure);
		
	}

	@Override
	public void update(Observable o, Object arg) {
		// TODO Auto-generated method stub
		if(o instanceof WeatherDataObservable) {
			WeatherDataObservable weatherDataObservable = (WeatherDataObservable) o;
			lastPressure = currentPressure;
			currentPressure = weatherDataObservable.getPressure();
		}
		display();
	}
}
