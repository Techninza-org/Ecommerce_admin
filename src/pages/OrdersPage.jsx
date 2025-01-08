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

const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const OrdersPage = () => {

	const [orders, setOrders] = useState([]);

	const token = Cookies.get("token");
	// const serverUrl = "http://45.198.14.69:3000/api/seller/allSellerOrders"

	useEffect(() => {
		const getOrders = async () => {
			const response = await axios.get("http://45.198.14.69:3000/api/seller/allSellerOrders", {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})

			if (response.status !== 200) {
				console.log("Error fetching orders");
			}else {
				console.log("allSellerOrder respponse data: ", response.data.allOrders);
			}

			setOrders(response.data.allOrders);
		}

		getOrders();

		console.log("allSellerOrder respponse data1: ", getOrders());
	}, [])

	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Orders"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

				<motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
					<StatCard name='Total Orders' icon={ShoppingBag} value={orders.length} color='#6366F1' />
					<StatCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
					<StatCard name='Completed Orders' icon={CheckCircle} value={orderStats.completedOrders} color='#10B981' />
					<StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					{/* <DailyOrders /> */}
					{/* <OrderDistribution /> */}
				</div>

				<OrdersTable data={orders}/>

			</main>
		</div>
	);
};
export default OrdersPage;
