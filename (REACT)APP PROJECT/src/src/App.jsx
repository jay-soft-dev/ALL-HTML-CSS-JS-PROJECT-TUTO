import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      <h1>⏰ React Digital Clock</h1>
      <div className="clock-card">{time}</div>
    </div>
  );
}

export default App;