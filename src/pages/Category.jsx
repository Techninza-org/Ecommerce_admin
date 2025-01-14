import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import Cookies from "js-cookie";

const Category = () => {
  const [categoryName, setCategoryName] = useState(""); // For parent category input
  const [childCategoryName, setChildCategoryName] = useState(""); // For child category input
  const [categories, setCategories] = useState([]); // To store categories from the API
  const [parentId, setParentId] = useState(""); // Selected parent category ID
  const [categoryId, setCategoryId] = useState(""); // Selected category ID to delete
  const token = Cookies.get("token");
  const [categoryIcon, setCategoryIcon] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://45.198.14.69:3000/api/seller/getAllCategories", {
          // const response = await axios.get("http://localhost:3000/api/seller/getAllCategories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.categories); // Store the fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
      }
    };

    fetchCategories();
  }, [token]);

  // Handle parent category submission
  const handleParentSubmit = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData();
      formData.append("categoryName", categoryName);
      formData.append("icon", categoryIcon);
      formData.append("image", categoryImage);

      const response = await axios.post(
        "http://45.198.14.69:3000/api/admin/createCategory",
        formData,
        {
          headers: {
            // "Content-Type": "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Parent category created successfully!");
      console.log("Parent Response:", response.data);
    } catch (error) {
      console.error("Error creating parent category:", error.response?.data || error.message);
      alert("Failed to create parent category. Please try again.");
    }
  };

  // Handle child category submission
  const handleChildSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://45.198.14.69:3000/api/admin/createChildrenCategory",
        {
          childrenCategoryName: childCategoryName,
          parentId: parseInt(parentId, 10), // Ensure parentId is a number
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Child category created successfully!");
      console.log("Child Response:", response.data);
    } catch (error) {
      console.error("Error creating child category:", error.response?.data || error.message);
      alert("Failed to create child category. Please try again.");
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        // "http://localhost:3000/api/admin/deleteCategoryById",
        "http://45.198.14.69:3000/api/admin/deleteCategoryById",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            categoryId: parseInt(categoryId)
          }
        }
      );

      alert("Category deleted successfully!");
      console.log("Delete Response:", response.data);
      setCategories(categories.filter((category) => category.id !== parseInt(categoryId, 10))); // Update category list
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error.message);
      alert("Failed to delete category. Please try again.");
    }
  };
  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Manage Categories" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

        {/* Parent Category Form */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Add New Parent Category</h3>
          <form onSubmit={handleParentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2"> Category Name </label>
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
              <label className="block text-sm font-medium text-gray-200 mb-2">Upload Category Icon</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryIcon(e.target.files[0])}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Upload Category Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </motion.div>

        {/* Child Category Form */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Add New Child Category</h3>
          <form onSubmit={handleChildSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Child Category Name
              </label>
              <input
                type="text"
                value={childCategoryName}
                onChange={(e) => setChildCategoryName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter child category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Select Parent Category
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a parent category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"> Submit </button>
            </div>
          </form>
        </motion.div>

        {/* Delete Category Form */}
        <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >

          <h3 className="text-xl font-semibold text-gray-100 mb-4">Delete Category</h3>
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
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
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

export default Category;