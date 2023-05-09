import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import {AiOutlineArrowLeft,AiOutlineArrowRight} from 'react-icons/ai'
import { NavLink } from "react-router-dom";

const ITEMS_PER_PAGE = 10;
const Dashboard = () => {
  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [from,setFrom] = useState('12:00')
  const [to,setTo] = useState('13:00')
  const [date, setDate] = useState("2018-01-29");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [date1,setDate1] = useState('')
  const [date2,setDate2] = useState('')

  

  const [begin, setBegin] = useState("1517227200");
  const [end, setEnd] = useState("1517230800");

  var arr = [];
  var ultimateArr = [];

  const username = "Tokeh";
  const password = "1234";


  // Calculate the start and end index of the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
 
  // Function to remove duplicate values from an array of string
  const returnUniqueValues = (arr) => {
    return arr
      .filter((item, index) => arr.indexOf(item) === index);
  };

  
  // Function that removes duplicate objects from an array of objects
  const removeDuplicates = (arr, uniqueProperty) => {
    const uniqueObj = {};

    arr.forEach(obj => {
      const identifier = obj[uniqueProperty];
      if (!uniqueObj[identifier]) {
        uniqueObj[identifier] = obj;
      }
    });
  
    return Object.values(uniqueObj);
  }
  
  // Function to convert "from" value to unix seconds and set it to "begin"
  const convertFromValue = (e) => {
    setFrom(e.target.value)
    var d = `${date}T${e.target.value}`;
    var someDate = new Date(d);
    setDate1(someDate)
    someDate = someDate.getTime();
    setBegin(Math.floor(someDate / 1000));
  };
 
  // Function to convert "to" value to unix seconds and set it to "end"
  const convertToValue = (e) => {
    setTo(e.target.value)
    var d = `${date}T${e.target.value}`;
    var someDate = new Date(d);
    setDate2(someDate)
    someDate = someDate.getTime();
    setEnd(Math.floor(someDate / 1000));
  };

  // Function to change date format from dd/mm/yyyy to yyyy-mm-dd
  const formatDate = (dateString) => {
    const dateParts = dateString.split("/");
    let year = dateParts[2];
    let month = dateParts[1];
    let day = dateParts[0];
  
    if (day.length === 1) {
      day = "0" + day;
    }
  
    if (month.length === 1) {
      month = "0" + month;
    }
  
    return `${year}-${month}-${day}`;
  }
  

  //  Function to change time fromat to CST and get "time" variable
  const changeTimeToCST = (date) =>{
    let cstTime = new Date(date).toLocaleString("es-MX", {
        timeZone: "America/Mexico_City" });
    var first = cstTime.split(' ')[0]
    var sec = cstTime.split(' ')[1]
    var convertedTime = `${formatDate(first.replace(',',''))}T${sec}`
    var someDate = new Date(convertedTime);
    var minutes = someDate.getMinutes();
    var hours = someDate.getHours();
    var a  =  hours >= 12 ? 'PM' : 'AM';
    setTime(hours + ":" + minutes + ' ' + a)
  }

  const getTimeDiffInMilliseconds = (date1,date2) =>{
    const timeDiff = date2.getTime() - date1.getTime();
    return timeDiff;
  }

  const getTimeDiffInHours = (date1, date2) => {
    const timeDiff = getTimeDiffInMilliseconds(date1, date2);
    var difference =  timeDiff / (1000 * 60 * 60); // convert milliseconds to hours
    if(difference > 2 || difference === 0){
      setLoading(false)
      setFlights([])
      setError('The difference between begin and end time shouldnt be more than 2 hours or less than 1 hour')
    }
  }

  // function to get all flights and the arriving and departing flights for each airport at a particular time
  const getFlights = async () => {
    setLoading(true)
    changeTimeToCST(`${date}T${from}`)

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
      const airports = returnUniqueValues(filtered)
      var dat = airports.slice(startIndex,endIndex)

      dat.forEach(async (airport) => {
        setLoading(true);
        let arrivingFlights, departingFlights;
        var obj = {};
        try {
          const arrivals = await axios.get(
            `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${begin}&end=${end}`
          );
          arrivingFlights = arrivals.data ? arrivals.data.length : 0;
          obj["airport"] = airport;
          obj["numberOfArrivingFlights"] = arrivingFlights;
          setLoading(true);
          try {
            const departures = await axios.get(
              `https://opensky-network.org/api/flights/departure?airport=${airport}&begin=${begin}&end=${end}`
            );
            departingFlights = departures.data ? departures.data.length : 0;
            obj["numberOfDepartingFlights"] = departingFlights;
          } catch (error) {
            setLoading(true);
            if (
              error.response.status === 404 ||
              error.response.status === 503
            ) {
              obj["airport"] = airport;
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
        setTotalPages(Math.ceil(airports.length / ITEMS_PER_PAGE))
        setFlights(removeDuplicates(ultimateArr,"airport"));
      });
    } catch (error) {}
  };

  useEffect(()=>{
      getFlights()
  },[currentPage,date,to,from])

  useEffect(()=>{
    setError('')
    if(date1 !== '' && date2 !== ''){
      getTimeDiffInHours(date1,date2)}
  },[from,to])

  return (
    <div className="flex h-[900px] bg-gray-200">
      <div class="hidden w-64 bg-indigo-500 md:block">
    <div class="p-6">
      <h2 class="text-white text-3xl font-bold">FlightsNG</h2>
    </div>
    <nav class="flex-grow">
      <ul class="p-6">
         <NavLink className='text-white text-lg font-medium underline' to='/dashboard'>Dashboard</NavLink>
      </ul>
    </nav>
  </div>
  <div class="flex-grow p-6">
    <h2 class="text-2xl font-bold mb-4">Welcome to your dashboard</h2>
    <form className="mx-6">
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-2 my-1">
              <p>Flights On:</p>
              <input
                required
                type="date"
                className="w-40 border border-black rounded-md py-1"
                value={date}
                onChange={(e) => {setDate(e.target.value)}}
              />
            </div>
            <div className="flex items-center gap-2 my-1">
              <p>From:</p>
              <input
                required
                value={from}
                className="w-40 border border-black rounded-md py-1"
                type="time"
                onChange={convertFromValue}
              />
            </div>
            <div className="flex items-center gap-2 my-1">
              <p>To:</p>
              <input
                required
                value={to}
                className="w-40 border border-black rounded-md py-1"
                type="time"
                onChange={convertToValue}
              />
            </div>
          </div>
        </form>

        <div>
          <h3 className="mt-5 text-slate-500 font-bold text-xl">
            
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
            <div>
             {error !== '' ? <p className="text-red-500 font-bold">{error}</p> :
             <div>
             <ul className="flex flex-col gap-5 mx-auto mt-12 w-screen sm:w-full h-full rounded-md">
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
            <div className="flex items-center justify-center gap-12 sm:gap-24 mx-auto mt-12 w-screen sm:w-full h-full rounded-md">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className={`${currentPage === 1 ? "text-slate-500 hover:none cursor-not-allowed" : "text-indigo-500 hover:text-indigo-300 cursor-pointer"}  flex justify-center items-center gap-2`}>
              <AiOutlineArrowLeft/>Previous
            </button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className={`${currentPage === totalPages ? "text-slate-500 hover:none cursor-not-allowed" : "text-indigo-500 hover:text-indigo-300 cursor-pointer"} flex justify-center items-center gap-2`}>
              Next <AiOutlineArrowRight/>
            </button>
          </div>
             </div>}

           
            </div>
            
          )}
        </div>
    </div>
    </div>
  );
};

export default Dashboard;
