import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import Cookies from "js-cookie";

const Sgstn = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentId, setParentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const token = Cookies.get("token");
  const [categoryIcon, setCategoryIcon] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token: ", token);

        if (!token) {
          throw new Error("No API token found in local storage.");
        }
        const response = await axios.get(
          "http://45.198.14.69:3000/api/seller/getAllCategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response?.data || error.message
        );
      }
    };

    fetchCategories();
  }, [token]);

  // Handle category submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("categoryName", categoryName);

      // Add files only for parent categories
      if (!parentId) {
        formData.append("icon", categoryIcon);
        formData.append("image", categoryImage);
      }

      const url = parentId
        ? "http://45.198.14.69:3000/api/admin/createChildrenCategory"
        : "http://45.198.14.69:3000/api/admin/createCategory";

      const data = parentId
        ? {
            childrenCategoryName: categoryName,
            parentId: parseInt(parentId, 10),
          }
        : formData;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (!parentId) {
        headers["Content-Type"] = "multipart/form-data";
      } else {
        headers["Content-Type"] = "application/json";
      }

      const response = await axios.post(url, data, { headers });
      alert(`${parentId ? "Child" : "Parent"} category created successfully!`);
      console.log("Response:", response.data);

      // Update category list
      if (!parentId) {
        setCategories((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error(
        "Error creating category:",
        error.response?.data || error.message
      );
      alert("Failed to create category. Please try again.");
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        "http://45.198.14.69:3000/api/admin/deleteCategoryById",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            categoryId: parseInt(categoryId, 10),
          },
        }
      );

      alert("Category deleted successfully!");
      console.log("Delete Response:", response.data);

      // Update category list
      setCategories(
        categories.filter(
          (category) => category.id !== parseInt(categoryId, 10)
        )
      );
    } catch (error) {
      console.error(
        "Error deleting category:",
        error.response?.data || error.message
      );
      alert("Failed to delete category. Please try again.");
    }
  };

  // Helper function to render the category names with hierarchy
  const renderCategoryName = (category, prefix = "") => {
    return category.childrenCategories?.map((child) => (
      <React.Fragment key={child.id}>
        <option value={child.id} className={`ml-${prefix.length + 4}`}>
          {`${prefix}${child.categoryName}`}
        </option>
        {/* Recursively render child categories */}
        {renderCategoryName(child, " >> ")}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Manage Categories" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Unified Category Form */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-4">SGSTN</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Address
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                City
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                State
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Country
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Pincode
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Select Parent Category (Optional)
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None (Will create a parent category)</option>
                {categories.map((category) => (
                  <>
                    <option key={category.id} value={category.id}>
                      {category.parentId === null ? "• " : ""}{" "}
                      {/* Bullet for parent categories */}
            {/* {category.categoryName}
                    </option> */}
            {/* {renderCategoryName(category, " > ")}{" "} */}
            {/* Render child categories with hierarchy */}
            {/* </> */}
            {/* ))}
              </select>
            </div> */}

            {!parentId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCategoryIcon(e.target.files[0])}
                    required
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Owner Signature
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCategoryImage(e.target.files[0])}
                    required
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

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

        {/* Delete Category Form */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Delete Category
          </h3>
          <form onSubmit={handleDeleteCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Select Category to Delete
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <>
                    <option key={category.id} value={category.id}>
                      {category.parentId === null ? "• " : ""}{" "}
                      {/* Bullet for parent categories */}
                      {category.categoryName}
                    </option>
                    {renderCategoryName(category, " > ")}{" "}
                    {/* Render child categories with hierarchy */}
                  </>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Delete Category
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Sgstn;
