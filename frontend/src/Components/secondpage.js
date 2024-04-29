import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HelpInfo() {
  return (
    <div className="help-info">
      <h2>Help Information</h2>
      <p>Welcome to the Aviation Information help page! Here's what we provide:</p>
      <ul>
        <li><strong>Weight/Balance Information:</strong> We provide information on the weight and balance of the aircraft to ensure safe flight operations.</li>
        <li><strong>Weather Information:</strong> Get the latest weather updates for the day or the week to help plan your flights accordingly.</li>
        <li><strong>Airplane Condition:</strong> Find out about the condition of the airplane, including maintenance status and any relevant updates.</li>
      </ul>
      <p>If you have any further questions or need assistance, feel free to contact us.</p>
      <div className="contact-info">
        <h2>Contact Information</h2>
        <p><strong>Gage Black:</strong> <a href="mailto:gblack8@uncc.edu">gblack8@uncc.edu</a></p>
        <p><strong>Mohammed Elsaid:</strong> <a href="mailto:melsaid@uncc.edu">melsaid@uncc.edu</a></p>
        <p><strong>Shane Melara:</strong> <a href="mailto:smelara@uncc.edu">smelara@uncc.edu</a></p>
        <p><strong>Mohamed Abdelmoneim:</strong> <a href="mailto:mabdelmo@uncc.edu">mabdelmo@uncc.edu</a></p>
        <p><strong>Hours of Operation:</strong> Monday-Friday, 8:00 am - 5:00 pm EST</p>
      </div>
    </div>
  );
}

function AboutUsInfo() {
  return (
    <div className="about-us-info">
      <h2>About Us</h2>
      <p>Welcome to Aviation Information, your go-to resource for all things related to aviation!</p>
      <p>Our mission is to provide pilots, aviation enthusiasts, and industry professionals with accurate and up-to-date information to enhance flight safety and efficiency.</p>
      <p>At Aviation Information, we strive to:</p>
      <ul>
        <li>Deliver reliable weather forecasts to help you plan your flights.</li>
        <li>Provide weight and balance information to ensure safe and efficient aircraft operations.</li>
        <li>Offer insights into airplane conditions and maintenance updates.</li>
        <li>Empower pilots with the knowledge and resources they need for successful flights.</li>
      </ul>
      <p>Our team consists of passionate aviation experts dedicated to serving the aviation community. We are committed to delivering high-quality content and exceptional service to our users.</p>
      <p>Thank you for choosing Aviation Information. Fly safely!</p>
    </div>
  );
}

function SecondPage() {
  const [showHelp, setShowHelp] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showWeatherInputs, setShowWeatherInputs] = useState(false);
  const [showWeightBalanceInputs, setShowWeightBalanceInputs] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pilotWeight, setPilotWeight] = useState('');
  const [passengerWeights, setPassengerWeights] = useState('');
  const [baggageWeight, setBaggageWeight] = useState('');
  const [fuelWeight, setFuelWeight] = useState('');
  const [pilotArm, setPilotArm] = useState('');
  const [passengerArm, setPassengerArm] = useState('');
  const [baggageArm, setBaggageArm] = useState('');
  const [fuelArm, setFuelArm] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weightBalanceData, setWeightBalanceData] = useState(null);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
    setShowAboutUs(false); // Close About Us section when opening Help section
  };

  const toggleAboutUs = () => {
    setShowAboutUs(!showAboutUs);
    setShowHelp(false); // Close Help section when opening About Us section
  };

  const handleWeatherButtonClick = () => {
    setShowWeatherInputs(true);
    setShowWeightBalanceInputs(false);
  };

  const handleWeightBalanceButtonClick = () => {
    setShowWeightBalanceInputs((prev) => !prev);
    setShowWeatherInputs(false);
  };

  const handleGetWeather = async () => {
    try {
      if (city && state && country) {
        //const response_ = 
        const response = await axios.get(`http://127.0.0.1:5000/get_weather/${city}/${state}/${country}`);
        setWeatherData(response.data.current); // Update weatherData with the current weather data
        //fetch(`http://127.0.0.1:5000/get_weather/${city}/${state}/${country}`).then(response=>response.json()).then(data=>setWeatherData(data))

        console.log(weatherData);
      } else {
        alert("Please provide all required information.");
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleCalculateWeightBalance = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/calculate_weight_and_balance/${pilotWeight}/${passengerWeights}/${baggageWeight}/${fuelWeight}/${pilotArm}/${passengerArm}/${baggageArm}/${fuelArm}`);
      setWeightBalanceData(response.data);
    } catch (error) {
      console.error('Error fetching weight and balance data:', error);
    }
  };

  return (
    <div>
      <h2>Information for Today</h2>
      <div className="page2-content">
        <div className="page2-buttons">
          <button onClick={handleWeightBalanceButtonClick}>Weight/Balance</button>
          <button onClick={handleWeatherButtonClick}>Weather</button>
          <button onClick={toggleHelp}>Help</button>
          <button onClick={toggleAboutUs}>About Us</button>
        </div>
        {showWeatherInputs && (
          <div className="weather-inputs">
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Enter state code" />
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter country code" />
            <button onClick={handleGetWeather}>Get Weather</button>
          </div>
        )}
        {showWeightBalanceInputs && (
          <div className="weight-balance-inputs">
            <input type="text" value={pilotWeight} onChange={(e) => setPilotWeight(e.target.value)} placeholder="Enter pilot weight" />
            <input type="text" value={passengerWeights} onChange={(e) => setPassengerWeights(e.target.value)} placeholder="Enter passenger weights (comma-separated)" />
            <input type="text" value={baggageWeight} onChange={(e) => setBaggageWeight(e.target.value)} placeholder="Enter baggage weight" />
            <input type="text" value={fuelWeight} onChange={(e) => setFuelWeight(e.target.value)} placeholder="Enter fuel weight" />
            <input type="text" value={pilotArm} onChange={(e) => setPilotArm(e.target.value)} placeholder="Enter pilot arm" />
            <input type="text" value={passengerArm} onChange={(e) => setPassengerArm(e.target.value)} placeholder="Enter passenger arm" />
            <input type="text" value={baggageArm} onChange={(e) => setBaggageArm(e.target.value)} placeholder="Enter baggage arm" />
            <input type="text" value={fuelArm} onChange={(e) => setFuelArm(e.target.value)} placeholder="Enter fuel arm" />
            <button onClick={handleCalculateWeightBalance}>Calculate Weight & Balance</button>
          </div>
        )}
        {showHelp && <HelpInfo />}
        {showAboutUs && <AboutUsInfo />}
        {weatherData && (
        <div className="weather-info">
          <h3>Weather Information</h3>
          <p>Temperature: {weatherData.temp}</p>
          <p>Humidity: {weatherData.humidity}</p>
          <p>Wind Speed: {weatherData.wind_speed}</p>
          <p>Clouds: {weatherData.clouds}</p>
          <p>Dew Point: {weatherData.dew_point}</p>
          <p>Pressure: {weatherData.pressure}</p>
          <p>visibility: {weatherData.visibility}</p>
        </div>
)}
        {weightBalanceData && (
          <div className="weight-balance-info">
            <h3>Weight & Balance Information</h3>
            <p>Center of Gravity: {weightBalanceData.cg}</p>
            <p>Total Moment: {weightBalanceData.total_moment}</p>
            

          </div>
        )}
      </div>
    </div>
  );
}

export default SecondPage;
