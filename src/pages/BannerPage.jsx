import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Cookies from "js-cookie";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import BannerTable from "../components/banner/BannerTable";
import { useEffect, useState } from "react";
import axios from "axios";

const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const BannerPage = () => {
	const [banners, setBanners] = useState([]);
	const [formData, setFormData] = useState({
		bannerName: "",
		images: [], // Updated to handle multiple files
	});

	const token = Cookies.get("token");

	useEffect(() => {
		const getBanners = async () => {
			try {
				const response = await axios.get(
					"http://45.198.14.69:3000/api/admin/getAllBanners",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.status === 200) {
					setBanners(response.data.allBanners);
				} else {
					console.log("Error fetching banners");
				}
			} catch (error) {
				console.error("Error fetching banners: ", error);
			}
		};

		getBanners();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleFileChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			images: Array.from(e.target.files), // Convert FileList to an array
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append("bannerName", formData.bannerName);

		// Append each selected image to the FormData
		formData.images.forEach((image) => {
			data.append("images", image);
		});

		try {
			const response = await axios.post(
				"http://45.198.14.69:3000/api/admin/createBanner",
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				console.log("Banner created successfully:", response.data);
				// Optionally refresh the banner list
				setBanners((prevBanners) => [...prevBanners, response.data.banner]);
			} else {
				console.log("Error creating banner");
			}
		} catch (error) {
			console.error("Error creating banner: ", error);
		}
	};

	return (
		<div className="flex-1 relative z-10 overflow-auto">
			<Header title={"Orders"} />

			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				{/* <motion.div
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name="Total Orders" icon={ShoppingBag} value={orderStats.totalOrders} color="#6366F1" />
					<StatCard name="Pending Orders" icon={Clock} value={orderStats.pendingOrders} color="#F59E0B" />
					<StatCard name="Completed Orders" icon={CheckCircle} value={orderStats.completedOrders} color="#10B981" />
					<StatCard name="Total Revenue" icon={DollarSign} value={orderStats.totalRevenue} color="#EF4444" />
				</motion.div> */}

				{/* Form for adding a new banner */}

				{/* <motion.div
					// className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
					className="grid grid-cols-1 gap-2 mb-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				> */}

				<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-6' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
					<h2 className="text-2xl font-semibold">Add Banner</h2>

					<form onSubmit={handleSubmit} className="mb-8 space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-100">Banner Name</label>
							<input
								type="text"
								name="bannerName"
								value={formData.bannerName}
								onChange={handleInputChange}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-100">Images</label>
							<input
								type="file"
								name="images"
								onChange={handleFileChange}
								className="mt-1 block w-full"
								accept="image/*"
								multiple // Allow multiple files
								required
							/>
						</div>
						<button
							type="submit"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
						>
							Submit
						</button>
					</form>

				</motion.div>

				{/* <br></br> */}

				<BannerTable data={banners} />
			</main>
		</div>
	);
};

export default BannerPage;
