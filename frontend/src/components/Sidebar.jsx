import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES, ROLE_LABELS } from "../utils/permissions";
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  History,
  CheckSquare,
  Calendar,
  BellRing,
  FolderArchive,
  User,
  Shield,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const role = user?.role;

  const navigation = [
    {
      name: "Dashboard ภาพรวม",
      to: "/dashboard",
      icon: LayoutDashboard,
      roles: [ROLES.LECTURER, ROLES.HEAD, ROLES.STAFF, ROLES.ADMIN],
    },
    {
      name: "ข้อมูลบุคลากรคณะ",
      to: "/employees",
      icon: Users,
      roles: [ROLES.HEAD, ROLES.STAFF, ROLES.ADMIN],
    },
    {
      name: "ยื่นคำขอลางาน",
      to: "/leave-request",
      icon: FilePlus2,
      roles: [ROLES.LECTURER, ROLES.HEAD, ROLES.STAFF, ROLES.ADMIN],
    },
    {
      name: "ประวัติการลาของฉัน",
      to: "/leave-history",
      icon: History,
      roles: [ROLES.LECTURER, ROLES.HEAD, ROLES.STAFF, ROLES.ADMIN],
    },
    {
      name: "พิจารณาอนุมัติการลา",
      to: "/leave-approval",
      icon: CheckSquare,
      roles: [ROLES.HEAD, ROLES.ADMIN],
      badge: "ผู้อนุมัติ",
    },
    {
      name: "ปฏิทินการลาของคณะ",
      to: "/leave-calendar",
      icon: Calendar,
      roles: [ROLES.LECTURER, ROLES.HEAD, ROLES.STAFF, ROLES.ADMIN],
    },
    {
      name: "ประกาศข่าวสาร",
      to: "/announcements",
      icon: BellRing,
      roles: [ROLES.LECTURER, ROLES.HEAD, ROLES.STAFF, ROLES.ADMIN],
    },
    {
      name: "คลังเอกสาร Paperless",
      to: "/documents",
      icon: FolderArchive,
      roles: [ROLES.LECTURER, ROLES.HEAD, ROLES.STAFF, ROLES.ADMIN],
    },
    {
      name: "ข้อมูลส่วนตัว",
      to: "/profile",
      icon: User,
      roles: [ROLES.LECTURER, ROLES.HEAD, ROLES.STAFF, ROLES.ADMIN],
    },
  ];

  const allowedNav = navigation.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-0 border-r border-slate-800`}
      >
        {/* Header / Brand */}
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center font-bold text-white shadow-xs">
              EN
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-sm tracking-wide text-white">ENGINEERING</span>
              <span className="block text-[10px] text-slate-400 font-medium">คณะวิศวกรรมศาสตร์</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Role Banner */}
        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800 flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-red-400 shrink-0" />
          <div className="truncate">
            <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">บทบาทปัจจุบัน</p>
            <p className="text-xs font-bold text-white truncate">{ROLE_LABELS[role] || role}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {allowedNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-red-800 text-white shadow-md shadow-red-900/30 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-red-950/80 text-red-200 border border-red-700/50">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          ระบบสารสนเทศบุคลากรและการลา v1.0
          <br />
          คณะวิศวกรรมศาสตร์ © 2026
        </div>
      </aside>
    </>
  );
}
