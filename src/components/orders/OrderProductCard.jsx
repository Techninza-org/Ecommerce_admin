import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

const OrderProductCard = ({ currentOrderProduct }) => {
    const [orderProduct, setOrderProduct] = useState({});
    const [statusOptions] = useState(
        [
            'PAYMENT_PENDING', 
            'PAYMENT_RECEIVED', 
            'ORDER_CONFIRMED', 
            'ORDER_SHIPPED', 
            'ORDER_DELIVERED', 
            'ORDER_CANCELLED',
            'ORDER_RETURNED'
        ]
    );
    const token = Cookies.get("token");
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJpYXQiOjE3MzYyMzU4ODEsImV4cCI6MTczNzA5OTg4MX0.9Oh77VVpgDojZ9pWUlp8KkB8pFwTGftR7gjPV3B2M9E"

    useEffect(() => {
        setOrderProduct(currentOrderProduct);
    }, [currentOrderProduct]);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;

        try {
            const response = await axios.put(
                'http://45.198.14.69:3000/api/seller/updateOrderProductStatus',
                // 'http://localhost:3000/api/seller/updateOrderProductStatus',
                {
                    orderProductId: orderProduct.id,
                    newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data, 'API response');
            // Update local state with the new status
            setOrderProduct((prev) => ({ ...prev, orderProductStatus: newStatus }));
            alert('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    console.log(orderProduct, 'order product details');

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className="text-xl font-semibold text-gray-100 text-center">Order Product Details</h2>
            <br />

            <div className="flex flex-row justify-evenly mb-6 text-center text-xl font-semibold">
                <div>
                    <p>order product id:</p>
                    <p>quantity:</p>
                    <p>amount:</p>
                    <p>orderProductStatus:</p>
                    <p>selectedAttribute:</p>
                </div>

                <div>
                    <p>{orderProduct.id}</p>
                    <p>{orderProduct.quantity}</p>
                    <p>{orderProduct.amount}</p>
                    <p>{orderProduct.orderProductStatus}</p>
                    <p>{orderProduct.selectedAttributeId}</p>
                </div>
            </div>

            <div className="flex flex-row justify-evenly mb-6 text-center font-semibold">
                <label htmlFor="status" className="mr-2 text-xl">Update Status:</label>
                <select
                    id="status"
                    value={orderProduct.orderProductStatus || ''}
                    onChange={handleStatusChange}
                    className="bg-gray-700 text-white rounded-md p-2"
                >
                    <option value="" disabled>
                        Select a status
                    </option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>
        </motion.div>
    );
};

export default OrderProductCard;
