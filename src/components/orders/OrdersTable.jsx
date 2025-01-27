import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

const OrdersTable = ({ data }) => {
  console.log(data, "order table");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredOrders(data);
  }, [data]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = filteredOrders.filter(
      (order) =>
        String(order.id).includes(term) ||
        order.user.name.toLowerCase().includes(term) ||
        String(order.orderAddress.pincode).includes(term)
    );

    if (!term) {
      setFilteredOrders(data);
    } else {
      setFilteredOrders(filtered);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log("inside handleStatusChange");

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJpYXQiOjE3MzU4ODI4NzcsImV4cCI6MTczNjc0Njg3N30.TAvxUdkkYT0mnPDKF-EIuySREq3YMoctuAcnOIQwCQk";
    try {
      const response = await axios.put(
        "http://45.198.14.69:3000/api/seller/updateOrderStatus",
        { orderId, newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log("response", response.data);
      if (response.status === 200) {
        alert(`Order with orderId: ${orderId} updated to ${newStatus}`);
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleRedirectToOrderPage = (id) => {
    navigate(`/order-details/${id}`);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Order List</h2>

        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Order ID{" "}
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Payment Mode{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Amount{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Status{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Date{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Pincode{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Change Status{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Actions{" "}
              </th>
            </tr>
          </thead>

          <tbody className="divide divide-gray-700">
            {filteredOrders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  {order.id}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  {String(order.isCod)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  {order.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  ${order.totalAmount.toFixed(2)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 ">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.orderStatus === "PAYMENT_PENDING" //if constions
                        ? "bg-yellow-600 text-white-100"
                        : order.orderStatus === "PAYMENT_RECEIVED"
                        ? "bg-green-400 text-white-100"
                        : order.orderStatus === "ORDER_CONFIRMED"
                        ? "bg-blue-800 text-white-100"
                        : order.orderStatus === "ORDER_SHIPPED"
                        ? "bg-orange-300 text-white-100"
                        : order.orderStatus === "ORDER_DELIVERED"
                        ? "bg-green-800 text-white-100"
                        : order.orderStatus === "ORDER_CANCELLED"
                        ? "bg-red-400 text-white-100"
                        : order.orderStatus === "NOT_DELIVERED"
                        ? "bg-red-800 text-white-100"
                        : "bg-red-100 text-white-100" //esle condition
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                  {order.orderAddress.pincode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                  <select
                    className="bg-gray-700 text-white rounded-lg px-2 py-1 text-center"
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="" disabled selected>
                      Update Status
                    </option>
                    {/* <option value="PAYMENT_PENDING">PAYMENT_PENDING</option> */}
                    <option value="PAYMENT_PENDING">NOT_DELIVERED</option>
                    {/* <option value="PAYMENT_RECEIVED">PAYMENT_RECEIVED</option> */}
                    {/* <option value="ORDER_CONFIRMED">ORDER_CONFIRMED</option> */}
                    {/* <option value="ORDER_SHIPPED">ORDER_SHIPPED</option> */}
                    <option value="ORDER_DELIVERED">ORDER_DELIVERED</option>
                    <option value="ORDER_CANCELLED">ORDER_CANCELLED</option>
                  </select>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center hover:text-blue-300">
                  <button onClick={() => handleRedirectToOrderPage(order.id)}>
                    <Eye />
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
export default OrdersTable;
