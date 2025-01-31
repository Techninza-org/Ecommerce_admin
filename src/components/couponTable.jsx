import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const ActiveCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual token
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchCoupons = async () => {
      try {

        const response = await axios.get(
          'http://45.198.14.69/api/admin/getAllCoupons',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCoupons(response.data.coupons);
        console.log("Coupons:", response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch coupons.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [token]);

  if (loading) {
    return <div>Loading coupons...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const handleDelete = async (couponId) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this coupon?");
    if (!isConfirmed) { return; }

    try {
      
      const response = await axios.delete(`http://45.198.14.69/api/admin/deleteCoupon/${couponId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.status === 200) {
        alert("Coupon deleted successfully!");
        setCoupons((prev) => prev.filter((coupon) => coupon.id !== couponId));
      } else {
        alert("Failed to delete coupon. Please try again.");
      }

    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Failed to delete coupon. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ color: "green" }}> Active Coupons </h3>

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-700">

          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Coupon Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Expiry Date</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon) => (
              <motion.tr key={coupon.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ color: "black" }}>

                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{coupon.id}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{coupon.couponCode}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{coupon.couponValue}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{coupon.isPrecent ? "Percentage" : "Flat"}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{coupon.couponName || "N/A"}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{coupon.couponDesc || "N/A"}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                  <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(coupon.id)}><Trash2 size={20} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
          
        </table>

      </div>

    </div>
  );
};

export default ActiveCoupons;
