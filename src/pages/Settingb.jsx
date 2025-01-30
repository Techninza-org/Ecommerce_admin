import { color, motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import { useParams } from "react-router-dom";

import google from "/google.png";

const Settingb = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentId, setParentId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categoryIcon, setCategoryIcon] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);
  const token = localStorage.getItem("token");

  const orderId = useParams().id;
  const [orderDetails, setOrderDetails] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No API token found in local storage.");
        }
        const response = await fetch(
          `http://45.198.14.69/api/admin/getGenerateInvoiceDataByOrderId/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrderDetails(data.orderDetails);
        setCompanyDetails(data.companyDetails);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderId]);

  const calculateTotalAmount = () => {
    return orderDetails?.orderProducts
      ?.reduce((total, product) => total + product.amount, 0)
      .toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("categoryName", categoryName);

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
    } catch (error) {
      console.error(
        "Error creating category:",
        error.response?.data || error.message
      );
      alert("Failed to create category. Please try again.");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Address" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-1/3">
                <motion.div
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-gray-100 mb-4">
                    Organization Address
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
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
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter category name"
                      />
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        City
                      </label>
                      <input
                        type="text"
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
                        type="pincode"
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter category name"
                      />
                    </div>

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
                            Signature
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCategoryIcon(e.target.files[0])}
                            required
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Submit
                      </button>
                      <button
                        type="submit"
                        className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </td>
              {/* invoice */}
              <td className="w-50" style={{ backgroundColor: "#f0f0f0" }}>
                <motion.div>
                  <div
                    className="container mt-5"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    <div className="card border-0">
                      <div
                        className="bg-purple text-white p-4"
                        style={{
                          backgroundColor: "#6f42c1",
                          zIndex: 10,
                          position: "relative",
                        }}
                      >
                        <table style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              <td>
                                <h3>Invoice</h3>
                                <img
                                  src=""
                                  alt="Company Logo"
                                  style={{ height: "100px" }}
                                />
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <h5>Your Company Name</h5>
                                <p>
                                  Your Business Address
                                  <br />
                                  City, Country, Postal
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Billing Info */}
                      <div
                        className="p-4 text-black"
                        style={{ zIndex: 10, position: "relative" }}
                      >
                        <table
                          className="table"
                          style={{ width: "100%", zIndex: 10 }}
                        >
                          <tbody>
                            <tr className="col-md-6">
                              <td style={{ width: "50%" }}>
                                <h6>Bill To:</h6>
                                <p>
                                  Company Name
                                  <br />
                                  Address
                                  <br />
                                  City
                                  <br />
                                  Country
                                  <br />
                                  Postal
                                </p>
                              </td>

                              <td
                                style={{
                                  textAlign: "right",
                                  position: "relative",
                                  width: "100%",
                                }}
                              >
                                <p>
                                  <strong>Invoice #: </strong>000001
                                </p>
                                <p>
                                  <strong>Date: </strong>12/31/20
                                </p>
                                <p>
                                  <strong>Invoice Due Date: </strong>12/31/20
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* Items Table */}
                        <div
                          className="p-4 text-black"
                          style={{ zIndex: 10, position: "relative" }}
                        ></div>
                        <table
                          className="table border-2 text-center"
                          style={{
                            zIndex: 10,
                            width: "100%",
                            position: "relative",
                          }}
                        >
                          <thead>
                            <tr className="text-center">
                              <th>Items</th>
                              <th>Description</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Tax</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderDetails?.orderProducts?.map(
                              (product, index) => (
                                <tr key={index}>
                                  <td>{product.productId}</td>
                                  <td>{product.description}</td>
                                  <td>{product.quantity}</td>
                                  <td>{product.amount}</td>
                                  <td>{product.couponAmount}</td>
                                  <td>{product.amount.toFixed(2)}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                        {/* Notes and Total */}
                        <div
                          className="mt-5 text-black"
                          style={{ zIndex: 10, position: "relative" }}
                        >
                          <table
                            className="table"
                            style={{
                              width: "100%",
                            }}
                          >
                            <tbody style={{ zIndex: 10 }}>
                              <tr>
                                <td></td>
                                <td
                                  style={{ textAlign: "right", width: "50%" }}
                                >
                                  <h1>Total Amount</h1>
                                  <h1>{calculateTotalAmount()}</h1>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div
                          className="text-black"
                          style={{ zIndex: 10, position: "relative" }}
                        >
                          <table
                            className="table mt-2"
                            style={{
                              width: "100%",
                            }}
                          >
                            <tbody style={{ zIndex: 10 }}>
                              <tr>
                                <td></td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    width: "100%",
                                  }}
                                >
                                  <img
                                    src={google}
                                    style={{
                                      height: "100px",
                                      position: "absolute",
                                      right: "10px",
                                    }}
                                    alt="Google Logo"
                                  />
                                  <br />
                                  <h5
                                    className="m-0"
                                    style={{ marginTop: "80px" }}
                                  >
                                    Authorized Signature
                                  </h5>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Settingb;
