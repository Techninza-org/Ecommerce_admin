import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Search, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import APIs from "../../utilities/api.jsx";

const ProductsTable = ({ data }) => {
  console.log(data, "i");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    // console.log("myData: ", data);
    setFilteredProducts(data);
  }, [data]);

  console.log(filteredProducts, "filtered products1");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, startDate, endDate);
  };

  const filterProducts = (term, start, end) => {
    const filtered = data.filter((product) => {
      const isInDateRange =
        !start ||
        !end ||
        (new Date(product.date) >= new Date(start) &&
          new Date(product.date) <= new Date(end));
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      return isInDateRange && matchesSearch;
    });
    setFilteredProducts(filtered);
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    filterProducts(searchTerm, start, end);
  };

  // Function to handle the Trash2 button click
  const handleToggle = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Token: ", token);

      if (!token) { throw new Error("No API token found in local storage."); }

      // API call to toggle the product's active status
      const response = await axios.put(
        "http://45.198.14.69:3000/api/seller/toggleIsActiveByProductId",
        { productId: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      // You can update filteredProducts to reflect the change if needed
      setFilteredProducts((prevProducts) => prevProducts.map((product) => product.id === productId ? { ...product, isActive: !product.isActive } : product ));

    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const handleDelete = async (productId) => {
    const isConfirmed =
      window.confirm("Are you sure you want to delete this product?") ||
      alert("Product deletion cancelled.");
    if (!isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token: ", token);

      if (!token) {
        throw new Error("No API token found in local storage.");
      }
      const response = await axios.delete(
        `http://45.198.14.69/api/seller/deleteProductById/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        alert(
          `${response.data.message} | Product ID: ${response.data.deletedProduct.id}`
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      } else {
        alert(`${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100"> Total Products: {filterProducts.length} </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-700">

          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"> Name </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> ProductId </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Category </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Price </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> SimpleProduct </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Date </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Active status </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Actions </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Active/Un-Active </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img src={APIs.BASE_URL_FOR_IMAGE + product.images[0]?.imageUrl} alt="Product img" className="size-10 rounded-full" />{product.name}
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{product?.id}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{product?.category[0]?.categoryName}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">${product?.price !== null ? product.price : product.attributes[0].price}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{product?.isSimpleProduct ? "true" : "false"}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{new Date(product.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", })} </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{product?.isActive ? "Active" : "Inactive"}</td>

                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                  <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(product.id)}><Trash2 size={20} /></button>
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleToggle(product.id)}
                  >
                    {product.isActive ? (<ToggleRight size={20} color="green" />) : (<ToggleLeft size={20} color="red" />)}
                  </button>
                </td>

              </motion.tr>
            ))}
          </tbody>

        </table>

      </div>
    </motion.div>
  );
};

export default ProductsTable;
