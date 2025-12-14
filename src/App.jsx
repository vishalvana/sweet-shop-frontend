import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./auth/AuthContext";
import { useContext } from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ShopPage from "./pages/ShopPage";
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* 🔹 Default entry → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔹 Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔹 Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/shop"
          element={
            <PrivateRoute>
              <ShopPage />
            </PrivateRoute>
          }
        />

        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
