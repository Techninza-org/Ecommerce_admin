import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useState } from "react";

const StackPage = () => {
  const [selectedContent, setSelectedContent] = useState("ABOUT US"); // State to track selected content
  const [formData, setFormData] = useState({
    aboutUs: "",
    termsAndConditions: "",
    privacyPolicy: "",
    refundPolicy: "",
    contactUs: "",
  });

  const token = localStorage.getItem("token");

  // Handle markdown editor changes
  const handleMarkdownChange = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      [selectedContent]: content,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payloadKey = selectedContent;
    const payload = { [payloadKey]: formData[payloadKey] }; // Map content to API payload
    console.log(payloadKey);

    try {
      const response = await axios.post(
        "http://45.198.14.69/api/admin/setLegalData",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert(`${selectedContent} content submitted successfully!`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Error submitting the form. Check the console for details.");
    }
  };

  const handleButtonClick = (label) => {
    setSelectedContent(label);
  };

  const renderEditor = () => (
    <form onSubmit={handleSubmit} className="space-y-4 mt-5">
      <div className="mb-3">
        <MarkdownEditor
          value={formData[selectedContent]}
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
  );

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
            "ABOUT US",
            "TERMS & CONDITIONS",
            "PRIVACY POLICY",
            "REFUND POLICY",
            "CONTACT US",
          ].map((label) => (
            <button
              key={label}
              onClick={() => handleButtonClick(label)}
              className={`${
                selectedContent === label
                  ? "bg-blue-600"
                  : "bg-blue-800 bg-opacity-50"
              } backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700`}
              style={{ height: "100px" }}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* Dynamic Content Section */}
        <h1 style={{ fontSize: "30px" }}>{selectedContent}</h1>
        {renderEditor()}
      </main>
    </div>
  );
};

export default StackPage;
