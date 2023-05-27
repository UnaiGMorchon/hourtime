import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RealTimeClock from "./RealTimeClock";
import "../css/Buscador.scss";
import { auth } from "./Firebase";

const HorasMundo = () => {
  // Agrega una prop onSaveSearch para guardar las búsquedas
  const navigate = useNavigate();
  const [hours, setHours] = useState([]);
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [dayOfWeekName, setDayOfWeekName] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [formattedTime, setFormattedTime] = useState(""); // Variable para almacenar la hora formateada
  const [weatherCondition, setWeatherCondition] = useState(""); // Nueva variable para la condición meteorológica
  const [searchHistory, setSearchHistory] = useState([]); // Historial de búsquedas

  useEffect(() => {
    if (timeZone === "") return;
    const searchHours = async () => {
      try {
        const response = await fetch(
          `http://worldtimeapi.org/api/timezone/${timeZone}`
        );
        if (response.ok) {
          const data = await response.json();
          setHours(data);
          setLocation(data.timezone);

          console.log("data:", data);

          const dayName = getDayOfWeekName(data.day_of_week);
          setDayOfWeekName(dayName);
        } else {
          console.error("Error:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    searchHours();
    // Actualizar la fecha y hora cada 10 minutos
    const intervalId = setInterval(() => {
      const updatedTime = new Date();

      // Sumar un segundo al objeto Date
      setFormattedTime(
        updatedTime.toLocaleTimeString("en-US", {
          timeZone: timeZone,
          hour12: false,
        })
      );
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timeZone]);

  useEffect(() => {
    if (currentTime === "") return;
    console.log("currentTime:", currentTime);
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");

    const timeString = `${hours}:${minutes}:${seconds}`;
    setFormattedTime(timeString);
  }, [currentTime]);

  function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return daysOfWeek[dayOfWeek];
  }

  const api_key = "2SUUALUWUSYC86JWSJG272GDC";

  const searchTemperature = () => {
    if (searchQuery.trim() === "") {
      alert("Debes ingresar un valor en el campo de búsqueda");
      return;
    }
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQuery}?unitGroup=metric&key=${api_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPredictions(data.days);
        setLocation(data.address);
        setTimeZone(data.timezone);
        setWeatherCondition(data.currentConditions.conditions); // Guarda la condición meteorológica actual
        console.log("weatherCondition:", data.currentConditions.conditions); // Agrega este console.log
      });
  };

  /*  const saveSearch = (search) => {
    setSearchHistory((prevSearchHistory) => {
      const updatedSearchHistory = [...prevSearchHistory, search];
      console.log("updatedSearchHistory:", updatedSearchHistory);
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(updatedSearchHistory)
      );
      return updatedSearchHistory;
    });
  };

  useEffect(() => {
    // Recuperar el historial de búsqueda
    const user = auth.currentUser; // Obtener el usuario logeado
    if (user) {
      // Si hay un usuario logeado
      // Guardar la búsqueda solo si hay un usuario logeado
      saveSearch({ location: searchQuery, predictions: [] });
    }
    // Al recuperar el historial de búsqueda
    const storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
      // Si hay un historial de búsqueda
      setSearchHistory(JSON.parse(storedSearchHistory)); // Actualizar el estado de la búsqueda
    }
  }, []); // Solo se ejecuta una vez */

  const getBackgroundImage = () => {
    const condition = weatherCondition.toLowerCase(); // Convertir a minúsculas
    console.log("condition:", condition); // Agregar este console.log

    switch (condition) {
      case "fog":
        return "./img/Fog.png";
      case "ice":
        return "./img/Ice.png";
      case "rain":
        return "./img/Rain.png";
      case "snow":
        return "./img/Snow.png";
      case "thunderstorm":
        return "./img/Thunderstorm.png";
      case "squalls":
        return "./img/Squalls.png";
      case "hail":
        return "./img/Hail.png";
      case "overcast":
        return "./img/Overcast.png";
      case "partially cloudy":
        return "./img/Partially_cloudy.png";
      case "clear":
        return "./img/Clear.png";
      default:
        return "./img/fondo.png";
    }
  };
  const backgroundImage =
    weatherCondition !== ""
      ? `url(${getBackgroundImage()})`
      : "url(./img/fondo.png)";

  return (
    <div
      className={`containerbuscador`}
      style={{
        backgroundImage: backgroundImage,
      }}
    >
      {/* <h1>Horas del mundo | Predicción </h1>*/}

      <div>
        <input
          className='inputbuscador'
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Buscar ciudad o lugar'
        />
        <button
          className='inputbuscadorboton'
          onClick={() => searchTemperature()}
        >
          Buscar
        </button>
      </div>

      {predictions.slice(0, 1).map((prediction, index) => (
        <div key={index}>
          <div
            className={`iconostiempo ${
              weatherCondition === "Clear" ? "sunny" : ""
            }`}
          >
            {prediction.conditions === "Clear" ? (
              <div icon='sunny'>
                <span className='sun'></span>
              </div>
            ) : prediction.conditions === "Overcast" ||
              prediction.conditions === "cloudy" ||
              prediction.conditions.includes(
                "cloudy",
                "partically",
                "Overcast"
              ) ? (
              <div icon='cloudy'>
                <span className='cloud'></span>
                <span className='cloud'></span>
              </div>
            ) : prediction.conditions === "Snow" ? (
              <div icon='snowy'>
                <span className='snowman'></span>
              </div>
            ) : prediction.conditions === "Thunderstorm" ||
              prediction.conditions === "Rain" ||
              prediction.conditions.includes("Rain") ? (
              <div icon='stormy'>
                <span className='cloud'></span>
              </div>
            ) : (
              <div icon='default'>
                <div icon='supermoon'>
                  <span className='moon'></span>
                  <span className='meteor'></span>
                </div>
              </div>
            )}
          </div>

          <div className='date-container'>
            <span className='location'>{location.split("/")[1]}</span>
            <h2 className='date-dayname'>
              {getDayOfWeekName(new Date(prediction.datetime).getDay())}
            </h2>
            <span className='date-day'>{prediction.datetime}</span>
          </div>
          <div className='weather-container'>
            <h1 className='weather-temp'>{prediction.tempmax}ºC</h1>
          </div>
          <div className='dos_horas'>
            <div className='weather-desc1'>
              <RealTimeClock />{" "}
            </div>
            <div className='weather-desc2'>
              <h5>{location.split("/")[1]}</h5>
              <h4>{formattedTime}</h4>
            </div>
          </div>
          <div className='today-info-container'>
            <div className='today-info'>
              <div className='wind'>
                <span className='title'>Sensacion térmica</span>
                <span className='value'> {prediction.feelslike}ºC</span>
                <div className='clear'></div>
              </div>
              <div className='precipitation'>
                <span className='title'>Precipitaciones</span>
                <span className='value'> {prediction.precipprob} %</span>
                <div className='clear'></div>
              </div>
              <div className='humidity'>
                <span className='title'>Humedad</span>
                <span className='value'> {prediction.humidity} %</span>
                <div className='clear'></div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className='prediction'>
        <div className='card'>
          <div className='week-container'>
            <ul className='week-list'>
              {predictions.slice(1, 6).map((prediction, index) => (
                <li key={index} className='active'>
                  <span className='day-name'>
                    {getDayOfWeekName(new Date(prediction.datetime).getDay())}
                  </span>
                  <span className='day-temp'>{prediction.tempmax}°C</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorasMundo;

/* import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RealTimeClock from "./RealTimeClock";
import "../css/Buscador.scss";
import { auth } from "./Firebase";

const HorasMundo = () => {
  // Agrega una prop onSaveSearch para guardar las búsquedas
  const navigate = useNavigate();
  const [hours, setHours] = useState([]);
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [dayOfWeekName, setDayOfWeekName] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [formattedTime, setFormattedTime] = useState(""); // Variable para almacenar la hora formateada
  const [weatherCondition, setWeatherCondition] = useState(""); // Nueva variable para la condición meteorológica
  const [searchHistory, setSearchHistory] = useState([]); // Historial de búsquedas

  useEffect(() => {
    if (timeZone === "") return;
    const searchHours = async () => {
      try {
        const response = await fetch(
          `http://worldtimeapi.org/api/timezone/${timeZone}`
        );
        if (response.ok) {
          const data = await response.json();
          setHours(data);
          setLocation(data.timezone);

          console.log("data:", data);

          const dayName = getDayOfWeekName(data.day_of_week);
          setDayOfWeekName(dayName);
        } else {
          console.error("Error:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    searchHours();
    // Actualizar la fecha y hora cada 10 minutos
    const intervalId = setInterval(() => {
      const updatedTime = new Date();

      // Sumar un segundo al objeto Date
      setFormattedTime(
        updatedTime.toLocaleTimeString("en-US", {
          timeZone: timeZone,
          hour12: false,
        })
      );
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timeZone]);

  useEffect(() => {
    if (currentTime === "") return;
    console.log("currentTime:", currentTime);
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");

    const timeString = `${hours}:${minutes}:${seconds}`;
    setFormattedTime(timeString);
  }, [currentTime]);

  function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return daysOfWeek[dayOfWeek];
  }

  const api_key = "2SUUALUWUSYC86JWSJG272GDC";



const handleSearch = async () => {
  try {
    const response = await fetch(
      `https://api.waqi.info/feed/${searchQuery}/?token=${api_key}`
    );
    if (response.ok) {
      const data = await response.json();
      console.log("data:", data);
      if (data.status === "ok") {
        const weather = data.data.aqi;
        setWeatherCondition(weather);
      } else {
        setWeatherCondition("No disponible");
      }
      setSearchHistory((prevHistory) => [...prevHistory, searchQuery]);
      navigate("/resultados", { state: { searchQuery } });
    } else {
      console.error("Error:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const handleInputChange = (e) => {
  setSearchQuery(e.target.value);
};

const handlePredictionClick = (prediction) => {
  setSearchQuery(prediction);
  setPredictions([]);
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};

const handleLogout = () => {
  auth.signOut();
};

return (
  <div className="buscador-container">
    <h1>Horas del Mundo</h1>
    <div className="buscador">
      <input
        type="text"
        placeholder="Buscar ciudad o país..."
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Buscar</button>
      {predictions.length > 0 && (
        <ul className="predictions">
          {predictions.map((prediction, index) => (
            <li key={index} onClick={() => handlePredictionClick(prediction)}>
              {prediction}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="info-container">
      <div className="info">
        <h2>Ubicación:</h2>
        <p>{location}</p>
      </div>
      <div className="info">
        <h2>Hora actual:</h2>
        <p>{formattedTime}</p>
      </div>
      <div className="info">
        <h2>Día de la semana:</h2>
        <p>{dayOfWeekName}</p>
      </div>
      <div className="info">
        <h2>Condición meteorológica:</h2>
        <p>{weatherCondition}</p>
      </div>
    </div>
    <button className="logout-button" onClick={handleLogout}>
      Cerrar sesión
    </button>
  </div>
);
};

export default HorasMundo;


 */
