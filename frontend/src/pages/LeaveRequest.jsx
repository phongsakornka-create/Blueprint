import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { leaveService } from "../services/leaveService";
import { useAuth } from "../context/AuthContext";
import LeaveBalanceCard from "../components/LeaveBalanceCard";
import { calculateDays, toISODateString } from "../utils/dateUtils";
import {
  FilePlus2,
  Calendar,
  Clock,
  Paperclip,
  CheckCircle,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";

export default function LeaveRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [balances, setBalances] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(true);

  // Form State
  const today = toISODateString(new Date());
  const [formData, setFormData] = useState({
    leave_type_id: "1",
    start_date: today,
    end_date: today,
    reason: "",
    attachment_url: "",
  });

  const [daysCount, setDaysCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const loadBalances = async () => {
    try {
      const data = await leaveService.getMyLeaveBalance();
      setBalances(data);
      if (data.length > 0 && !formData.leave_type_id) {
        setFormData((prev) => ({ ...prev, leave_type_id: String(data[0].leave_type_id) }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBalances(false);
    }
  };

  useEffect(() => {
    loadBalances();
  }, []);

  // Recalculate days count whenever dates change
  useEffect(() => {
    const days = calculateDays(formData.start_date, formData.end_date);
    setDaysCount(days);
  }, [formData.start_date, formData.end_date]);

  const selectedBalance = balances.find((b) => String(b.leave_type_id) === String(formData.leave_type_id));
  const isOverBalance = selectedBalance && daysCount > selectedBalance.remaining_days;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (daysCount <= 0) {
      setMessage({ text: "ช่วงวันที่ลาไม่ถูกต้อง (วันเริ่มต้นต้องมาก่อนหรือตรงกับวันสิ้นสุด)", type: "error" });
      return;
    }

    if (isOverBalance) {
      setMessage({
        text: `จำนวนวันลาที่ขอ (${daysCount} วัน) เกินกว่าวันลาคงเหลือ (${selectedBalance.remaining_days} วัน)`,
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      await leaveService.createLeaveRequest({
        leave_type_id: parseInt(formData.leave_type_id, 10),
        start_date: formData.start_date,
        end_date: formData.end_date,
        days_count: daysCount,
        reason: formData.reason,
        attachment_url: formData.attachment_url || null,
      });

      setMessage({
        text: "ยื่นคำขอลางานเรียบร้อยแล้ว ระบบได้ส่งการแจ้งเตือนไปยังผู้มีอำนาจอนุมัติ",
        type: "success",
      });

      setTimeout(() => {
        navigate("/leave-history");
      }, 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "เกิดข้อผิดพลาดในการส่งคำขอลา",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ยื่นคำขอลางานออนไลน์</h1>
        <p className="text-sm text-slate-600 mt-1">
          กรอกแบบฟอร์มเพื่อส่งคำขอลาไปยังหัวหน้าสาขาวิชาหรือผู้มีอำนาจอนุมัติ (ระบบ Paperless)
        </p>
      </div>

      {/* Leave Balances Status */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          ยอดวันลาคงเหลือของคุณในปีปัจจุบัน
        </h2>
        {loadingBalances ? (
          <div className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {balances.map((b) => (
              <LeaveBalanceCard key={b.leave_type_id} balance={b} />
            ))}
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">
                {message.type === "success" ? "ส่งคำขอสำเร็จ" : "ข้อผิดพลาด"}
              </p>
              <p className="text-xs mt-0.5">{message.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. ประเภทการลา */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. เลือกประเภทการลา <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {balances.map((b) => (
                <label
                  key={b.leave_type_id}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                    String(formData.leave_type_id) === String(b.leave_type_id)
                      ? "border-red-800 bg-red-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="leave_type_id"
                      value={b.leave_type_id}
                      checked={String(formData.leave_type_id) === String(b.leave_type_id)}
                      onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })}
                      className="text-red-800 focus:ring-red-800"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{b.leave_type_name}</p>
                      <p className="text-xs text-slate-600">คงเหลือ {b.remaining_days} วัน</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 2. ช่วงวันที่ลา */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. วันที่เริ่มต้นลา <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                วันที่สิ้นสุดลา <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={formData.start_date}
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
                />
              </div>
            </div>
          </div>

          {/* Calculation Display Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isOverBalance
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <div>
                <span className="text-xs text-slate-600 block">จำนวนวันที่ขอลาทั้งหมด</span>
                <span className="text-lg font-bold">
                  {daysCount > 0 ? `${daysCount} วัน` : "ระบุวันที่ไม่ถูกต้อง"}
                </span>
              </div>
            </div>

            {selectedBalance && (
              <div className="text-right text-xs">
                <span className="block text-slate-600">คงเหลือหลังอนุมัติ (โดยประมาณ)</span>
                <span
                  className={`font-bold ${
                    isOverBalance ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {isOverBalance ? "สิทธิ์ไม่เพียงพอ" : `${selectedBalance.remaining_days - daysCount} วัน`}
                </span>
              </div>
            )}
          </div>

          {/* 3. เหตุผลการลา */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. เหตุผลความจำเป็นในการลา <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="ระบุเหตุผลความจำเป็นในการลา เช่น มีไข้หวัดสูง, ไปติดต่อราชการ, พักผ่อนประจำปี..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition"
            />
          </div>

          {/* 4. เอกสารแนบ (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              4. ลิงก์เอกสารแนบ / ใบรับรองแพทย์ (ถ้ามี)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Paperclip className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="ระบุ URL หรือชื่อไฟล์เอกสารแนบ (เช่น /uploads/medical-cert.pdf)"
                value={formData.attachment_url}
                onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
              />
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              * กรณีลาป่วยตั้งแต่ 3 วันขึ้นไป โปรดแนบใบรับรองแพทย์ตามระเบียบมหาวิทยาลัย
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-100 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting || isOverBalance || daysCount <= 0}
              className="px-6 py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl text-sm shadow-md shadow-red-900/20 transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4" />
                  ส่งคำขอลางาน
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
