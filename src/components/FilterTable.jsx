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
import APIs from "../utilities/api";

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

const FilterTable = ({ data }) => {
  console.log("banner table test1: ", data);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBanner, setFilteredBanner] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredBanner(data);
    console.log("set filter banner: ", data);
  }, [data]);

  console.log("all banners test2: ", filteredBanner);

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
    console.log("inside handleStatusChange");

    const token = Cookies.get("token");
    try {
      const response = await axios.put(
        "http://45.198.14.69:3000/api/admin/activeUnActiveBanner",
        { bannerId: bannerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      console.log("response", response.data);

      if (response.status === 200) {
        alert(`message: ${response.data.message}, status: ${response.status}`);

        const updatedBanners = await Promise.all(
          filteredBanner.map(async (banner) => {
            if (banner.id === bannerId) {
              banner.isActive = !banner.isActive;
            }
            return banner;
          })
        );

        setFilteredBanner(updatedBanners);
      } else {
        alert(`message: ${response.data.message}, status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const handleBannerPreview = (banner) => {
    console.log("passed banner: ", banner);
    navigate("/preview-banner", { state: { banner: banner } });
  };

  const handleDeleteBanner = async (bannerId) => {
    console.log("inside handleDeleteBanner");

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!isConfirmed) {
      return;
    }

    const token = Cookies.get("token");

    try {
      const response = await axios.delete(
        "http://45.198.14.69:3000/api/admin/deleteBanner",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            bannerId: bannerId,
          },
        }
      );

      if (response.status === 200) {
        const updatedBanners = filteredBanner.filter(
          (banner) => banner.id !== bannerId
        );
        setFilteredBanner(updatedBanners);
        alert(`message: ${response.data.message}, status: ${response.status}`);
      }

      console.log(`delete banner response: ${response.data}`);
    } catch (error) {
      console.log("Error deleting banner: ", error);
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

        <div className="relative">
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
                {" "}
                Banner ID{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Banner Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Total Imges{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Active Status{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Date{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Active / In-Active{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Preview{" "}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                {" "}
                Actions{" "}
              </th>
              {/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'> Actions </th> */}
            </tr>
          </thead>

          <tbody className="divide divide-gray-700">
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
                    {" "}
                    {banner.isActive ? (
                      <ToggleRight size={24} color="green" />
                    ) : (
                      <ToggleLeft size={24} color="red" />
                    )}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-200">
                  <button onClick={() => handleBannerPreview(banner)}>
                    {" "}
                    {<Eye />}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-red-600">
                  <button onClick={() => handleDeleteBanner(banner.id)}>
                    {" "}
                    {<LucideTrash2 />}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default FilterTable;
