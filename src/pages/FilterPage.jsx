import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import FilterTable from "../components/FilterTable";

const FilterForm = () => {
  const [filterName, setFilterName] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [fields, setFields] = useState([]);
  const [selectedFieldKeys, setSelectedFieldKeys] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isRating, setIsRating] = useState(false);
  const token = Cookies.get("token");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://45.198.14.69:3000/api/seller/getAllCategories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
      }
    };

    const fetchFields = async () => {
      try {
        const response = await axios.get("http://45.198.14.69/api/admin/getFields", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFields(response.data.fields);
      } catch (error) {
        console.error("Error fetching fields:", error.response?.data || error.message);
      }
    };

    fetchCategories();
    fetchFields();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      filterName,
      categoryId: parseInt(categoryId, 10),
      fieldKeyIds: selectedFieldKeys.map((key) => parseInt(key, 10)),
      minPrice: parseFloat(minPrice),
      maxPrice: parseFloat(maxPrice),
      isRating,
    };

    try {
      const response = await axios.post("http://45.198.14.69/api/admin/createFilter", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Filter created successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error creating filter:", error.response?.data || error.message);
      alert("Failed to create filter. Please try again.");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 m-6">
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Create Filter</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Filter Name</label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter filter name"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Select Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Select Field Keys</label>
            <select
              multiple
              value={selectedFieldKeys}
              onChange={(e) =>
                setSelectedFieldKeys(Array.from(e.target.selectedOptions, (option) => option.value))
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.keyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter minimum price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter maximum price"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isRating}
              onChange={(e) => setIsRating(e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-200">Include Rating</label>
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
      </motion.div>

      {/* <motion.div className="absolute inset-0 bg-black bg-opacity-50 z-0">
        <FilterTable/>
      </motion.div> */}
    </div>
  );
};

export default FilterForm;
