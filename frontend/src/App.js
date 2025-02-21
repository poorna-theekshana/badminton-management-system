import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import TestHome from "./pages/TestHome";
import ProfilePage from "./pages/ProfilePage";
import AdminBookingsPage from "./pages/AdminBookingsPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />;
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/test" element={<TestHome />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

