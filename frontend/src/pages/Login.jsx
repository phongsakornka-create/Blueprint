import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Building,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Login() {
  const { login, quickLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // หากเข้าสู่ระบบแล้ว ให้พาไป Dashboard อัตโนมัติ
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      await login(cleanEmail, cleanPassword);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error details:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์หลังบ้านได้ (กรุณาปิดหน้าต่างรันเดิมแล้วเปิด start.bat ใหม่)");
      } else {
        setError(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError("");
    setLoading(true);
    try {
      await quickLogin(role);
      navigate("/dashboard");
    } catch (err) {
      console.error("Quick demo login error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์หลังบ้านได้ (กรุณาปิดหน้าต่างรันเดิมแล้วเปิด start.bat ใหม่)");
      } else {
        setError("ไม่สามารถเข้าสู่ระบบด้วยบัญชีทดสอบได้: " + (err.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 pb-20">
      <div className="max-w-md w-full">
        {/* Card Header & Brand */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          <div className="bg-gradient-to-br from-red-900 via-red-800 to-slate-900 p-6 sm:p-8 text-white text-center relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-3 sm:mb-4 shadow-inner">
              <Building className="w-8 h-8 sm:w-9 sm:h-9 text-red-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">คณะวิศวกรรมศาสตร์</h2>
            <p className="text-xs sm:text-sm text-red-100/80 mt-1 font-light">
              ระบบจัดเก็บข้อมูลบุคลากรและการลางานออนไลน์
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">ข้อผิดพลาดในการเข้าสู่ระบบ</p>
                  <p className="text-xs mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  อีเมลมหาวิทยาลัย (@eng.ac.th)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@eng.ac.th"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl shadow-md shadow-red-900/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>เข้าสู่ระบบ</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Box */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  ทดสอบระบบด่วน (Quick Demo 1-Click)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin")}
                  className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-200 transition text-left"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("head")}
                  className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl border border-purple-200 transition text-left"
                >
                  👔 หัวหน้าสาขา
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("staff")}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition text-left"
                >
                  📋 เจ้าหน้าที่
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("lecturer")}
                  className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 transition text-left"
                >
                  🎓 อาจารย์
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          คณะวิศวกรรมศาสตร์ มหาวิทยาลัย • ระบบบริการบุคลากร
        </p>
      </div>
    </div>
  );
}