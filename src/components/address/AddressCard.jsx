import {motion} from 'framer-motion';
import { useEffect, useState } from 'react';

const AddressCard = ({address}) => {

    const [addressDetail , setAddressDetail] = useState({});

    useEffect(() => {
        setAddressDetail(address);
    }, [address]);

    return(
        <motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className='text-xl font-semibold text-gray-100 text-center'>Address Details</h2>
            <br />
            <div className='flex flex-row justify-evenly items-center mb-6 text-center'>{addressDetail.addressText}</div>

            <div className='flex flex-row justify-evenly items-center mb-6 text-center text-xl font-semibold'>

                <div>
                    <p>Address id: </p>
                    <p>City:</p>
                    <p>State:</p>
                    <p>Country:</p>
                    <p>Pincode:</p>
                </div>
                
                <div>
                    <p>{addressDetail.id}</p>
                    <p>{addressDetail.city}</p>
                    <p>{addressDetail.state}</p>
                    <p>{addressDetail.country}</p>
                    <p>{addressDetail.pincode}</p>
                </div>

            </div>
        </motion.div>
    )
};

export default AddressCard;