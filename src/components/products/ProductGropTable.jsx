import axios from "axios";
import { motion } from "framer-motion";
import { Eye, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import APIs from "../../utilities/api";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";


const ProductGroupTable = ({ record }) => {
    console.log(record, 'record');

    const [productGroupList, setProductGroupList] = useState([{}]);
    const navigation = useNavigate();

    const token = Cookie.get("token");

    useEffect(() => {
        setProductGroupList(record);
        console.log(productGroupList, 'productGroupList 10');
    }, [record]);

    const handleStatusToggle = async (productId) => {
        try {
            
            const response = await axios.put(`${APIs.BASE_URL_FOR_API}api/seller/ActiveInactiveProductGroup/${productId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            console.log("response data: ", response.data);

            if (response.status === 200) {
                const updatedProductGroup = productGroupList.map((productGroup) => {
                    if (productGroup.id === productId) {
                        productGroup.isActive = !productGroup.isActive;
                    }
                    return productGroup;
                });

                setProductGroupList(updatedProductGroup);
            } else {
                console.log("Error toggling product status");
            }

        } catch (error) {
            console.log("Error toggling product status:", error);
        }
    };

    const handleProductGroupView = (productGroup) => {
        console.log("Product Group ID: ", productGroup);

        // Redirect to the product group view page by navigating to the URL
        // window.location.href = `/product-group-details/${productGroupId}`;
        navigation("/previewProductGroup", { state: { productGroup } });
    };

    const handleDelete = async (productId) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this product group?");
        if (!confirmDelete) { return; }

        try {
            const response = await axios.delete(`${APIs.BASE_URL_FOR_API}api/seller/deleteProductGroup/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const updatedProductGroup = productGroupList.filter((productGroup) => productGroup.id !== productId);
                setProductGroupList(updatedProductGroup);
            } else {
                alert(`message: ${response.data.message} | status: ${response.status}`);
                console.log("Error deleting product group");
            }
        } catch (error) {
            console.error("Error deleting product group:", error);
        }
    };


    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="overflow-x-auto">


                <h3 className="text-xl font-semibold text-gray-100 mb-4">Product Group List</h3>
                {/* Display a list of product groups here */}
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'> product id </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'> groupName </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'> groupDesc </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'> Status </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'> Total Products </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'> Change Stataus </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'> Action </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'> Preview </th>
                        </tr>
                    </thead>

                    <tbody className='divide divide-gray-700'>
                        {productGroupList.map((productGroup) => (
                            <motion.tr key={productGroup.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>{productGroup.id}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>{productGroup.groupName}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>{productGroup.groupDesc}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>{productGroup.isActive ? "Active" : "In-Active"}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>{productGroup?.products?.length || 0}</td>

                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>
                                    <button onClick={()=> handleStatusToggle(productGroup.id)}> {productGroup.isActive ? (<ToggleRight size={20} color="green"/>) : (<ToggleLeft size={20} color="red" />)}</button>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>
                                <button className="text-white-400 hover:text-red-600" onClick={() => handleDelete(productGroup.id)}> {<Trash2/>}</button>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>
                                    <button className="text-white-400 hover:text-blue-300" onClick={() => handleProductGroupView(productGroup)}> {<Eye/>}</button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
};

export default ProductGroupTable;