import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";

const PostProductsPage = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    attributesJson: [{ price: "", fields: [{ name: "", value: "" }] }],
    categoryIds: [],
    // imagesUrls: ["https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png", "https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
    imagesUrls: [],
    tags: [],
  });

  const token = localStorage.getItem("token");

  const [gstOptions, setGstOptions] = useState([]);
  const [customGst, setCustomGst] = useState("");

  const handleAddGstOption = () => {
    if (customGst.trim() !== "" && !gstOptions.includes(customGst.trim())) {
      setGstOptions([...gstOptions, customGst.trim()]);
      setCustomGst("");
    }
  };

  const [showSellingPrice, setShowSellingPrice] = useState(false);
  const [sellingPrice, setSellingPrice] = useState("");

  const handleSellingPriceToggle = (value) => {
    setShowSellingPrice(value === "yes");
    if (value !== "yes") setSellingPrice(""); // Reset selling price if toggled off
  };

  const [categories, setCategories] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    "LATEST",
    "PREMIUM",
    "SALE",
    "FRIDAY SALE",
  ]);

  useEffect(() => {
    // Fetch categories and tags from the server
    const fetchData = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");
        console.log("Token: ", token);

        if (!token) {
          throw new Error("No API token found in local storage.");
        }
        const categoriesResponse = await axios.get(
          "http://45.198.14.69:3000/api/seller/getAllCategories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // const tagsResponse = await axios.get("http://45.198.14.69:3000/api/seller/tags", {
        // 	headers: { Authorization: `Bearer ${token}` },
        // });

        const fieldsResponse = await axios.get(
          "http://45.198.14.69/api/admin/getFields",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCategories(categoriesResponse.data.categories);
        setAvailableFields(fieldsResponse.data.fields);

        console.log("category: ", categoriesResponse.data.categories);
        console.log("fields: ", fieldsResponse.data.fields);
        // setAvailableTags(tagsResponse.data);
      } catch (error) {
        console.error("Error fetching categories or tags:", error);
      }
    };

    fetchData();
  }, [token]);

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

    console.log("Form Data 1:", formData);

    if (formData.categoryIds.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    if (formData.imagesUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    if (
      formData.attributesJson.some(
        (attribute) =>
          attribute.fields.some(
            (field) => field.name === "" || field.value === ""
          ) || attribute.price === ""
      )
    ) {
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
      console.error(
        "Error submitting product:",
        error.response?.data || error.message
      );
      alert(`${error.response?.data?.message || error.message}`);
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await axios.post(
        "http://45.198.14.69:3000/api/seller/uploadImages",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const uploadedImageUrls = response.data.imagesPaths.map(
        (image) => image.imageUrl
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        imagesUrls: [...prevFormData.imagesUrls, ...uploadedImageUrls],
      }));

      console.log("Images uploaded successfully:", response.data.imagesPaths);
    } catch (error) {
      console.error(
        "Error uploading images:",
        error.response?.data || error.message
      );
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
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Add New Product
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Product Name
              </label>
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
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
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
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Categories
              </label>
              <select
                multiple
                value={formData.categoryIds}
                onChange={(e) => {
                  const selectedCategories = Array.from(
                    e.target.selectedOptions,
                    (option) => parseInt(option.value, 10)
                  );
                  setFormData({ ...formData, categoryIds: selectedCategories });
                }}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => {
                  console.log("category Datata12345: ", category);
                  return (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  );
                })}
              </select>
              <p className="text-sm text-gray-400 mt-2">
                Hold Ctrl (Windows) or Command (Mac) to select multiple
                categories.
              </p>
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
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Tags
              </label>
              <select
                multiple
                value={formData.tags}
                onChange={(e) => {
                  const selectedTags = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
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
              <p className="text-sm text-gray-400 mt-2">
                Hold Ctrl (Windows) or Command (Mac) to select multiple tags.
              </p>
            </div>

            {/* {formData.attributesJson.map((attribute, index) => (
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
						))} */}

            {/* <button type="button" onClick={handleAddAttribute} className="text-blue-500 text-sm">+ Add Attribute Group</button> */}

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm text-gray-200 mb-2">GST</label>
                <select
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const selectedGst = e.target.value;
                    // Update the state or handle the selected GST value
                  }}
                >
                  <option value="">Select GST</option>
                  {gstOptions.map((gst, index) => (
                    <option key={index} value={gst}>
                      {gst}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="block text-sm text-gray-200 mb-2">
                  Add Custom GST
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={customGst}
                    onChange={(e) => setCustomGst(e.target.value)}
                    placeholder="Enter GST"
                    className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddGstOption}
                    className="ml-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* price */}
            <div className="flex space-x-4 mb-2">
              <label className="w-full block text-sm text-gray-200">
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* selling price */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Selling Price
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center text-gray-200">
                  <input
                    type="radio"
                    name="sellingPriceToggle"
                    value="yes"
                    onChange={(e) => handleSellingPriceToggle(e.target.value)}
                    checked={showSellingPrice}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">On</span>
                </label>
                <label className="flex items-center text-gray-200">
                  <input
                    type="radio"
                    name="sellingPriceToggle"
                    value="no"
                    onChange={(e) => handleSellingPriceToggle(e.target.value)}
                    checked={!showSellingPrice}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Off</span>
                </label>
              </div>
              {showSellingPrice && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Enter Selling Price
                  </label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter selling price"
                  />
                </div>
              )}
            </div>

            {/* gst option */}

            {/* Attributes */}

            {formData.attributesJson.map((attribute, index) => (
              <div key={index}>
                <h4 className="text-sm text-gray-300 mb-2">
                  Attributes Group {index + 1}
                </h4>
                <div className="mb-2">
                  <label className="block text-sm text-gray-200">Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={attribute.price}
                    onChange={(e) => {
                      const updatedAttributes = [...formData.attributesJson];
                      updatedAttributes[index].price = parseFloat(
                        e.target.value
                      );
                      setFormData({
                        ...formData,
                        attributesJson: updatedAttributes,
                      });
                    }}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {attribute.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="flex space-x-4 mb-2">
                    {/* Field Key */}
                    <select
                      value={field.name}
                      onChange={(e) =>
                        handleNestedChange(
                          index,
                          fieldIndex,
                          "name",
                          e.target.value
                        )
                      }
                      className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Field Key</option>
                      {availableFields.map(({ keyName }) => (
                        <option key={keyName} value={keyName}>
                          {keyName}
                        </option>
                      ))}
                    </select>

                    {/* Field Value */}
                    <select
                      value={field.value}
                      onChange={(e) =>
                        handleNestedChange(
                          index,
                          fieldIndex,
                          "value",
                          e.target.value
                        )
                      }
                      className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Field Value</option>
                      {availableFields
                        .find(({ keyName }) => keyName === field.name)
                        ?.fieldValues.map(({ valueName }) => (
                          <option key={valueName} value={valueName}>
                            {valueName}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddField(index)}
                  className="text-blue-500 text-sm"
                >
                  + Add Field
                </button>
              </div>
            ))}

            {/* Add Attribute */}
            <button
              type="button"
              onClick={handleAddAttribute}
              className="text-blue-500 text-sm"
            >
              + Add Attribute Group
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Upload Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {" "}
                Submit{" "}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default PostProductsPage;
