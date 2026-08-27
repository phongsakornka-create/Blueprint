import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  Users,
  User,
  CheckSquare,
} from "lucide-react";

export default function MobileBottomNav() {
  const { user } = useAuth();
  const isApprover = user?.role === "head" || user?.role === "admin";

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "หน้าหลัก",
    },
    {
      to: isApprover ? "/leave-approval" : "/leave-request",
      icon: isApprover ? CheckSquare : CalendarPlus,
      label: isApprover ? "อนุมัติ" : "ยื่นลา",
    },
    {
      to: "/leave-calendar",
      icon: CalendarDays,
      label: "ปฏิทิน",
    },
    {
      to: "/employees",
      icon: Users,
      label: "บุคลากร",
    },
    {
      to: "/profile",
      icon: User,
      label: "โปรไฟล์",
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1.5 shadow-lg shadow-slate-900/10"
      style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "text-red-800 font-extrabold scale-105"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-xl transition ${
                      isActive ? "bg-red-50 text-red-800 shadow-2xs" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
