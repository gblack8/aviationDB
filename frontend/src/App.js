import React, { useState } from 'react';
import './App.css';
import SecondPage from './Components/secondpage';
import logo from './logo1.jpg';
import axios from 'axios';

//const users = [
//  { username: 'user1', password: 'password1' },
//  { username: 'user2', password: 'password2' },
//];

//const adminUsername = 'admin';
//const adminPassword = 'admin123';

function TitleSlide({ toggleChat }) {
  return (
    <div className="title-slide">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <h1>Aviation Information</h1>
      <h2>Your Comprehensive Source for Flight Planning and Resources</h2>
      <div className="">
        {/* <a href="#">Airports</a>
        <a href="#">Flight Tracking</a>
        <a href="#">Safety Notices</a> */}
        {/* Add a chat button */}
        {/* <button onClick={toggleChat}>Chat</button> */}
      </div>
    </div>
  );
}



function ChatModal({ closeModal }) {
  // Add your chat interface here
  return (
    <div className="chat-modal">
      <button onClick={closeModal}>Close</button>
      {/* Chat interface */}
    </div>
  );
}

function WeatherModal({ closeModal, fetchWeatherData }) {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleWeatherButtonClick = () => {
    fetchWeatherData(city, state, 'USA');
    closeModal();
  };

  return (
    <div className="weather-modal">
      <button onClick={closeModal}>Close</button>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <button onClick={handleWeatherButtonClick}>Get Weather</button>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/login/${username}/${password}`);
      const { success } = response.data;
      if (response.status==200) {
        setIsLoggedIn(true);
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const toggleWeatherModal = () => {
    setShowWeatherModal(!showWeatherModal);
  };

  const fetchWeatherData = async (city, state_code, country_code) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_weather/${city}/${state_code}/${country_code}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchWeightBalanceData = async (flightNumber) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/weight_balance/${flightNumber}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching weight/balance data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <TitleSlide toggleChat={toggleChat} />
        {!isLoggedIn && (
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        {showChat && <ChatModal closeModal={toggleChat} />}
        {showWeatherModal && <WeatherModal closeModal={toggleWeatherModal} fetchWeatherData={fetchWeatherData} />}
      </header>
      {isLoggedIn && <SecondPage />}
    </div>
  );
}

export default App;
