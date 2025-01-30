import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

const OverviewPage = () => {
  const [totalUsers, setTotalUsers] = useState(0); // State to store total users
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0); // State to store total sales amount
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchtotalOrders = async () => {
      try {
        const response = await fetch(
          "http://45.198.14.69:3000/api/seller/allSellerOrders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();

        // Calculate total sales amount
        const totalAmount = data.allOrders.reduce((sum, order) => {
          return (
            sum +
            order.items.reduce((itemSum, item) => {
              return itemSum + item.price * item.quantity; // Calculate price * quantity for each item
            }, 0)
          );
        }, 0);

        setTotalOrders(data.allOrders.length); // Update total orders count
        setTotalSalesAmount(data.allOrders.totalAmount); // Update total sales amount
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchtotalOrders();
  }, []);

  useEffect(() => {
    const fetchtotalProduct = async () => {
      try {
        const response = await fetch(
          "http://45.198.14.69:3000/api/admin/getAllProducts",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setTotalProduct(data.products.length); // Update total products count
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchtotalProduct();
  }, []);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(
          "http://45.198.14.69:3000/api/admin/getAllUsers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setTotalUsers(data.customers.length); // Update total users count
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Sales"
            icon={Zap}
            value={`${totalSalesAmount.toFixed(2)}`} // Display total sales amount
            color="#6366F1"
          />
          <StatCard
            name="New Users"
            icon={Users}
            value={totalUsers}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value={totalProduct}
            color="#EC4899"
          />
          <StatCard
            name="Conversion Rate"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          />
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
