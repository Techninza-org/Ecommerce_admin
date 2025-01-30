import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  ToggleRight,
  ToggleLeft,
  Trash,
  Trash2Icon,
  LucideTrash2,
} from "lucide-react";
import axios from "axios";

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import APIs from "../../utilities/api";

const orderData = [
  {
    id: "ORD001",
    customer: "John Doe",
    total: 235.4,
    status: "Delivered",
    date: "2023-07-01",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    total: 412.0,
    status: "Processing",
    date: "2023-07-02",
  },
  {
    id: "ORD003",
    customer: "Bob Johnson",
    total: 162.5,
    status: "Shipped",
    date: "2023-07-03",
  },
  {
    id: "ORD004",
    customer: "Alice Brown",
    total: 750.2,
    status: "Pending",
    date: "2023-07-04",
  },
  {
    id: "ORD005",
    customer: "Charlie Wilson",
    total: 95.8,
    status: "Delivered",
    date: "2023-07-05",
  },
  {
    id: "ORD006",
    customer: "Eva Martinez",
    total: 310.75,
    status: "Processing",
    date: "2023-07-06",
  },
  {
    id: "ORD007",
    customer: "David Lee",
    total: 528.9,
    status: "Shipped",
    date: "2023-07-07",
  },
  {
    id: "ORD008",
    customer: "Grace Taylor",
    total: 189.6,
    status: "Delivered",
    date: "2023-07-08",
  },
];

const BannerTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBanner, setFilteredBanner] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({ name: "", imageUrl: "" });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bannerName: "",
    images: [], // Updated to handle multiple files
  });

  const handleInputsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFilesChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      images: Array.from(e.target.files), // Convert FileList to an array
    }));
  };

  const handlesSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("bannerName", formData.bannerName);

    // Append each selected image to the FormData
    formData.images.forEach((image) => {
      data.append("images", image);
    });

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://45.198.14.69:3000/api/admin/createBanner",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "Cache-Control": "no-cache",
          },
        }
      );

      if (response.status === 200) {
        console.log("Banner created successfully:", response.data);
        // Optionally refresh the banner list
        // setBanners((prevBanners) => [...prevBanners, response.data.banner]);
      } else {
        console.log("Error creating banner");
      }
    } catch (error) {
      console.error("Error creating banner: ", error);
    }
  };

  useEffect(() => {
    setFilteredBanner(data);
  }, [data]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orderData.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term)
    );
    setFilteredBanner(filtered);
  };

  const handleActiveUnActiveToggle = async (bannerId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://45.198.14.69:3000/api/admin/activeUnActiveBanner",
        { bannerId: bannerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedBanners = filteredBanner.map((banner) => {
          if (banner.id === bannerId) {
            banner.isActive = !banner.isActive;
          }
          return banner;
        });

        setFilteredBanner(updatedBanners);
      } else {
        alert(`message: ${response.data.message}, status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleBannerPreview = (banner) => {
    navigate("/preview-banner", { state: { banner: banner } });
  };

  const handleDeleteBanner = async (bannerId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!isConfirmed) {
      return;
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Order List</h2>

        <div className=" bg-blue-700 text-white rounded-lg px-4 py-2 absolute right-6 top-2 ">
          <button onClick={() => setIsModalOpen(true)}>ADD Banner</button>
        </div>

        <div className="relative top-8">
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Banner ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Banner Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Total Images
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Active Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Active / In-Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredBanner.map((banner) => (
              <motion.tr
                key={banner.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">
                  {banner.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  {banner.bannerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  {banner.imageUrl.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  {banner.isActive ? "true" : "false"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  {new Date(banner.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center">
                  <button onClick={() => handleActiveUnActiveToggle(banner.id)}>
                    {banner.isActive ? (
                      <ToggleRight size={24} color="green" />
                    ) : (
                      <ToggleLeft size={24} color="red" />
                    )}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-200">
                  <button onClick={() => handleBannerPreview(banner)}>
                    <Eye />
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-red-600">
                  <button
                    onClick={() => {
                      handleDeleteBanner(banner.id);
                      window.location.reload();
                    }}
                  >
                    <LucideTrash2 />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <form
          onSubmit={handlesSubmit}
          className="mb-2 space-y-4 fixed inset-0 top-40  bg-opacity-50"
        >
          <div className=" flex items-center justify-center  ">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/2 ">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Add New Banner
              </h3>

              <label className="block text-sm font-medium text-gray-100">
                Banner Name
              </label>
              <input
                type="text"
                name="bannerName"
                value={formData.bannerName}
                onChange={handleInputsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
                required
              />

              <label className="block text-sm font-medium text-gray-100">
                Images
              </label>
              <input
                type="file"
                name="images"
                onChange={handleFilesChange}
                className="mt-1 block w-full"
                accept="image/*"
                multiple // Allow multiple files
                required
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteBanner(banner.id);
                    window.location.reload();
                  }}
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
};
export default BannerTable;
