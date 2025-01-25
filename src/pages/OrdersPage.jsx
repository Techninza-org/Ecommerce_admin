import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { isAuthenticated } from "../utilities/jwt";
import { useNavigate } from "react-router-dom";

const orderStats = {
  totalOrders: "1,234",
  pendingOrders: "56",
  completedOrders: "1,178",
  totalRevenue: "$98,765",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    const getOrders = async () => {
      try {
        const response = await axios.get(
          "http://45.198.14.69:3000/api/seller/allSellerOrders",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to the Authorization header
            },
          }
        );

        if (response.status !== 200) {
          console.error("Error fetching orders");
        } else {
          console.log(
            "allSellerOrder response data: ",
            response.data.allOrders
          );
          setOrders(response.data.allOrders);

          // Example debug logs for response structure
          console.log(response.data.allOrders.orderAddress?.orderId, "1");
          console.log(response.data.allOrders.orderAddress, "2");
          console.log(response.data.allOrders, "3");
          console.log(response.data, "4");

          // Optionally save some data in cookies or localStorage
          // Cookies.set("orderId", orderId);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getOrders();
  }, []);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Orders"} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Orders"
            icon={ShoppingBag}
            value={orders.length}
            color="#6366F1"
          />
          <StatCard
            name="Pending Orders"
            icon={Clock}
            value={orderStats.pendingOrders}
            color="#F59E0B"
          />
          {/* Uncomment and adjust the following as needed */}
          {/* <StatCard name='Completed Orders' icon={CheckCircle} value={orderStats.completedOrders} color='#10B981' /> */}
          {/* <StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' /> */}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* <DailyOrders /> */}
          {/* <OrderDistribution /> */}
        </div>

        <OrdersTable data={orders} />
      </main>
    </div>
  );
};

export default OrdersPage;
