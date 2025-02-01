import { motion } from "framer-motion";
import Header from "../components/common/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReturnedOrderProductTable from "../components/ReturnOrderProductTable";

const ReturnedOrderProductPage = () => {

    const [returnedOrderProductPage, setReturnedOrderProductPage] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getReturnedOrderProductResponse = async () => {

            const token = localStorage.getItem("token")

            try {

                const response = await axios.get(`http://45.198.14.69/api/seller/getAllReturnedOderedProducts`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                    }
                );

                console.log(`returned product: ${response.data.returnedOrderProducts}`);

                setReturnedOrderProductPage(response.data.returnedOrderProducts)
            } catch (error) {
                console.error("Error fetching products:", error);
                if (error.response?.status === 401) {
                    console.error("Unauthorized access. Redirecting to login...");
                    navigate("/login");
                }
            }
        };

        getReturnedOrderProductResponse();
    }, [navigate]);

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Returned Order Products" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div 
                className="grid grid-cols-1 gap-5 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                >
                    <ReturnedOrderProductTable data={returnedOrderProductPage} />

                </motion.div>
            </main>

        </div>
    )
};

export default ReturnedOrderProductPage;