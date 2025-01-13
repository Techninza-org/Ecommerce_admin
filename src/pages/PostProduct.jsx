import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import Cookies from "js-cookie";
import { isAuthenticated } from "../utilities/jwt";

const PostProductsPage = () => {
	const [formData, setFormData] = useState({
		productName: "",
		productDescription: "",
		attributesJson: [
			{ price: "", fields: [{ name: "", value: "" }] },
		],
		categoryIds: [],
		// imagesUrls: ["https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png", "https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
		imagesUrls: [],
		tags: [],
	});

	const [categories, setCategories] = useState([]);
	const [availableTags, setAvailableTags] = useState(["LATEST", "PREMIUM", "SALE", "FRIDAY SALE"]);

	const token = Cookies.get("token");

	useEffect(() => {
		// Fetch categories and tags from the server
		const fetchData = async () => {
			try {
				const categoriesResponse = await axios.get("http://45.198.14.69:3000/api/seller/getAllCategories", {
					headers: { Authorization: `Bearer ${token}` },
				});
				// const tagsResponse = await axios.get("http://45.198.14.69:3000/api/seller/tags", {
				// 	headers: { Authorization: `Bearer ${token}` },
				// });

				setCategories(categoriesResponse.data.categories);

				console.log('category: ', categoriesResponse.data.categories)
				// setAvailableTags(tagsResponse.data);
			} catch (error) {
				console.error("Error fetching categories or tags:", error);
			}
		};

		fetchData();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleNestedChange = (index, fieldIndex, key, value) => {
		const updatedAttributes = [...formData.attributesJson];
		updatedAttributes[index].fields[fieldIndex][key] = value;
		setFormData({ ...formData, attributesJson: updatedAttributes });
	};

	const handlePriceChange = (index, value) => {
		const updatedAttributes = [...formData.attributesJson];
		updatedAttributes[index].price = value;
		setFormData({ ...formData, attributesJson: updatedAttributes });
	};

	const handleAddField = (index) => {
		const updatedAttributes = [...formData.attributesJson];
		updatedAttributes[index].fields.push({ name: "", value: "" });
		setFormData({ ...formData, attributesJson: updatedAttributes });
	};

	const handleAddAttribute = () => {
		setFormData({
			...formData,
			attributesJson: [
				...formData.attributesJson,
				{ price: "", fields: [{ name: "", value: "" }] },
			],
		});
	};

	const handleCategorySelect = (categoryId) => {
		setFormData({
			...formData,
			categoryIds: formData.categoryIds.includes(categoryId)
				? formData.categoryIds.filter((id) => id !== categoryId)
				: [...formData.categoryIds, categoryId],
		});
	};

	const handleTagSelect = (tag) => {
		setFormData({
			...formData,
			tags: formData.tags.includes(tag)
				? formData.tags.filter((t) => t !== tag)
				: [...formData.tags, tag],
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.categoryIds.length === 0) {
			alert("Please select at least one category.");
			return;
		}

		if (formData.imagesUrls.length === 0) {
			alert("Please upload at least one image.");
			return
		}

		if (formData.attributesJson.some((attribute) => attribute.fields.some((field) => field.name === "" || field.value === "") || attribute.price === "")) {
			alert("Please fill all attribute fields.");
			return;
		}

		try {
			const response = await axios.post(
				"http://45.198.14.69:3000/api/seller/createAttributeProduct",
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			alert("Product submitted successfully!");
			console.log(response.data);
		} catch (error) {
			console.error("Error submitting product:", error.response?.data || error.message);
			alert(`${error.response?.data?.message || error.message}` );
		}
	};

	const handleFileChange = async (e) => {
		const files = e.target.files;
		const formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			formData.append("images", files[i]);
		}

		try {
			const response = await axios.post("http://45.198.14.69:3000/api/seller/uploadImages", formData, {
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

			console.log("Images uploaded successfully:", response.data.imagesPaths);
		} catch (error) {
			console.error("Error uploading images:", error.response?.data || error.message);
			alert("Failed to upload images. Please try again.");
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
								placeholder="Enter product name"
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
								placeholder="Enter product description"
								rows={4}
							/>
						</div>

						{/* <div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Categories</label>
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<button
										type="button"
										key={category.id}
										onClick={() => handleCategorySelect(category.id)}
										className={`px-4 py-2 rounded-lg ${formData.categoryIds.includes(category.id)
											? "bg-blue-500 text-white"
											: "bg-gray-700 text-gray-200"
											}`}
									>
										{category.categoryName}
									</button>
								))}
							</div>
						</div> */}

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Categories</label>
							<select
								multiple
								value={formData.categoryIds}
								onChange={(e) => {
									const selectedCategories = Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10));
									setFormData({ ...formData, categoryIds: selectedCategories });
								}}
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.categoryName}
									</option>
								))}
							</select>
							<p className="text-sm text-gray-400 mt-2">Hold Ctrl (Windows) or Command (Mac) to select multiple categories.</p>
						</div>



						{/* <div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Tags</label>
							<div className="flex flex-wrap gap-2">
								{availableTags.map((tag) => (
									<button
										type="button"
										key={tag}
										onClick={() => handleTagSelect(tag)}
										className={`px-4 py-2 rounded-lg ${formData.tags.includes(tag)
												? "bg-blue-500 text-white"
												: "bg-gray-700 text-gray-200"
											}`}
									>
										{tag}
									</button>
								))}
							</div>
						</div> */}

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Tags</label>
							<select
								multiple
								value={formData.tags}
								onChange={(e) => {
									const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
									setFormData({ ...formData, tags: selectedTags });
								}}
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{availableTags.map((tag) => (
									<option key={tag} value={tag}>
										{tag}
									</option>
								))}
							</select>
							<p className="text-sm text-gray-400 mt-2">Hold Ctrl (Windows) or Command (Mac) to select multiple tags.</p>
						</div>


						{formData.attributesJson.map((attribute, index) => (
							<div key={index}>
								<h4 className="text-sm text-gray-300 mb-2">Attributes Group {index + 1}</h4>
								<div className="mb-2">
									<label className="block text-sm text-gray-200">Price</label>
									<input
										type="number"
										placeholder="Price"
										value={attribute.price}
										onChange={(e) => {
											const updatedAttributes = [...formData.attributesJson];
											updatedAttributes[index].price = parseFloat(e.target.value);
											setFormData({ ...formData, attributesJson: updatedAttributes });
										}}
										className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								
								{attribute.fields.map((field, fieldIndex) => (
									<div key={fieldIndex} className="flex space-x-4 mb-2">
										<input
											type="text"
											placeholder="Field Key"
											value={field.name}
											onChange={(e) => handleNestedChange(index, fieldIndex, "name", e.target.value)}
											className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
										<input
											type="text"
											placeholder="Field Value"
											value={field.value}
											onChange={(e) => handleNestedChange(index, fieldIndex, "value", e.target.value)}
											className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								))}

								<button type="button" onClick={() => handleAddField(index)} className="text-blue-500 text-sm">+ Add Field</button>

							</div>
						))}

						<button type="button" onClick={handleAddAttribute} className="text-blue-500 text-sm">+ Add Attribute Group</button>


						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Upload Images</label>
							<input
								type="file"
								multiple
								onChange={handleFileChange}
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"> Submit </button>
						</div>

					</form>
				</motion.div>
			</main>
		</div>
	);
};

export default PostProductsPage;
