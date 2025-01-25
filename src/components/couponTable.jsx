import { useState, useEffect } from "react";
import axios from "axios";

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
          "http://45.198.14.69/api/user/getActiveCoupons",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { coupons } = response.data;
        setCoupons(coupons);
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

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Active Coupons
      </h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 rounded-lg bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Coupon Code</th>
              <th className="px-4 py-2 border">Value</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="text-center">
                <td className="px-4 py-2 border">{coupon.id}</td>
                <td className="px-4 py-2 border">{coupon.couponCode}</td>
                <td className="px-4 py-2 border">{coupon.couponValue}</td>
                <td className="px-4 py-2 border">
                  {coupon.isPrecent ? "Percentage" : "Flat"}
                </td>
                <td className="px-4 py-2 border">
                  {coupon.couponName || "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {coupon.couponDesc || "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveCoupons;
