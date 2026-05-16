import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "0d770b1c8b7fe3e821051264c7ff08e4";

  const getWeather = () => {
    if (!city) return;

    setLoading(true);
    setError("");

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod !== 200) {
          setError("City not found");
          setWeather(null);
        } else {
          setWeather(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong");
        setLoading(false);
      });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Weather App</h1>

      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>Get Weather</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>{weather.name}</h2>
          <h3>{weather.main.temp}°C</h3>
          <p>{weather.weather[0].main}</p>
        </div>
      )}
    </div>
  );
}

export default App;
