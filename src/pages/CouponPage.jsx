import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import Header from "../components/common/Header";

import ActiveCoupons from "../components/couponTable";

const CouponPage = () => {
  const [couponCode, setCouponCode] = useState(""); // Coupon code input
  const [name, setName] = useState(""); // Coupon name input
  const [desc, setDesc] = useState(""); // Coupon description input
  const [couponValue, setCouponValue] = useState(""); // Coupon value input
  const [isPercentage, setIsPercentage] = useState(true); // Whether the value is percentage
  const [couponExpiryInDays, setCouponExpiryInDays] = useState(""); // Expiry duration input

  // Handle coupon submission
  const handleCouponSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const requestBody = {
        couponCode,
        name,
        desc,
        couponValue: parseFloat(couponValue), // Convert to number
        isPercentage,
        couponExpiryInDays: parseInt(couponExpiryInDays, 10), // Convert to number
      };
      
      const response = await axios.post(
        "http://45.198.14.69:3000/api/admin/generateCoupon",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Coupon generated successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error(
        "Error generating coupon:",
        error.response?.data || error.message
      );
      alert("Failed to generate coupon. Please try again.");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Generate Coupon" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Generate New Coupon
          </h3>
          <form onSubmit={handleCouponSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Coupon Code
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Coupon Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon description"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Coupon Value
              </label>
              <input
                type="number"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Type
              </label>
              <select
                value={isPercentage ? "percentage" : "flat"}
                onChange={(e) =>
                  setIsPercentage(e.target.value === "percentage")
                }
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="flat">Flat</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Expiry (in days)
              </label>
              <input
                type="number"
                value={couponExpiryInDays}
                onChange={(e) => setCouponExpiryInDays(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter expiry in days"
              />
            </div>
            <div>
              <button
                style={{ backgroundColor: "green" }}
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Generate Coupon
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <ActiveCoupons />
    </div>
  );
};

export default CouponPage;
