import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import Reservations from "./pages/dashboard/Reservations";
import Rooms from "./pages/dashboard/Rooms";
import DashboardMenu from "./pages/dashboard/Menu";
import Tables from "./pages/dashboard/Tables";
import Orders from "./pages/dashboard/Orders";
import Kitchen from "./pages/dashboard/Kitchen";
import Inventory from "./pages/dashboard/inventory/Inventory";
import Customers from "./pages/dashboard/Customers";
import Employees from "./pages/dashboard/Employees";
import Expenses from "./pages/dashboard/Expenses";
import Payments from "./pages/dashboard/Payments";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";

import Home from "./pages/Home";
import RoomDetails from "./pages/RoomDetails";
import Booking from "./pages/Booking";
import TableReservation from "./pages/TableReservation";
import Menu from "./pages/Menu";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

function HashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.replace("#", "");

    const scrollToElement = () => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        return true;
      }

      return false;
    };

    if (scrollToElement()) {
      return;
    }

    const timeout = setTimeout(() => {
      scrollToElement();
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname, location.hash]);

  return null;
}

function ProtectedRoute({ children }) {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <HashScroll />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/room-details"
            element={<RoomDetails />}
          />
          <Route
            path="/booking"
            element={<Booking />}
          />
          <Route
            path="/table-reservation"
            element={<TableReservation />}
          />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="reservations"
            element={<Reservations />}
          />
          <Route path="rooms" element={<Rooms />} />
          <Route
            path="menu"
            element={<DashboardMenu />}
          />
          <Route path="tables" element={<Tables />} />
          <Route path="orders" element={<Orders />} />
          <Route path="kitchen" element={<Kitchen />} />
          <Route
            path="inventory"
            element={<Inventory />}
          />
          <Route
            path="customers"
            element={<Customers />}
          />
          <Route
            path="employees"
            element={<Employees />}
          />
          <Route
            path="expenses"
            element={<Expenses />}
          />
          <Route
            path="payments"
            element={<Payments />}
          />
          <Route
            path="reports"
            element={<Reports />}
          />
          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;