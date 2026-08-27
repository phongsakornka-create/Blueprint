import { ROLE_LABELS, ROLE_COLORS } from "../utils/permissions";

export function RoleBadge({ role, className = "" }) {
  const label = ROLE_LABELS[role] || role;
  const colorClass = ROLE_COLORS[role] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}

export function LeaveStatusBadge({ status, className = "" }) {
  let badgeStyle = "bg-gray-100 text-gray-700 border-gray-300";
  let label = status;

  switch (status) {
    case "pending":
      badgeStyle = "bg-amber-50 text-amber-700 border-amber-300";
      label = "รออนุมัติ";
      break;
    case "approved":
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-300";
      label = "อนุมัติแล้ว";
      break;
    case "rejected":
      badgeStyle = "bg-rose-50 text-rose-700 border-rose-300";
      label = "ไม่อนุมัติ";
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "pending"
            ? "bg-amber-500 animate-pulse"
            : status === "approved"
            ? "bg-emerald-500"
            : "bg-rose-500"
        }`}
      />
      {label}
    </span>
  );
}
