import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProviderLogin from "./pages/ProviderLogin";
import ProviderRegister from "./pages/ProviderRegister";
import ProviderOnboarding from "./pages/ProviderOnboarding";

function App() {
  return (
    <>
      {/* <h1>Hello from react</h1> */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/provider/register" replace />}
          />
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Provider routes */}
          <Route path="/provider/register" element={<ProviderRegister />} />
          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/provider/onboarding" element={<ProviderOnboarding />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
