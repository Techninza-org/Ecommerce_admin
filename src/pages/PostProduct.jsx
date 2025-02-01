import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";

const PostProductsPage = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    taxPercentage: 0,
    salePricePercent: 0,
    servingPrice: "",
    attributesJson: [{ price: "", mrp: "", quantity: "", thresholdQty: "", fields: [{ name: "", value: "" }] }],
    categoryIds: [],
    // imagesUrls: ["https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png", "https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
    imagesUrls: [],
    tags: [],
  });

  const token = localStorage.getItem("token");

  // const [gstOptions, setGstOptions] = useState([]);
  // const [customGst, setCustomGst] = useState("");

  // const handleAddGstOption = () => {
  //   if (customGst.trim() !== "" && !gstOptions.includes(customGst.trim())) {
  //     setGstOptions([...gstOptions, customGst.trim()]);
  //     setCustomGst("");
  //   }
  // };

  const [categories, setCategories] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    "LATEST",
    "PREMIUM",
    "SALE",
    "FRIDAY SALE",
  ]);

  const [availableGsts, setAvailableGsts] = useState([18, 12, 5, 28]);
  const [servingPrice, setServingPrice] = useState(0);

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

  const handleSalePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleNestedChange = (index, fieldIndex, key, value) => {
    const updatedAttributes = [...formData.attributesJson];
    updatedAttributes[index].fields[fieldIndex][key] = value;
    setFormData({ ...formData, attributesJson: updatedAttributes });
  };

  const handleAddField = (index) => {
    const updatedAttributes = [...formData.attributesJson];
    updatedAttributes[index].fields.push({ name: "", value: "" });
    setFormData({ ...formData, attributesJson: updatedAttributes });
  };

  const handleRevomeField = (index, fieldIndex) => {
    const updatedAttributes = [...formData.attributesJson];
    updatedAttributes[index].fields.splice(fieldIndex, 1);
    setFormData({ ...formData, attributesJson: updatedAttributes });
  };

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = [...formData.attributesJson];
    updatedAttributes.splice(index, 1);
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

    if (formData.salePricePercent < 0 || formData.salePricePercent > 100) {
      alert("Sale Price Percent should be between 0 and 100.");
      return;
    }

    if (formData.taxPercentage < 0 || formData.taxPercentage > 100) {
      alert("Tax Percentage should be between 0 and 100.");
      return;
    }

    if (formData.attributesJson.length === 0){
      alert("Please add at least one attribute.");
      return;
    }

    if (formData.attributesJson.some((attribute) => attribute.fields.length === 0)) {
      alert("Please add at least one field to each attribute.");
      return;
    }

    if (formData.attributesJson.some((attribute) => attribute.fields.some((field) => field.name === "" || field.value === "") || attribute.price === "" || attribute.mrp === "" || attribute.quantity === "" || attribute.thresholdQty === "" || attribute.mrp < attribute.price || attribute.thresholdQty > attribute.quantity)) {
      alert("Please fill all attribute fields and ensure MRP is greater than Price and Threshold Qty is less than Available Qty.");
      return;
    }

    try {
      const response = await axios.post(
        "http://45.198.14.69/api/seller/createAttributeProduct",
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

  const handleInputChangeOfServingPrice = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const isValidHashCodeColor = (hexCode) => {
    return /^#[0-9A-F]{6}$/i.test(hexCode);
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

            <div className="flex space-x-4 mb-4">

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Categories</label>
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

                <p className="text-sm text-gray-400 mt-2"> Hold Ctrl (Windows) or Command (Mac) to select multiple categories.</p>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Tags</label>
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

                <p className="text-sm text-gray-400 mt-2">Hold Ctrl (Windows) or Command (Mac) to select multiple tags.</p>

              </div>

            </div>


            <div className="flex space-x-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Sale Price Percent
                </label>
                <input
                  type="number"
                  name="salePricePercent"
                  value={formData.salePricePercent}
                  onChange={handleSalePriceChange}
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2"> Serving Price </label>
                <input
                  type="number"
                  name="servingPrice"
                  value={formData.servingPrice}
                  onChange={handleInputChangeOfServingPrice}
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Serving Price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">GST</label>
                <select
                  name="taxPercentage"
                  value={formData.taxPercentage}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    // setFormData({ ...formData, [name]: parseFloat(value) });
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      [name]: parseFloat(value),
                    }));
                  }}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* <option value={formData.taxPercentage}>{formData.taxPercentage === 0 ? "Select Tax Percentage" : formData.taxPercentage} %</option> */}
                  <option value={0}>Select Tax Percentage</option>
                  {availableGsts.map((gst, index) => {
                    console.log("GST: ", gst);
                    console.log("GST Index: ", index);

                    return (
                      <option key={index} value={gst}> {gst}%</option>
                      // <option key={index} value={null}> {gst}%</option>
                    )
                  })}
                </select>
              </div>

            </div>

            {/* Attributes */}


            {formData.attributesJson.map((attribute, index) => (


              <div key={index} style={{ backgroundColor: "#211e1e", padding: "10px", borderRadius: "10px", marginBottom: "10px" }}>

                <h4 className="text-sm text-gray-300 mb-2">Varient {index + 1}</h4>

                {attribute.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="flex space-x-4 mb-2" style={{ width: "30%" }}>

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
                        ?.fieldValues.map(({ valueName }) => {
                          console.log("valueName: ", valueName);
                          return (
                            <option key={valueName} value={valueName} style={{ backgroundColor: valueName }}>
                              {/* // <option key={valueName} value={valueName}> */}
                              {valueName}
                            </option>
                          )
                        })}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRevomeField(index, fieldIndex)}
                      className="text-red-500 text-sm"
                      style={{ backgroundColor: "#a81618", borderRadius: "5px", color: "white", padding: "5px", alignSelf: "center" }}
                    >
                      Remove
                    </button>

                  </div>

                ))}

                <button
                  type="button"
                  onClick={() => handleAddField(index)}
                  className="text-blue-500 text-sm"
                >
                  + Add Field
                </button>



                <div className="mb-2 flex space-x-4 items-center">

                  <div>
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

                  <div>
                    <label className="block text-sm text-gray-200">Mrp</label>
                    <input type="number" placeholder="MRP" value={attribute.mrp} onChange={(e) => {
                      const updatedAttributes = [...formData.attributesJson];
                      updatedAttributes[index].mrp = parseFloat(e.target.value);
                      setFormData({ ...formData, attributesJson: updatedAttributes });
                    }} className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 p-2" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-200">Threshold Qty</label>
                    <input type="number" placeholder="Threshold qty" value={attribute.thresholdQty} onChange={(e) => {
                      const updatedAttributes = [...formData.attributesJson];
                      updatedAttributes[index].thresholdQty = parseFloat(e.target.value);
                      setFormData({ ...formData, attributesJson: updatedAttributes });
                    }} className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 p-2" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-200">Available Qty</label>
                    <input type="number" placeholder="Available qty" value={attribute.quantity} onChange={(e) => {
                      const updatedAttributes = [...formData.attributesJson];
                      updatedAttributes[index].quantity = parseFloat(e.target.value);
                      setFormData({ ...formData, attributesJson: updatedAttributes });
                    }} className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 p-2" />
                  </div>



                </div>

                {/* remove attribute */}
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(index)}
                  className="text-red-500 text-sm"
                >
                  - Remove Varient
                </button>

              </div>
            ))}

            {/* Add Attribute */}
            <button
              type="button"
              onClick={handleAddAttribute}
              className="text-blue-500 text-sm"
            >
              + Add Varient
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
                style={{ width: "30%", backgroundColor: "green" }}
              >
                {" "}Create Product{" "}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default PostProductsPage;
