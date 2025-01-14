import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2 } from "lucide-react";

const UsersTable = ({ data }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);

	useEffect(() => {
		setFilteredUsers(data)
	}, [data]);

	console.log("all users: ", filteredUsers)

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = filteredUsers.filter((user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));

		if (!term) {
			setFilteredUsers(data);
		} else {
			setFilteredUsers(filtered);
		}

	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJpYXQiOjE3MzU4MDEyMzMsImV4cCI6MTczNjY2NTIzM30.WA0FMrgLNw7Z3xFI_oOgXxqzJdDKugyL97huh4n31DI"
				const response = await fetch(`http://45.198.14.69:3000/api/admin/deleteCategoryById`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({ categoryId: id }), // Pass the ID in the request body
				});

				if (response.ok) {
					alert("User deleted successfully");
					setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Remove the user from the list
				} else {
					const errorData = await response.json();
					alert(`Failed to delete user: ${errorData.message || "Unknown error"}`);
				}
			} catch (error) {
				console.error("Error deleting user:", error);
				alert("An error occurred while deleting the user. Please try again.");
			}
		}
	};


	return (
		<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Users</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'>Name</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'>Email</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'>Gender</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'>Created At</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center'>Actions</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredUsers.map((user) => (
							<motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>

									<div className='flex items-center'>

										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.name.charAt(0)}
											</div>
										</div>

										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-100'>{user.name}</div>
										</div>

									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>
									<div className='text-sm text-gray-300'>{user.email}</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>{user.gender}</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 text-center'>
									<span
										// className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "Active"? "bg-green-800 text-green-100": "bg-red-800 text-red-100"}`}>
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${"bg-green-800 text-white-100"}`}>
										{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>
									{/* <button className='text-indigo-400 hover:text-indigo-300 mr-2'>Edit</button> */}
									<button className='text-white-400 hover:text-red-600' onClick={() => handleDelete(user.id)}><Trash2 /></button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default UsersTable;
