import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Search, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Cookies from "js-cookie";
import APIs from "../../utilities/api.jsx";

const ProductsTable = ({ data }) => {
	console.log(data, 'i');

	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState([]);

	const token = Cookies.get("token");

	useEffect(() => {
		// console.log("myData: ", data);
		setFilteredProducts(data);
	}, [data]);

	console.log(filteredProducts, 'filtered products1');

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		filterProducts(term, startDate, endDate);
	};

	const filterProducts = (term, start, end) => {
		const filtered = data.filter((product) => {
			const isInDateRange = !start || !end ||
				(new Date(product.date) >= new Date(start) && new Date(product.date) <= new Date(end));
			const matchesSearch =
				product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
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
	const handleDelete = async (productId) => {
		try {
			// API call to toggle the product's active status
			const response = await axios.put(
				'http://45.198.14.69:3000/api/seller/toggleIsActiveByProductId',
				{ productId: productId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					}
				}
			);
			// Optionally, update the product list based on the response
			console.log(response.data);
			// You can update filteredProducts to reflect the change if needed
			setFilteredProducts((prevProducts) =>
				prevProducts.map((product) =>
					product.id === productId ? { ...product, isActive: !product.isActive } : product
				)
			);
		} catch (error) {
			console.error('Error toggling product status:', error);
		}
	};

	return (
		<motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Total Products: {filterProducts.length}</h2>

				{/* <div className="flex gap-4 items-center">

					<div className="flex items-center gap-2">
						<DatePicker
							selected={startDate}
							onChange={(date) => handleDateChange(date, endDate)}
							selectsStart
							startDate={startDate}
							endDate={endDate}
							placeholderText="Start Date"
							className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<DatePicker
							selected={endDate}
							onChange={(date) => handleDateChange(startDate, date)}
							selectsEnd
							startDate={startDate}
							endDate={endDate}
							placeholderText="End Date"
							className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="relative">
						<input
							type="text"
							placeholder="Search products..."
							className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							onChange={handleSearch}
							value={searchTerm}
						/>
						<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
					</div>

				</div> */}

			</div>

			<div className="overflow-x-auto">

				<table className="min-w-full divide-y divide-gray-700">

					<thead>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">ProductId</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Category</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Price</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">SimpleProduct</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Date</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Active status</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Actions</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Active/Un-Active</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-700">
						{filteredProducts.map((product) => (
							<motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center"> <img src={APIs.BASE_URL_FOR_IMAGE+product.images[0]?.imageUrl} alt="Product img" className="size-10 rounded-full"/> {product.name} </td>
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{product?.id}</td>
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{product?.category[0]?.categoryName}</td>
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">${product?.price !== null ? product.price : product.attributes[0].price}</td>
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{product?.isSimpleProduct ? 'true' : 'false'}</td>
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{new Date(product.createdAt).toLocaleDateString('en-US', {year: 'numeric',month: '2-digit',day: '2-digit'})}</td>
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{product?.isActive ? 'true' : 'false'}</td>
								
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
									<button className="text-indigo-400 hover:text-indigo-300 mr-2"><Edit size={20} /></button>
									{/* <button className="text-red-400 hover:text-red-300" onClick={()=> handleDelete(product.id)}><Trash2 size={20} /></button> */}
								</td>
								
								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
									<button className="text-red-400 hover:text-red-300" onClick={()=> handleDelete(product.id)}> {product.isActive ? (<ToggleRight size={20} color="green"/>) : (<ToggleLeft size={20} color="red" />)}</button>
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
