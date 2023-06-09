import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HorasMundo = () => {
  const navigate = useNavigate();
  const [hours, setHours] = useState([]);
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [dayOfWeekName, setDayOfWeekName] = useState("");

  useEffect(() => {
    const searchHours = async () => {
      try {
        const response = await fetch(
          `http://worldtimeapi.org/api/timezone/Europe/${timeZone}`
        );
        if (response.ok) {
          const data = await response.json();
          setHours(data);
          setLocation(data.timezone);

          // Obtener la fecha y hora de la API
          const datetime = data.datetime;
          const [date, time] = datetime.split("T");

          // Crear un objeto Date con la fecha y hora
          const initialTime = new Date(`${date} ${time}`);

          // Quitar los milisegundos
          initialTime.setMilliseconds(0);

          // Sumar un segundo al objeto Date
          initialTime.setSeconds(initialTime.getSeconds() + 1);

          setCurrentTime(initialTime);
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
      const updatedTime = new Date(currentTime);
      updatedTime.setMinutes(updatedTime.getMinutes() + 10);
      setCurrentTime(updatedTime);
    }, 600000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timeZone, currentTime]);

  function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];

    return daysOfWeek[dayOfWeek];
  }

  return (
    <div className='container'>
      <h1>Horas del mundo</h1>
      <h2>
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Buscar ciudad o lugar'
        />
        <button onClick={() => setTimeZone(searchQuery)}>Buscar</button>
      </h2>
      <h2>{location}</h2>

      <table>
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            {/*  <th>Fecha y Hora UTC</th> */}
            <th>Zona horaria</th>
            <th>Día de la semana</th>
            {/*  <th>Día del año</th>
            <th>Semana del año</th> */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{currentTime.toLocaleString()}</td>
            {/*  <td>{hours.utc_datetime}</td> */}
            <td>{hours.timezone}</td>
            <td>{dayOfWeekName}</td>
            {/*   <td>{hours.day_of_year}</td>
            <td>{hours.week_number}</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HorasMundo;
