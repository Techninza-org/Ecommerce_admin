import { useState } from "react";
import { removeToken } from "../../utilities/jwt";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const navigate = useNavigate();

	const toggleDropdown = () => {
		setDropdownOpen((prevState) => !prevState);
	};

	const handleLogout = () => {

		const confirmLogout = window.confirm("Are you sure you want to logout?");
		if (!confirmLogout) { return; }

		removeToken();
		navigate("/login");
	};

	return (
		<header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
			
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
				
				<a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
					<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"> {title} </span>
				</a>

				<div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

					<button onClick={()=> {handleLogout()}} className="block w-full px-4 py-2 text-sm text-left text-gray-100 bg-blue-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 hover:text-black rounded-lg"> Sign out </button>
					
					{/* <button onClick={toggleDropdown} className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" type="button">
						<span className="sr-only">Open user menu</span>
						<img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/logo.svg" alt="user photo"/>
					</button> */}

					{/* Dropdown menu */}
					{/* {isDropdownOpen && (
						<div className="absolute right-10 top-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 z-50">
							
							<div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
								<div>Bonnie Green</div>
								<div className="font-medium truncate">name@flowbite.com</div>
							</div>

							<ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
								<li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a></li>
							</ul>
							
							<button onClick={()=> {removeToken(); navigate("/login")}} className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"> Sign out </button>

						</div>
					)} */}

				</div>
				
			</div>
		</header>
	);
};

export default Header;
