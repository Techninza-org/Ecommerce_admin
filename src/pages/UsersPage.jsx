import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { isAuthenticated } from "../utilities/jwt";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

const userStats = {
	totalUsers: 152845,
	newUsersToday: 243,
	activeUsers: 98520,
	churnRate: "2.4%",
};

const UsersPage = () => {

	const [users, setUsers] = useState([]);

	const token = Cookie.get("token");

	useEffect(() => {
		
		const getUsers = async () => {
			const response = await axios.get("http://45.198.14.69:3000/api/admin/getAllUsers", {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})

			if (response.status !== 200){
				console.log("Error fetching orders");
			}else {
				console.log("allSellerOrder respponse data: ", response.data.customers);
			}

			setUsers(response.data.customers)
		}

		getUsers()
	}, [])

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Users' icon={UsersIcon} value={users.length} color='#6366F1'/>
					<StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
					{/* <StatCard name='Active Users' icon={UserCheck} value={userStats.activeUsers.toLocaleString()} color='#F59E0B'/> */}
					{/* <StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' /> */}
				</motion.div>

				<UsersTable data={users}/>

				{/* USER CHARTS */}
				{/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div> */}
			</main>
		</div>
	);
};
export default UsersPage;
