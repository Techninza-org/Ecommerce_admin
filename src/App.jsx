import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import PostProduct from "./pages/PostProduct";
import UsersPage from "./pages/UsersPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Auth/Login";
import Category from "./pages/Category";
import BannerPage from "./pages/BannerPage";
import OrderPage from "./pages/OrderDetailPage";
import CreateSimpleProduct from "./pages/CreateSimpleProduct";
import BannerPreview from "./pages/PreviewBanner";

function App() {
	const location = useLocation();
	const isLoginPage = location.pathname === '/login';

	return (
		<div className={`flex h-screen ${isLoginPage ? 'bg-gray-100' : 'bg-gray-900 text-gray-100 overflow-hidden'}`}>
			{/* Background effect */}
			{!isLoginPage && (
				<>
					<div className="fixed inset-0 z-0">
						<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
						{/* <div className="absolute inset-1 backdrop-blur-sm" /> */}
					</div>
				</>
			)}

			{/* Sidebar */}
			{!isLoginPage && <Sidebar />}

			{/* Page content */}
			<div className={`flex-1 ${isLoginPage ? 'flex items-center justify-center' : 'overflow-auto'}`}>
				<Routes>
					<Route path="/" element={<OverviewPage />} />
					<Route path="/products" element={<ProductsPage />} />
					<Route path="/post-products" element={<PostProduct />} />
					<Route path="/users" element={<UsersPage />} />
					<Route path="/category" element={<Category />} />
					<Route path="/orders" element={<OrdersPage />} />
					<Route path="/banners" element={<BannerPage />} />
					<Route path="/analytics" element={<AnalyticsPage />} />
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/order-details" element={<OrderPage />} />
					<Route path="/post-simple-product" element={<CreateSimpleProduct />} />
					<Route path="/preview-banner" element={<BannerPreview />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;