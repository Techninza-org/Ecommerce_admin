import { animate, motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import Cookies from "js-cookie";
import ActiveCoupons from "../components/couponTable";

const LegalData = () => {
  const [aboutUs, setAboutUs] = useState(""); // Coupon code input
  const [contactUs, setContactUs] = useState(""); // Coupon name input
  const [privacyPolicy, setPrivacyPolicy] = useState(""); // Coupon description input
  const [refundPolicy, setRefundPolicy] = useState(""); // Coupon description input
  const [termsAndConditions, setTermsAndConditions] = useState(""); // Coupon description input

  const token = Cookies.get("token");

  // Handle coupon submission
  const handleCouponSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        privacyPolicy: privacyPolicy,
        termsAndConditions: termsAndConditions,
        refundPolicy: refundPolicy,
        contactUs: contactUs,
        aboutUs: aboutUs
      };

      const response = await axios.post(
        // "http://45.198.14.69:3000/api/admin/generateCoupon",
        "http://45.198.14.69/api/admin/setLegalData",
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
      console.error("Error generating coupon:", error.response?.data || error.message);
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
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Legal Data</h3>
          <form onSubmit={handleCouponSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">About Us</label>
              <input
                type="text"
                value={aboutUs}
                onChange={(e) => setAboutUs(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Contact Us</label>
              <input
                type="text"
                value={contactUs}
                onChange={(e) => setContactUs(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Privacy Policy</label>
              <textarea
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon description"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Refund Policy</label>
              <input
                type="text"
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon value"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Type</label>
              <select
                value={isPercentage ? "percentage" : "flat"}
                onChange={(e) => setIsPercentage(e.target.value === "percentage")}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="flat">Flat</option>
                <option value="percentage">Percentage</option>
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Terms and Conditions</label>
              <input
                type="text"
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter expiry in days"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Set Legal Data
              </button>
            </div>

          </form>
        </motion.div>
      </main>

      <ActiveCoupons />
    </div>
  );
};

export default LegalData;