import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import axios from "axios";
const Dashboard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  var arr = [];
  var ultimateArr = [];
  const username = "Tokeh";
  const password = "1234";

  const returnUniqueValues = (arr) => {
    return arr
      .filter((val) => val !== null)
      .filter((item, index) => arr.indexOf(item) === index);
  };

  const getFlights = async () => {
    try {
      const response = await axios.get(
        `https://opensky-network.org/api/flights/all?begin=1517227200&end=1517230800&limit=5`,
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
          setLoading(true)
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

  useEffect(() => {
    getFlights();
  }, []);


  return (
    <div className="">
      <h3 className="mt-5 text-slate-500 font-bold text-xl">
        Here is a list of all flights arriving and departing from all airports
        available at the moment. Please wait patiently while the data loads
      </h3>
      {loading ? (
        <div className="flex justify-center items-center mt-40"><ReactLoading type='spin' color='#6366f1' height={667} width={375}/></div>
      ) : (
        <ul className="flex flex-col gap-5 mx-auto mt-12 w-screen sm:w-[500px] h-full rounded-md">
          {flights.map((flight, index) => (
            <li
              className="bg-indigo-500 text-white py-2 font-medium text-lg rounded-md "
              key={index}
            >
              {flight.airport} | {flight.numberOfArrivingFlights} |{" "}
              {flight.numberOfDepartingFlights}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
