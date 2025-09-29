import React from "react";

export default function GeneralInfo() {
  const busData = [
    { 
      driver: "Ilayaraja",
      number: "BUS101", 
      route: "Sambankulam",
      bus: "TN76AX0625",
      phone: "9442493123",
      experience: "10 years",
      timing: "7:50 AM - 9:30 AM  and 3:30 PM - 5:20 PM",
    },
    { 
      driver: "Peter",
      number: "BUS102", 
      route: "Pavoorchatram",
      bus: "TN76AV6831",
      phone: "8110081516",
      experience: "6 years",
      timing: "7:50 AM - 9:30 AM  and 3:30 PM - 5:20 PM",
    },
    { 
      driver: "",
      number: "BUS103", 
      route: "Alangulam",
      bus: "TN76AW6491",
      phone: "",
      experience: " years",
      timing: "7:50 AM - 9:30 AM  and 3:30 PM - 5:20 PM",
    },
    { 
      driver: "Arun",
      number: "BUS104", 
      route: "Singampatti",
      bus: "TN76AY1953",
      phone: "7094579008",
      experience: "5 years",
      timing: "7:50 AM - 9:30 AM  and 3:30 PM - 5:20 PM",
    },
    { 
      driver: "Ganesan",
      number: "BUS105", 
      route: "Kallidaikurichi",
      bus: "TN72DY8971",
      phone: "9715665348",
      experience: "12 years",
      timing: "7:50 AM - 9:30 AM  and 3:30 PM - 5:20 PM",
    },
    { 
      driver: "Selva Kumar",
      number: "BUS106", 
      route: "V.K Puram",
      bus: "TN76T8830",
      phone: "7600488239",
      experience: "2 years",
      timing: "7:50 AM - 9:30 AM  and 3:30 PM - 5:20 PM",
    },
    { 
      driver: "Sankara Narayanan",
      number: "BUS107", 
      route: "Chettimedu, V.K Puram",
      bus: "TN76AW6481",
      phone: "8883997586",
      experience: "4 years",
      timing: "7:50 AM - 9:30 AM  and 3:30 PM - 5:20 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        🚌 College Bus & Driver Information
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📋 Bus Details
        </h2>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border border-gray-300 p-2 text-left">Bus Number</th>
              <th className="border border-gray-300 p-2 text-left">Route Name</th>
              <th className="border border-gray-300 p-2 text-left">Driver Name</th>
              <th className="border border-gray-300 p-2 text-left">Phone Number</th>
              <th className="border border-gray-300 p-2 text-left">Experience</th>
              <th className="border border-gray-300 p-2 text-left">Timings</th>
            </tr>
          </thead>
          <tbody>
            {busData.map((bus, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{bus.number}</td>
                <td className="border border-gray-300 p-2">{bus.route}</td>
                <td className="border border-gray-300 p-2">{bus.driver}</td>
                <td className="border border-gray-300 p-2">{bus.phone}</td>
                <td className="border border-gray-300 p-2">{bus.experience}</td>
                <td className="border border-gray-300 p-2">{bus.timing}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-6 text-gray-600 text-center">
          All timings and driver details are static for now. Updates will be available from the administration.
        </p>
      </div>
    </div>
  );
}
