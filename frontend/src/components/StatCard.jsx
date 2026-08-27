export default function StatCard({ title, value, icon: Icon, color = "blue", subtitle, trend }) {
  const colorMap = {
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const iconBgMap = {
    red: "bg-red-600 text-white",
    blue: "bg-blue-600 text-white",
    amber: "bg-amber-500 text-white",
    emerald: "bg-emerald-600 text-white",
    purple: "bg-purple-600 text-white",
    rose: "bg-rose-600 text-white",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgMap[color] || "bg-slate-700 text-white"} shadow-xs`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
          {trend}
        </div>
      )}
    </div>
  );
}
