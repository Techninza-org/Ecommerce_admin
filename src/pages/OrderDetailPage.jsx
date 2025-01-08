import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion";
import AddressCard from "../components/address/AddressCard";
import OrderProductCard from "../components/orders/OrderProductCard";

const OrderPage = () => {
    const location = useLocation();
    const { order } = location.state || {};

    console.log(order, 'order details');

    if (!order) {
        return (
            <div>
                <p>data is empty</p>
            </div>
        )
    }

    return (
        <motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>

            {/* <h2 className='text-xl font-semibold text-gray-100'>Order id: {order.id}</h2>
            <h2 className='text-xl font-semibold text-gray-100'>Total products: {order.orderProducts.length}</h2>
            <h2 className='text-xl font-semibold text-gray-100'>Order Type: {order.isCod ? "COD" : "PREPAID"}</h2>
            <h2 className='text-xl font-semibold text-gray-100'>Total Order Amount: {order.totalAmount}</h2>
            <h2 className='text-xl font-semibold text-gray-100'>Order date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</h2>
            <br></br> */}

            <motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-6' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>

                <h2 className='text-xl font-semibold text-gray-100 text-center'>Order Details</h2>
                <br />
                
                <div className='flex flex-row justify-evenly items-center mb-6 text-center text-xl font-semibold'>

                    <div>
                        <p>Order id: </p>
                        <p>Total products: </p>
                        <p>Order Type: </p>
                        <p>Total Order Amount: </p>
                        <p>Order date: </p>
                    </div>

                    <div>
                        <p>{order.id}</p>
                        <p>{order.orderProducts.length}</p>
                        <p>{order.isCod ? "COD" : "PREPAID"}</p>
                        <p>{order.totalAmount}</p>
                        <p>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>

                </div>
            </motion.div>

            <div>

                <AddressCard address={order.orderAddress} />

                {order.orderProducts.map((orderProduct) => {
                    console.log(orderProduct, "order product details in map");
                    return (
                        <div style={{ marginTop: '20px' }}>
                            <OrderProductCard currentOrderProduct={orderProduct} />
                        </div>
                    );
                })}
            </div>
        </motion.div>
    )
}

export default OrderPage;