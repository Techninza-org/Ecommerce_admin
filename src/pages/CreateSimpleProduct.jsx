import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import Cookies from "js-cookie";

const CreateSimpleProduct = () => {
	const [formData, setFormData] = useState({
		productName: "",
		productDescription: "",
		price: "",
		categoryIds: [],
		imagesUrls: [],
		tags: [],
	});

	const [categories, setCategories] = useState([]);
	const [availableTags, setAvailableTags] = useState(["LATEST", "PREMIUM", "SALE", "FRIDAY SALE"]);
	const [error, setError] = useState("");
	const token = Cookies.get("token");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const categoriesResponse = await axios.get("http://45.198.14.69:3000/api/seller/getAllCategories", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setCategories(categoriesResponse.data.categories);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		fetchData();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setError(""); // Clear error on input change
	};

	const handleCategorySelect = (categoryId) => {
		setFormData({
			...formData,
			categoryIds: formData.categoryIds.includes(categoryId)
				? formData.categoryIds.filter((id) => id !== categoryId)
				: [...formData.categoryIds, categoryId],
		});
		setError(""); // Clear error on category selection
	};

	const handleTagSelect = (tag) => {
		setFormData({
			...formData,
			tags: formData.tags.includes(tag)
				? formData.tags.filter((t) => t !== tag)
				: [...formData.tags, tag],
		});
	};

	const handleFileChange = async (e) => {
		const files = e.target.files;
		const uploadData = new FormData();
		for (let i = 0; i < files.length; i++) {
			uploadData.append("images", files[i]);
		}

		try {
			const response = await axios.post("http://45.198.14.69:3000/api/seller/uploadImages", uploadData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});

			const uploadedImageUrls = response.data.imagesPaths.map((image) => image.imageUrl);
			setFormData((prevFormData) => ({
				...prevFormData,
				imagesUrls: [...prevFormData.imagesUrls, ...uploadedImageUrls],
			}));
		} catch (error) {
			console.error("Error uploading images:", error.response?.data || error.message);
			alert("Failed to upload images. Please try again.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation: Ensure at least one category is selected
		if (formData.categoryIds.length === 0) {
			setError("Please select at least one category.");
            alert("Please select at least one category.");
			return;
		}

        if (formData.imagesUrls.length === 0) {
            setError("Please upload at least one image.");
            alert("Please upload at least one image.");
            return;
        }

		const transformedData = {
			productName: formData.productName,
			productDescription: formData.productDescription,
			price: parseFloat(formData.price) || 0,
			categoryIds: formData.categoryIds,
			imagesUrls: formData.imagesUrls,
			tags: formData.tags,
		};

		try {
			const response = await axios.post("http://45.198.14.69:3000/api/seller/createSimpleProduct", transformedData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			alert("Product submitted successfully!");
			console.log(response.data);
		} catch (error) {
			console.error("Error submitting product:", error.response?.data || error.message);
			alert("Failed to submit the product. Please try again.");
		}
	};

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Products" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<motion.div
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
				>
					<h3 className="text-xl font-semibold text-gray-100 mb-4">Add New Product</h3>
					{error && <div className="text-red-500 text-sm mb-4">{error}</div>}
					<form onSubmit={handleSubmit} className="space-y-4">
                        
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Product Name</label>
							<input
								type="text"
								name="productName"
								value={formData.productName}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
							<textarea
								name="productDescription"
								value={formData.productDescription}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							></textarea>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Price</label>
							<input
								type="number"
								name="price"
								value={formData.price}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* Categories */}
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Categories</label>
							<select
								multiple
								value={formData.categoryIds}
								onChange={(e) =>
									setFormData({
										...formData,
										categoryIds: Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value, 10)),
									})
								}
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
							>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.categoryName}
									</option>
								))}
							</select>
						</div>

						{/* Tags */}
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Tags</label>
							<select
								multiple
								value={formData.tags}
								onChange={(e) =>
									setFormData({
										...formData,
										tags: Array.from(e.target.selectedOptions, (opt) => opt.value),
									})
								}
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
							>
								{availableTags.map((tag) => (
									<option key={tag} value={tag}>
										{tag}
									</option>
								))}
							</select>
						</div>
						
                        {/* Image Upload */}
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Upload Images</label>
							<input type="file" multiple onChange={handleFileChange} className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"/>
						</div>

						{/* Submit Button */}
						<div>
							<button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition">Submit</button>
						</div>
					</form>
				</motion.div>
			</main>
		</div>
	);
};

export default CreateSimpleProduct;