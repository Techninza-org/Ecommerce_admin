import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ReturnedOrderProductTable = ({ data }) => {

    const [returnedProducts, setReturnedProducts] = useState([]);

    useEffect(() => {
        setReturnedProducts(data);
        console.log(data);
    }, [data]);

    const handleStatusChange = async (orderProductId, newStatus) => {

        console.log("inside handleStatusChange");

        try {
            const token = localStorage.getItem("token");
            
            const response = await axios.put(`http://45.198.14.69/api/seller/updateOrderProductStatus`,
                {
                    orderProductId: orderProductId,
                    newStatus: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("response", response.data);

            if (response.status === 200) {
                alert(`Order with orderProductId: ${orderProductId} updated to ${newStatus}`);

                // Update local state with the new status
                // setReturnedProducts((prev) => ({ ...prev, orderProductStatus: newStatus }));
            }
        } catch (error) {
            console.error("Failed to update order status");
        }
    };

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {/* <h2 className="text-xl font-semibold text-gray-100">Returned Order List</h2> */}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> order product Id</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Reason </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> status </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Payment Type </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Update status </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"> Order Id </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {returnedProducts.map((returnedProd) => (
                            <motion.tr key={returnedProd.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">{returnedProd.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">{returnedProd.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">{returnedProd.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">{returnedProd.returnedReason}</td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">{(String(returnedProd.orderProductStatus).replace(/ORDER_/g, " ")).replace(/_/g, " ")}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">{returnedProd.order.isCod ? "COD" : "PREPAID"}</td>
                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">
                                    <select
                                        className="bg-gray-700 text-white rounded-lg px-2 py-1 text-center"
                                        onChange={(e) => handleStatusChange(returnedProd.id, e.target.value)}
                                    >
                                        <option value="" disabled selected> Update Status </option>
                                        <option value="ORDER_RETURN_REQUEST_APPROVED">Approve Return</option>
                                        <option value="ORDER_RETURN_REQUEST_REJECTED">Reject Return</option>
                                        <option value="ORDER_RETURNED_SUCCESSFULLY">Returned Successfully</option>
                                    </select>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center hover:text-green-400">{returnedProd.order.id}</td>

                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </motion.div>
    );
}

export default ReturnedOrderProductTable;