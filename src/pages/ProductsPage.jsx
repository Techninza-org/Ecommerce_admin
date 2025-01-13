import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import ProductsTable from "../components/products/ProductsTable";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utilities/jwt";

const ProductsPage = () => {

	const [products, setProducts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		
		const getProducts = async () => {
			const response = await axios.get("http://45.198.14.69:3000/api/admin/getAllProducts", {
				headers: {
					Authorization: `Bearer ${Cookies.get("token")}`,
				}
			});
			console.log(response.data.products);
			
			setProducts(response.data.products);
		}

		getProducts();

		console.log("response1: ", getProducts());
	}, []);
	
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Products' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					{/* <StatCard name='Total Products' icon={Package} value={products.length} color='#6366F1' /> */}
					<button onClick={() => navigate("/post-products")} className='bg-blue-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700' style={{ height: "100px" }}> CREATE ATTRIBUTED PRODUCT </button>
					<button onClick={() => navigate("/post-simple-product")} className='bg-blue-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700' style={{ height: "100px" }}
					> CREATE SIMPLE PRODUCT </button>
				</motion.div>

				<ProductsTable data={products} />
			</main>
		</div>
	);
};
export default ProductsPage;
