import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AttributePage = () => {
  const [key, setKey] = useState("");
  const [values, setValues] = useState([""]);
  const token = Cookies.get("token");

  const handleSetKeyValueData = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        key,
        value: values,
      };

      const response = await axios.post(
        "http://45.198.14.69/api/admin/createFieldWithValue",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Data submitted successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error.response?.data || error.message);
      alert("Failed to submit data. Please try again.");
    }
  };

  const handleValueChange = (index, newValue) => {
    const updatedValues = [...values];
    updatedValues[index] = newValue;
    setValues(updatedValues);
  };

  const handleAddValueField = () => {
    setValues([...values, ""]);
  };

  const handleRemoveValueField = (index) => {
    const updatedValues = values.filter((_, i) => i !== index);
    setValues(updatedValues);
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8 m-10">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Set Key-Value Data</h3>
      <form onSubmit={handleSetKeyValueData} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Key"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Values</label>
          {values.map((value, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                required
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Value ${index + 1}`}
              />
              {values.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveValueField(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddValueField}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add Value
          </button>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttributePage;
