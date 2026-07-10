import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import api from "../services/api";
import {
  User,
  Shield,
  Briefcase,
  FileText,
  ChevronRight,
  Calendar,
  LogOut,
  MessageCircle,
  CreditCard,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  Upload
} from "lucide-react";

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form Fields (Basic Registration/Login)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("BUYER"); // BUYER or SELLER
  const [profileImage, setProfileImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // OTP Verification States
  const [isOtpVerification, setIsOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Current logged in user state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, [location.pathname]);

  // OTP Countdown Timer
  useEffect(() => {
    let interval;
    if (isOtpVerification && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isOtpVerification, timer]);

  // Google Sign In GSI Script Loader
  useEffect(() => {
    if (window.google && !user && !isOtpVerification) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "902721223221-q5i46gi0vco3e3lfn3f2it0nps2qio5r.apps.googleusercontent.com",
          callback: handleGoogleLoginCallback,
        });

        const container = document.getElementById("googleSignInDiv");
        if (container) {
          window.google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with"
          });
        }
      } catch (err) {
        console.error("Failed to initialize Google Identity Services:", err);
      }
    }
  }, [isLogin, user, isOtpVerification]);

  const handleGoogleLoginCallback = async (response) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await api.post("/auth/google", {
        idToken: response.credential,
        userType: userType
      });
      const { accessToken, user: userData } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(accessToken);
      setUser(userData);
      setSuccessMessage(`Welcome, ${userData.firstName}! 🎉`);

      window.dispatchEvent(new Event("storage"));
      navigate("/account/profile");
    } catch (err) {
      console.error("Google Auth Error:", err);
      setErrorMessage(err.response?.data?.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setSuccessMessage("Logged out successfully");
    setErrorMessage("");
    navigate("/account");
    window.location.reload();
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage("");
    setSuccessMessage("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const secureUrl = response.data?.data?.secureUrl || response.data?.secureUrl || response.data?.data || response.data;
      setProfileImage(secureUrl);
      setSuccessMessage("Profile photo uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to upload profile photo to Cloudinary.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post("/auth/login", { email, password });
        const { accessToken, user: userData } = response.data;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(accessToken);
        setUser(userData);
        setSuccessMessage(`Welcome back, ${userData.firstName}! 🎉`);

        window.dispatchEvent(new Event("storage"));
        navigate("/account/profile");
      } else {
        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match");
          setLoading(false);
          return;
        }

        await api.post("/auth/register", {
          firstName,
          lastName,
          email,
          phone,
          password,
          confirmPassword,
          userType,
          profileImage
        });

        // Registration successful: switch to OTP screen
        setOtpEmail(email);
        setIsOtpVerification(true);
        setTimer(60);
        setResendDisabled(true);
        setSuccessMessage("Account created! Verification code sent to your email.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        let msg = errorData.message || errorData.error || "An error occurred.";
        if (errorData.fieldErrors) {
          const details = Object.entries(errorData.fieldErrors)
            .map(([field, errorMsg]) => `${field}: ${errorMsg}`)
            .join(" | ");
          msg = `Validation Error: ${details}`;
        }
        setErrorMessage(msg);
      } else {
        setErrorMessage("Could not connect to the backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email: otpEmail, otpCode });
      setVerificationSuccess(true);
      setSuccessMessage("Verification successful! Please log in.");

      // Auto transition to login screen after 2.5s
      setTimeout(() => {
        setIsOtpVerification(false);
        setVerificationSuccess(false);
        setIsLogin(true);
        setOtpCode("");
        // Pre-fill email for login
        setEmail(otpEmail);
        setPassword("");
        setSuccessMessage("Email verified! Please log in with your credentials.");
      }, 2500);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await api.post("/auth/resend-otp", { email: otpEmail });
      setSuccessMessage("A new verification code has been sent!");
      setTimer(60);
      setResendDisabled(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to resend code. Please try again.");
    }
  };

  const isUserSeller = user && (user.roles?.includes("SELLER") || user.roles?.includes("ROLE_SELLER"));
  const isUserAdmin = user && (user.roles?.includes("ADMIN") || user.roles?.includes("ROLE_ADMIN") || user.roles?.includes("SUPER_ADMIN"));

  const path = location.pathname;
  const isProfileActive = path === "/account/profile" || path === "/account";
  const isSellerActive = path === "/account/seller-application";
  const isOrdersActive = path === "/account/orders";
  const isRentalsActive = path === "/account/rentals";
  const isReviewsActive = path === "/account/reviews";

  // Logged In Dashboard View
  if (user && token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-8 font-outfit">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-green-955">Workspace Portal</h1>
              <p className="text-gray-500 mt-1">Hello, {user.firstName}! Manage your profile and business details here.</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-xl font-bold transition shadow-sm cursor-pointer border-0 outline-none"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Grid Layout: Sidebar Navigation & Content */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <div className="space-y-2 lg:col-span-1">
              <Link
                to="/account/profile"
                className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition ${isProfileActive
                  ? "bg-green-600 text-white shadow-lg shadow-green-100"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-100"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <User size={20} />
                  My Profile
                </span>
                <ChevronRight size={16} />
              </Link>

              {!isUserAdmin && (
                <Link
                  to="/account/seller-application"
                  className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition ${isSellerActive
                    ? "bg-green-600 text-white shadow-lg shadow-green-100"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-100"
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <Briefcase size={20} />
                    {isUserSeller ? "Merchant Console" : "Apply for Seller"}
                  </span>
                  <ChevronRight size={16} />
                </Link>
              )}

              {isUserAdmin && (
                <>
                  <Link
                    to="/admin/verification"
                    className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition bg-white hover:bg-gray-50 text-gray-700 border border-gray-100"
                  >
                    <span className="flex items-center gap-3">
                      <Shield size={20} />
                      Verification Console
                    </span>
                    <ChevronRight size={16} />
                  </Link>

                  <Link
                    to="/admin/revenue"
                    className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition bg-white hover:bg-gray-50 text-gray-700 border border-gray-100"
                  >
                    <span className="flex items-center gap-3">
                      <CreditCard size={20} />
                      Commission Analytics
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                </>
              )}

              <Link
                to="/account/orders"
                className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition ${isOrdersActive
                  ? "bg-green-600 text-white shadow-lg shadow-green-100"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-100"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <FileText size={20} />
                  My Orders
                </span>
                <ChevronRight size={16} />
              </Link>

              <Link
                to="/account/rentals"
                className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition ${isRentalsActive
                  ? "bg-green-600 text-white shadow-lg shadow-green-100"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-100"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Calendar size={20} />
                  Machinery Rentals
                </span>
                <ChevronRight size={16} />
              </Link>

              <Link
                to="/account/reviews"
                className={`w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center justify-between transition ${isReviewsActive
                  ? "bg-green-600 text-white shadow-lg shadow-green-100"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-100"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <MessageCircle size={20} />
                  My Reviews
                </span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Nested Content Area */}
            <div className="lg:col-span-3 space-y-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification view
  if (isOtpVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center px-4 py-12 animate-fadeIn font-outfit">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl p-8 border border-green-200 text-center">
          {verificationSuccess ? (
            <div className="space-y-4 animate-scaleUp py-6">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={44} />
              </div>
              <h2 className="text-3xl font-extrabold text-green-950">Verified!</h2>
              <p className="text-gray-500 text-sm">Your email address has been successfully verified.</p>
              <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mt-6"></div>
              <p className="text-xs text-green-700 font-bold">Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <KeyRound size={32} />
              </div>

              <h2 className="text-3xl font-extrabold text-green-950 mb-2">Enter Verification Code</h2>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                We've sent a 6-digit OTP code to <strong className="text-gray-700">{otpEmail}</strong>.<br />
                Please enter it below to activate your account.
              </p>

              {successMessage && (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 mb-4 text-xs font-semibold">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 mb-4 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full tracking-[1.5em] text-center font-extrabold text-2xl border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:tracking-normal placeholder:text-gray-300"
                  required
                />

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-md transition text-lg flex items-center justify-center cursor-pointer border-0 outline-none"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    "Verify Account"
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="text-xs font-bold text-gray-400">
                  {timer > 0 ? (
                    <span>Resend code in <strong className="text-green-600 font-extrabold">{timer}s</strong></span>
                  ) : (
                    <span>Didn't receive the email?</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  className="text-green-700 hover:text-green-800 disabled:text-gray-300 disabled:no-underline font-extrabold text-sm hover:underline cursor-pointer bg-transparent border-0 outline-none"
                >
                  Resend OTP Code
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOtpVerification(false);
                    setIsLogin(false);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  className="mt-2 text-gray-400 hover:text-gray-600 text-xs font-semibold cursor-pointer bg-transparent border-0 outline-none"
                >
                  Back to Registration
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Login / Register Form View
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center px-4 py-12 animate-fadeIn font-outfit">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl p-8 border border-green-200">
        <h2 className="text-4xl font-extrabold text-center text-green-950 mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {successMessage && (
          <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 mb-4 text-center font-medium">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 mb-4 text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Profile Image Upload for Registration */}
              <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-200 rounded-2xl mb-4 bg-gray-50/50 relative">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xl font-black overflow-hidden shadow-sm relative">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={28} />
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-3">
                  <label className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1 shadow-sm">
                    <Upload size={13} />
                    {profileImage ? "Change Photo" : "Upload Photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} disabled={uploadingImage} />
                  </label>

                  {profileImage && (
                    <button
                      type="button"
                      onClick={handleRemoveProfileImage}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {!profileImage && (
                  <span className="text-[10px] text-gray-400 font-semibold mt-1">Leave empty for default avatar initials</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
              </div>

              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1 pl-1">Register As</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                >
                  <option value="BUYER">Farmer / Buyer</option>
                  <option value="SELLER">Merchant / Seller</option>
                </select>
              </div>
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-xl font-bold shadow-md transition text-lg flex items-center justify-center cursor-pointer border-0 outline-none"
          >
            {loading ? (
              <span className="border-4 border-t-transparent border-white rounded-full w-6 h-6 animate-spin"></span>
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-gray-250 w-full"></div>
          <div className="absolute bg-white px-4 text-xs text-gray-400 font-extrabold uppercase">Or</div>
        </div>

        {/* Google Login Div Container */}
        <div className="w-full flex justify-center mb-6">
          <div id="googleSignInDiv" className="w-full"></div>
        </div>

        <div className="text-center mt-6">
          <span className="text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="ml-2 text-green-700 font-bold hover:underline focus:outline-none cursor-pointer bg-transparent border-0"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
