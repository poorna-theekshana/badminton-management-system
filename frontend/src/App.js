import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import StorePage from "./pages/StorePage";
import AdminStorePage from "./pages/AdminStorePage";
import AddItem from "./pages/AddItem";
import RecurringBookingsPage from "./pages/RecurringBookingsPage";
import AdminUsersPage from "./pages/AdminUsersPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/store" element={<StorePage />} /> {/* Public Route */}
        <Route path="/admin/store" element={<AdminStorePage />} />
        <Route path="/admin/add-item" element={<AddItem />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route
          path="/recurring-bookings"
          element={<RecurringBookingsPage />}
        />{" "}
      </Routes>
    </Router>
  );
}

export default App;
