import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import APIs from "../utilities/api";

const PreviewProductGroup = () => {

    const [productGroupData, setProductGroupData] = useState({});
    const location = useLocation();
    const { productGroup } = location.state || {};

    useEffect(() => {
        setProductGroupData(productGroup);
    }, [productGroup]);

    console.log(productGroupData, 'product group details');

    return (
        <motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className='text-xl font-semibold text-gray-100 text-center'>Page Group Details</h2>
            <br />

            <h3 className='text-xl font-semibold text-gray-100 text-center'>Page Group id: {productGroupData.id}</h3>
            <h3 className='text-xl font-semibold text-gray-100 text-center'>Page Group name: {productGroupData.groupName}</h3>

            <div className="mt-6">
                <div className="gap-4 justify-center mt-4">
                    {productGroupData.products && productGroupData.products.length > 0 ? (
                        productGroupData.products.map((product, index) => (
                            <div style={{ display: "flex", justifyContent: "space-around"}}>
                                <div key={index} className="bg-gray-700 rounded-lg overflow-hidden mb-2 p-2">
                                    {/* <img src={ APIs.BASE_URL_FOR_IMAGE + product.images[0]} alt={`Banner Image ${index + 1}`} className="object-cover w-full h-full"/> */}
                                    <p className='text-s font-semibold text-gray-100'>Product id: {product.id}</p>
                                    <p className='text-s font-semibold text-gray-100'>Product name: {product.name}</p>
                                    <p className='text-s font-semibold text-gray-100'>Total attributes: {product.attributes.length}</p>
                                    <p className='text-s font-semibold text-gray-100'>Total Images: {product.images.length}</p>
                                    <p className='text-s font-semibold text-gray-100'>Active status: {product.isActive ? "active" : "inactive"}</p>
                                </div>
                                <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden">
                                    <img src={ APIs.BASE_URL_FOR_IMAGE + product.images[0]?.imageUrl} alt={`Banner Image ${index + 1}`} className="object-cover w-full h-full"/>
                                </div>
                            </div>

                        ))) : (<p className="text-gray-400">No Products available for this page group.</p>)}
                </div>
            </div>

        </motion.div>
    );
};

export default PreviewProductGroup;