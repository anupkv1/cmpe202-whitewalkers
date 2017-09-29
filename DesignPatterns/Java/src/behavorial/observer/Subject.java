package behavorial.observer;

public interface Subject {
	public void registerObserver(Observer o);
	public void unregisterObserever(Observer o);
	public void notifyObservers();
}
