import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
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
  {
    name: "Filter Management ",
    icon: ShoppingBag,
    color: "#8B5CF6",
    href: "/filter",
  },
  { name: "Category", icon: DollarSign, color: "#10B981", href: "/category" },
  { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
  {
    name: "Attribute",
    icon: Settings,
    color: "#F59E0B",
    href: "/attribute_page",
  },
  { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
  // { name: "Orders-Returned", icon: ShoppingCart, color: "#F59E0B", href: "/returned-order-products" },
  {
    name: "Home Management",
    icon: Settings,
    color: "#6EE7B7",
    subItems: [
      { name: "Banner", icon: Image, color: "#6EE7B7", href: "/banners" },
      { name: "Coupon", icon: Image, color: "#6EE7B7", href: "/coupon" },
      { name: "Product Group", icon: Image, color: "#6EE7B7", href: "/productGroupPage" },
      { name: "App Data", icon: Image, color: "#6EE7B7", href: "/application_data" },
    ],
  },
  {
    name: "Setting",
    icon: Settings,
    color: "#F59E0B",
    subItems: [
      { name: "Address", icon: Image, color: "#6EE7B7", href: "/settingb" },
      { name: "Static Page", icon: ShoppingBag, color: "#8B5CF6", href: "/StatckPage" },
    ],
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <motion.div className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`} animate={{ width: isSidebarOpen ? 256 : 80 }}>

      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">

        <div className="flex gap-10 items-center">

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit" >
            <Menu size={24} />
          </motion.button>

          {isSidebarOpen && <h1 className="text-2xl font-serif">ECOM</h1>}
        </div>

        <nav className="mt-8 flex-grow overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) =>
            item.subItems ? (
              <div key={item.name}>
                <div className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${openDropdown === item.name ? "bg-gray-700" : "hover:bg-gray-700"}`} onClick={() => toggleDropdown(item.name)}>
                  <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />

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
                    <motion.div initial={{ rotate: openDropdown === item.name ? 0 : 90 }} animate={{ rotate: openDropdown === item.name ? 90 : 0 }} className="ml-auto" >
                      {
                        openDropdown === item.name ? (<ChevronDown size={16} />) : (<ChevronRight size={16} />)
                      }
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {openDropdown === item.name && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-6" >
                      {item.subItems.map((subItem) => (
                        <Link key={subItem.href} to={subItem.href}>

                          <div className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors mb-2 ${location.pathname === subItem.href ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                            <subItem.icon size={20} style={{ color: subItem.color, minWidth: "20px", }} />
                            {
                              isSidebarOpen && (<span className="ml-4 whitespace-nowrap"> {subItem.name} </span>)
                            }
                          </div>

                        </Link>
                      ))}

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            ) : (
              <Link key={item.href} to={item.href}>
                <motion.div className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${location.pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"}`} >
                  <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />

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
