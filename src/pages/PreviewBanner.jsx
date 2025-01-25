import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import APIs from "../utilities/api";

const BannerPreview = () => {

    const [bannerData, setBannerData] = useState({});
    const location = useLocation();
    const { banner } = location.state || {};

    useEffect(() => {
        setBannerData(banner);
    }, [banner]);

    console.log(bannerData, 'banner details');
    console.log(banner, 'banner');

    return (
        <motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>

            <h2 className='text-xl font-semibold text-gray-100 text-center'>Banner Details</h2>
            <br />

            <h3 className='text-xl font-semibold text-gray-100 text-center'>Banner id: {bannerData.id}</h3>
            <h3 className='text-xl font-semibold text-gray-100 text-center'>Banner name: {bannerData.bannerName}</h3>

            <div className="mt-6">
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {bannerData.imageUrl && bannerData.imageUrl.length > 0 ? (
                        bannerData.imageUrl.map((image, index) => (
                            <div key={index} className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden">
                                <img src={APIs.BASE_URL_FOR_IMAGE + image.imageUrl} alt={`Banner Image ${index + 1}`} className="object-cover w-full h-full" />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No images available for this banner.</p>
                    )}
                </div>
            </div>

        </motion.div>
    );
};

export default BannerPreview;