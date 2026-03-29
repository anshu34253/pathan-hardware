import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginSelection from "./pages/LoginSelection.jsx";
import CustomerLogin from "./pages/CustomerLogin.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import CustomerDashboardLayout from "./components/CustomerDashboardLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProductManagement from "./pages/ProductManagement.jsx";
import CustomerManagement from "./pages/CustomerManagement.jsx";
import Billing from "./pages/Billing.jsx";
import LendingManagement from "./pages/LendingManagement.jsx";
import Settings from "./pages/Settings.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import CustomerProducts from "./pages/CustomerProducts.jsx";
import CustomerOrders from "./pages/CustomerOrders.jsx";
import CustomerPayments from "./pages/CustomerPayments.jsx";
import CustomerProfile from "./pages/CustomerProfile.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/home",
    Component: LandingPage,
  },
  {
    path: "/select-login",
    Component: LoginSelection,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/customer-login",
    Component: CustomerLogin,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/admin",
    Component: DashboardLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "products", Component: ProductManagement },
      { path: "customers", Component: CustomerManagement },
      { path: "billing", Component: Billing },
      { path: "lending", Component: LendingManagement },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/customer",
    Component: CustomerDashboardLayout,
    children: [
      { index: true, Component: CustomerDashboard },
      { path: "products", Component: CustomerProducts },
      { path: "orders", Component: CustomerOrders },
      { path: "payments", Component: CustomerPayments },
      { path: "profile", Component: CustomerProfile },
    ],
  },
]);