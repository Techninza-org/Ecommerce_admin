import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ApplicationDataPage = () => {
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [applicationName, setApplicationName] = useState("");
  const token = Cookies.get("token");

  // const handleSetApplicationData = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();
  //     formData.append("razorpayKeyId", razorpayKeyId);
  //     formData.append("razorpayKeySecret", razorpayKeySecret);
  //     formData.append("currency", currency);
  //     formData.append("applicationName", applicationName);

  //     const response = await axios.post(
  //       "http://45.198.14.69/api/admin/setApplicationData",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert("Application data set successfully!");
  //     console.log("Response:", response.data);
  //   } catch (error) {
  //     console.error("Error setting application data:", error.response?.data || error.message);
  //     alert("Failed to set application data. Please try again.");
  //   }
  // };

  const handleSetApplicationData = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        razorpayKeyId,
        razorpayKeySecret,
        currency,
        applicationName,
      };

      const response = await axios.post(
        "http://45.198.14.69/api/admin/setApplicationData",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Application data set successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error setting application data:", error.response?.data || error.message);
      alert("Failed to set application data. Please try again.");
    }
  };


  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8 m-10">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Set Application Data</h3>
      <form onSubmit={handleSetApplicationData} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Razorpay Key ID</label>
          <input
            type="text"
            value={razorpayKeyId}
            onChange={(e) => setRazorpayKeyId(e.target.value)}
            required
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Razorpay Key ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Razorpay Key Secret</label>
          <input
            type="text"
            value={razorpayKeySecret}
            onChange={(e) => setRazorpayKeySecret(e.target.value)}
            required
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Razorpay Key Secret"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Application Name</label>
          <input
            type="text"
            value={applicationName}
            onChange={(e) => setApplicationName(e.target.value)}
            required
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Application Name"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationDataPage;
