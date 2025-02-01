import axios from "axios";
import Cookies from "js-cookie";
import Header from "../components/common/Header";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import ProductGroupTable from "../components/products/ProductGropTable";

const ProductGroupPage = () => {
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productGroupList, setProductGroupList] = useState([]);

  useEffect(() => {
    const fetchProductGroup = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:12345 ", token);

        if (!token) {
          throw new Error("No API token found in local storage.");
        }
        const response = await axios.get(
          `http://45.198.14.69/api/seller/getAllProductGroups`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          console.log("Error fetching product groups");
        }

        console.log("Product Group List: ", response.data.productGroups);
        setProductGroupList(response.data.productGroups);
      } catch (error) {
        console.error("Error fetching product groups:", error);
      }
    };

    fetchProductGroup();
  }, []);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token: ", token);

        if (!token) {
          throw new Error("No API token found in local storage.");
        }
        const response = await axios.get(
          `http://45.198.14.69:3000/api/admin/getAllProducts`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const activeProductsOnly = response.data.products.filter(
          (product) => product.isActive
        );
        // setProducts(response.data.products); // Assume API returns an array of product objects
        setProducts(activeProductsOnly); // Assume API returns an array of product objects
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      groupName: groupName,
      groupDesc: groupDesc,
      isActive: isActive,
      productIds: selectedProducts,
    };

    if (payload.productIds.length < 1) {
      alert("Please select at least one product to create a group.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token: ", token);

      if (!token) {
        throw new Error("No API token found in local storage.");
      }
      
      await axios.post(
        "http://45.198.14.69/api/seller/createProductGroup",
        payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      alert("Product group created successfully!");
    } catch (error) {
      console.error("Error creating product group:", error);
    }
  };

  // Handle product selection from dropdown
  const handleProductSelection = (productId) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
    }

    // console.log(`Selected products: ${selectedProducts}`); //values not updating immediately
  };

  useEffect(() => {
    // values updating immediately
    console.log(`Selected products: ${selectedProducts}`);
  }, [selectedProducts]);

  // Remove a product from the selected list
  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Product Group" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Add New Product Group
          </h3>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="groupName" className="text-gray-400">
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group name"
              />
            </div>
            <div>
              <label htmlFor="groupDesc" className="text-gray-400">
                Group Description
              </label>
              <input
                type="text"
                id="groupDesc"
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                // required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group description (optional)"
              />
            </div>
            <div>
              <label className="text-gray-400">Active Status</label>
              <div className="flex items-center">
                <label className="text-gray-400 flex items-center mr-4">
                  <input
                    type="radio"
                    name="isActive"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="mr-2"
                  />
                  Active
                </label>
                <label className="text-gray-400 flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="mr-2"
                  />
                  Inactive
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="productSelect" className="text-gray-400">
                Select Products
              </label>
              <select
                id="productSelect"
                onChange={(e) => handleProductSelection(Number(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}{" "}
                    {/* Replace `name` with the appropriate field */}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400">Selected Products</label>
              <div className="space-y-2 mt-2">
                {selectedProducts.length > 0 ? (
                  selectedProducts.map((productId) => {
                    const product = products.find((p) => p.id === productId);
                    return (
                      <div
                        key={productId}
                        className="flex justify-between items-center bg-gray-700 text-white rounded-lg px-4 py-2"
                      >
                        <span>{product?.name || "Unknown Product"}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400">No products selected</p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              >
                Create Product Group
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <ProductGroupTable record={productGroupList} />
    </div>
  );
};

export default ProductGroupPage;
