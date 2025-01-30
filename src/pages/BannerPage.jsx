import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Cookies from "js-cookie";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import BannerTable from "../components/banner/BannerTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { isAuthenticated } from "../utilities/jwt";

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
        const token = localStorage.getItem("token");
        console.log("Token: ", token);

        if (!token) {
          throw new Error("No API token found in local storage.");
        }
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
            "Cache-Control": "no-cache",
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

      {/* <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8"> */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 hide-horizontal-scrollbar">
        {" "}
        {/* <br></br> */}
        <BannerTable data={banners} />
      </main>
    </div>
  );
};

export default BannerPage;
