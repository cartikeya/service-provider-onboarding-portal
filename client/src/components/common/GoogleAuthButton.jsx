// src/components/common/GoogleAuthButton.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthButton({ role = "provider", onError }) {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        credential: credentialResponse.credential,
        role,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Redirect provider to onboarding status
        navigate("/provider/onboarding");
      }
    } catch (err) {
      if (onError)
        onError(err.response?.data?.message || "Google sign in failed");
    }
  };

  return (
    <div className="w-full flex justify-center my-3">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() =>
          onError && onError("Google authentication cancelled or failed")
        }
        useOneTap
        shape="circle"
        theme="outline"
        text="continue_with"
      />
    </div>
  );
}
