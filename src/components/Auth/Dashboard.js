import React, { useState } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
const Dashboard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [from,setFrom] = useState('')
  const [date, setDate] = useState("");
  const [begin, setBegin] = useState("");
  const [time, setTime] = useState("");
  const [end, setEnd] = useState("");
  var arr = [];
  var ultimateArr = [];
  const username = "Tokeh";
  const password = "1234";

  const returnUniqueValues = (arr) => {
    return arr
      .filter((val) => val !== null)
      .filter((item, index) => arr.indexOf(item) === index);
  };

  const getFlights = async (e) => {
    e.preventDefault();
    changeTimeToCST(`${date}T${from}`)
    setShowForm(false);
    try {
      const response = await axios.get(
        `https://opensky-network.org/api/flights/all?begin=${begin}&end=${end}&limit=5`,
        {
          headers: {
            Authorization: "Basic " + btoa(`${username}:${password}`),
          },
        }
      );
      response.data.forEach((element) => {
        arr.push(element.estDepartureAirport);
        arr.push(element.estArrivalAirport);
      });
      const filtered = arr.filter((val) => val !== null);
      const airports = returnUniqueValues(filtered);
      airports.forEach(async (airport) => {
        setLoading(true);
        let arrivingFlights, departingFlights;
        var obj = {};
        try {
          const arrivals = await axios.get(
            `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=1517227200&end=1517230800`
          );
          arrivingFlights = arrivals.data ? arrivals.data.length : 0;
          obj["airport"] = airport;
          obj["numberOfArrivingFlights"] = arrivingFlights;
          setLoading(true);
          try {
            const departures = await axios.get(
              `https://opensky-network.org/api/flights/departure?airport=${airport}&begin=1517227200&end=1517230800`
            );
            departingFlights = departures.data ? departures.data.length : 0;
            obj["numberOfDepartingFlights"] = departingFlights;
          } catch (error) {
            setLoading(true);
            if (
              error.response.status === 404 ||
              error.response.status === 503
            ) {
              obj["numberOfDepartingFlights"] = 0;
            }
          }
          ultimateArr.push(obj);
        } catch (error) {
          setLoading(true);
          if (error.response.status === 404 || error.response.status === 503) {
            obj["airport"] = airport;
            obj["numberOfArrivingFlights"] = 0;
          }
        }
        setLoading(false);
        setFlights(ultimateArr);
      });
    } catch (error) {}
  };

  const convertFromValue = (e) => {
    setFrom(e.target.value)
    console.log(e.target.value)
    var d = `${date}T${e.target.value}`;
    var someDate = new Date(d);
    someDate = someDate.getTime();
    setBegin(Math.floor(someDate / 1000));
  };
  const convertToValue = (e) => {
    var d = `${date}T${e.target.value}`;
    var someDate = new Date(d);
    someDate = someDate.getTime();
    setEnd(Math.floor(someDate / 1000));
  };

  const changeTimeToCST = (date) =>{
    let cstTime = new Date(date).toLocaleString("es-MX", {
        timeZone: "America/Mexico_City" });
    console.log(cstTime)
    var someDate = new Date(cstTime);
    var minutes = someDate.getMinutes();
    var hours = someDate.getHours();
    // if(minutes < 10){minutes = minutes.toString().padStart(2, '0')}
    var a  =  hours >= 12 ? 'PM' : 'AM';
    console.log(hours + ":" + minutes + ' ' + a)
    setTime(hours + ":" + minutes + ' ' + a)
  }


  return (
    <div className="">
      {showForm && (
        <form className="mx-12" onSubmit={getFlights}>
          <h3 className="mt-5 text-slate-500 font-bold text-xl">
            Please fill in the date and time interval for which you would like
            to get all arriving and departing flights in all airports available
          </h3>
          <div className="border mt-12 flex flex-col items-center py-5">
            <div className="flex items-center gap-2 my-4">
              <p>Please Input Date:</p>
              <input
                type="date"
                className="w-40 border border-black rounded-md py-1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 my-4">
              <p>From:</p>
              <input
                value={from}
                className="w-40 border border-black rounded-md py-1"
                type="time"
                onChange={convertFromValue}
              />
            </div>
            <div className="flex items-center gap-2 my-4">
              <p>To:</p>
              <input
                className="w-40 border border-black rounded-md py-1"
                type="time"
                onChange={convertToValue}
              />
            </div>
            <input
              type="submit"
              value="submit"
              className="bg-indigo-500 w-40 py-2 rounded-md text-white capitalize"
            />
          </div>
        </form>
      )}
      {!showForm && (
        <div>
          <h3 className="mt-5 text-slate-500 font-bold text-xl">
            Here is a list of all flights arriving and departing from all
            airports available at the time interval specified. Please wait
            patiently while the data loads...
          </h3>
          {loading ? (
            <div className="flex justify-center items-center mt-40">
              <ReactLoading
                type="spin"
                color="#6366f1"
                height={667}
                width={375}
              />
            </div>
          ) : (
            <ul className="flex flex-col gap-5 mx-auto mt-12 w-screen sm:w-[500px] h-full rounded-md">
              {flights.map((flight, index) => (
                <li
                  className="bg-indigo-500 text-white py-2 font-medium text-lg rounded-md "
                  key={index}
                >
                  {flight.airport} | {time} CST | {flight.numberOfArrivingFlights} |{" "}
                  {flight.numberOfDepartingFlights}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
