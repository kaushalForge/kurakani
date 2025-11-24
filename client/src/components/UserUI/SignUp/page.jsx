import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { User, Mail, Lock } from "lucide-react";
import Loader1 from "../../UI/Loader/Loader1";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signup`,
        form
      );

      toast.success(response.data.message, { position: "top-right" });
      setForm({ username: "", email: "", password: "" });
      navigate("/sign-in");
    } catch (err) {
      const resp = err.response?.data;

      if (!resp) {
        toast.error("Server not responding", { position: "top-right" });
      } else if (resp.warning) {
        toast.warning(resp.warning, { position: "top-right" });
      } else if (resp.message) {
        toast.warning(resp.message, { position: "top-right" });
      } else if (resp.error) {
        toast.error(resp.error, { position: "top-right" });
      } else {
        toast.error("Something went wrong", { position: "top-right" });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl p-8 animate-glowIn">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-inner"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              required
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-inner"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 font-medium"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:scale-105 transition-all duration-300"
          >
            {loading ? (
              <>
                <span>Signing Up</span>
                <Loader1 />
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Extra links */}
        <div className="mt-6 text-center text-gray-400">
          <p>
            Already have an account?{" "}
            <Link to="/sign-in" className="text-indigo-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes glowIn {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); box-shadow: 0 0 25px rgba(99, 102, 241, 0.4); }
        }
        .animate-glowIn { animation: glowIn 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SignUp;
