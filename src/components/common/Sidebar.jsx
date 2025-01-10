// import {
// 	BarChart2,
// 	DollarSign,
// 	Menu,
// 	Settings,
// 	ShoppingBag,
// 	ShoppingCart,
// 	TrendingUp,
// 	Users,
// 	Image,
// } from "lucide-react";

// import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Link, useLocation } from "react-router-dom";

// const SIDEBAR_ITEMS = [
// 	{
// 		name: "Overview",
// 		icon: BarChart2,
// 		color: "#6366f1",
// 		href: "/",
// 	},
// 	{ name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
// 	{ name: "Post-Products", icon: ShoppingBag, color: "#8B5CF6", href: "/post-products" },
// 	{ name: "Post-Simple-Products", icon: ShoppingBag, color: "#8B5CF6", href: "/post-simple-product" },
// 	{ name: "Users", icon: Users, color: "#EC4899", href: "/users" },
// 	{ name: "Category", icon: DollarSign, color: "#10B981", href: "/category" },
// 	{ name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
// 	{ name: "Banners", icon: Image, color: "#6EE7B7", href: "/banners" },
// 	{ name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
// 	{ name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
// ];

// const Sidebar = () => {
// 	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
// 	const location = useLocation();

// 	return (
// 		<motion.div
// 			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
// 				isSidebarOpen ? "w-64" : "w-20"
// 			}`}
// 			animate={{ width: isSidebarOpen ? 256 : 80 }}
// 		>
// 			<div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700 overflow-y-auto">
// 				<div className="flex gap-10 items-center ">
// 					<motion.button
// 						whileHover={{ scale: 1.1 }}
// 						whileTap={{ scale: 0.9 }}
// 						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// 						className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
// 					>
// 						<Menu size={24} />
// 					</motion.button>
// 					{isSidebarOpen && <h1 className="text-2xl font-serif">ECOM</h1>}
// 				</div>

// 				<nav className="mt-8 flex-grow">
// 					{SIDEBAR_ITEMS.map((item) => (
// 						<Link key={item.href} to={item.href}>
// 							<motion.div
// 								className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
// 									location.pathname === item.href
// 										? "bg-gray-700"
// 										: "hover:bg-gray-700"
// 								}`}
// 							>
// 								<item.icon
// 									size={20}
// 									style={{ color: item.color, minWidth: "20px" }}
// 								/>
// 								<AnimatePresence>
// 									{isSidebarOpen && (
// 										<motion.span
// 											className="ml-4 whitespace-nowrap"
// 											initial={{ opacity: 0, width: 0 }}
// 											animate={{ opacity: 1, width: "auto" }}
// 											exit={{ opacity: 0, width: 0 }}
// 											transition={{ duration: 0.2, delay: 0.3 }}
// 										>
// 											{item.name}
// 										</motion.span>
// 									)}
// 								</AnimatePresence>
// 							</motion.div>
// 						</Link>
// 					))}
// 				</nav>
// 			</div>
// 		</motion.div>
// 	);
// };

// export default Sidebar;


//================================== OLD CODE ==================================
import {
	BarChart2,
	DollarSign,
	Menu,
	Settings,
	ShoppingBag,
	ShoppingCart,
	TrendingUp,
	Users,
	Image,
	ChevronRight,
	ChevronDown,
} from "lucide-react";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{
		name: "Overview",
		icon: BarChart2,
		color: "#6366f1",
		href: "/",
	},
	{ name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
	// { name: "Post-Products", icon: ShoppingBag, color: "#8B5CF6", href: "/post-products"},
	// { name: "Post-Simple-Products", icon: ShoppingBag, color: "#8B5CF6", href: "/post-simple-product" },
	{ name: "Users", icon: Users, color: "#EC4899", href: "/users" },
	// { name: "Category", icon: DollarSign, color: "#10B981", href: "/category" },
	{ name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
	// { name: "Banners", icon: Image, color: "#6EE7B7", href: "/banners" },
	{
		name: "Managemant",
		icon: Settings,
		color: "#6EE7B7",
		subItems: [
			{ name: "Banner", icon: Image, color: "#6EE7B7", href: "/banners" },
			{ name: "Category", icon: Image, color: "#6EE7B7", href: "/category" },
			{ name: "Product Group", icon: Image, color: "#6EE7B7", href: "/productGroupPage" }
		]
	},
	// { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
	// { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [openDropdown, setOpenDropdown] = useState(false);
	const location = useLocation();

	const toggleDropdown = () => {
		setOpenDropdown(!openDropdown);
	};

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
				}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
				<div className="flex gap-10 items-center">
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
					>
						<Menu size={24} />
					</motion.button>
					{isSidebarOpen && <h1 className="text-2xl font-serif">ECOM</h1>}
				</div>

				<nav className="mt-8 flex-grow">
					{SIDEBAR_ITEMS.map((item) =>
						item.subItems ? (
							<div key={item.name}>
								<div
									className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${openDropdown ? "bg-gray-700" : "hover:bg-gray-700"
										}`}
									onClick={toggleDropdown}
								>
									<item.icon
										size={20}
										style={{ color: item.color, minWidth: "20px" }}
									/>
									<AnimatePresence>
										{isSidebarOpen && (
											<motion.span
												className="ml-4 flex-grow whitespace-nowrap"
												initial={{ opacity: 0, width: 0 }}
												animate={{ opacity: 1, width: "auto" }}
												exit={{ opacity: 0, width: 0 }}
												transition={{ duration: 0.2, delay: 0.3 }}
											>
												{item.name}
											</motion.span>
										)}
									</AnimatePresence>
									{isSidebarOpen && (
										<motion.div
											initial={{ rotate: openDropdown ? 0 : 90 }}
											animate={{ rotate: openDropdown ? 90 : 0 }}
											className="ml-auto"
										>
											{openDropdown ? (
												<ChevronDown size={16} />
											) : (
												<ChevronRight size={16} />
											)}
										</motion.div>
									)}
								</div>
								<AnimatePresence>
									{openDropdown && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											className="pl-6"
										>
											{item.subItems.map((subItem) => (
												<Link key={subItem.href} to={subItem.href}>
													<div className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors mb-2 ${location.pathname === subItem.href ? "bg-gray-700" : "hover:bg-gray-700"}`}>
														<subItem.icon
															size={20}
															style={{
																color: subItem.color,
																minWidth: "20px",
															}}
														/>
														{isSidebarOpen && (
															<span className="ml-4 whitespace-nowrap">
																{subItem.name}
															</span>
														)}
													</div>
												</Link>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							<Link key={item.href} to={item.href}>
								<motion.div
									className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${location.pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
										}`}
								>
									<item.icon
										size={20}
										style={{ color: item.color, minWidth: "20px" }}
									/>
									<AnimatePresence>
										{isSidebarOpen && (
											<motion.span
												className="ml-4 whitespace-nowrap"
												initial={{ opacity: 0, width: 0 }}
												animate={{ opacity: 1, width: "auto" }}
												exit={{ opacity: 0, width: 0 }}
												transition={{ duration: 0.2, delay: 0.3 }}
											>
												{item.name}
											</motion.span>
										)}
									</AnimatePresence>
								</motion.div>
							</Link>
						)
					)}
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;
