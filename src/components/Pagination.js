// import React, { useEffect, useState } from "react";
// import ReactLoading from "react-loading";
// import axios from "axios";
// import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

// const ITEMS_PER_PAGE = 10;

// const Dashboard = () => {
//   const [flights, setFlights] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(true);
//   const [from, setFrom] = useState("12:00");
//   const [to, setTo] = useState("13:00");
//   const [date, setDate] = useState("2018-01-29");

//   const [begin, setBegin] = useState("1517227200");
//   const [end, setEnd] = useState("1517230800");

//   const [arr, setArr] = useState([]);
//   const [ultimateArr, setUltimateArr] = useState([]);

//   const username = "Tokeh";
//   const password = "1234";

//   // Calculate the start and end index of the current page
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;

//   useEffect(() => {
//     const fetchData = async () => {
//       const uniqueValues = (arr) =>
//         arr.filter((item, index) => arr.indexOf(item) === index);

//       const removeDuplicates = (arr, uniqueProperty) => {
//         const uniqueObj = {};

//         arr.forEach((obj) => {
//           const identifier = obj[uniqueProperty];

//           if (!uniqueObj[identifier]) {
//             uniqueObj[identifier] = obj;
//           }
//         });

//         return Object.values(uniqueObj);
//       };

//       setLoading(true);
//       const airports = uniqueValues(arr.filter((val) => val !== null));

//       setTotalPages(Math.ceil(airports.length / ITEMS_PER_PAGE));

//       const dat = airports.slice(startIndex, endIndex);
//       await Promise.all(
//         dat.map(async (airport) => {
//           let arrivingFlights = 0;
//           let departingFlights = 0;

//           try {
//             const arrivals = await axios.get(
//               `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${begin}&end=${end}`
//             );

//             arrivingFlights = arrivals?.data?.length || 0;
//           } catch (error) {
//             if (error?.response?.status === 404 || error?.response?.status === 503) {
//               arrivingFlights = 0;
//             }
//           }

//           try {
//             const departures = await axios.get(
//               `https://opensky-network.org/api/flights/departure?airport=${airport}&begin=${begin}&end=${end}`
//             );

//             departingFlights = departures?.data?.length || 0;
//           } catch (error) {
//             if (error?.response?.status === 404 || error?.response?.status === 503) {
//               departingFlights = 0;
//             }
//           }

//           setUltimateArr((prev) => [...prev, { airport, numberOfArrivingFlights: arrivingFlights, numberOfDepartingFlights: departingFlights }]);
//         })
//       );
//       setLoading(false);
//       setFlights(removeDuplicates(ultimateArr, "airport"));
//     };
//     fetchData();
//   }, [currentPage, arr, begin, end, ultimateArr]);

// //   const convertFromValue = (e) => {
// //     setFrom(e.target.value);
// //     const d = `${date}T
