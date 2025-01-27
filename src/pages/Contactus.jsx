import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useState, useEffect } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    description: "", // Stores markdown content
  });
  const [selectedButton, setSelectedButton] = useState(""); // State to track selected button
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("Token is not set");
    }
  }, [token]);

  // Handle markdown editor changes
  const handleMarkdownChange = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      description: content,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the API request to submit the description
      const response = await axios.post(
        "http://45.198.14.69/api/admin/setLegalData",
        {
          contactUs: formData.description, // Map to privacyPolicy
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Privacy Policy submitted successfully!");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the Privacy Policy:", error);
      alert("Error submitting the form. Check the console for details.");
    }
  };

  // Handle button click
  const handleButtonClick = (path) => {
    setSelectedButton(path);
    navigate(path);
  };

  return (
    <div className="flex-1 overflow-auto relative">
      <Header title="Products" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Navigation Buttons */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {[
            { path: "/StatckPage", label: "ABOUT US" },
            { path: "/term", label: "TERMS & CONDITIONS" },
            { path: "/privacy", label: "PRIVACY POLICY" },
            { path: "/refund", label: "REFUND POLICY" },
            { path: "/contact", label: "CONTACT US" },
          ].map((button) => (
            <button
              key={button.path}
              onClick={() => handleButtonClick(button.path)}
              className={`${
                selectedButton === button.path
                  ? "bg-blue-600"
                  : "bg-blue-800 bg-opacity-50"
              } backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700`}
              style={{ height: "100px" }}
            >
              {button.label}
            </button>
          ))}
        </motion.div>

        {/* About Us Section */}
        <h1 style={{ fontSize: "30px" }}>Contact US</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div className="mb-3">
            <label htmlFor="description" className="form-label"></label>
            <MarkdownEditor
              value={formData.description}
              onChange={handleMarkdownChange}
              height={400}
              className="z-10"
            />
          </div>
          <button
            type="submit"
            className="w-40 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default Contact;
