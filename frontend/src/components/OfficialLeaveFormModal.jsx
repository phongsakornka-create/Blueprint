import React from "react";
import { Printer, X, CheckCircle, Building, FileText } from "lucide-react";
import { formatThaiDate, formatThaiDateTime } from "../utils/dateUtils";

export default function OfficialLeaveFormModal({ isOpen, onClose, request, user }) {
  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  const reqUser = request.user || user || {};
  const isApproved = request.status === "approved";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-base">แบบฟอร์มใบลาทางการ (Official Leave Form)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร / บันทึกเป็น PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Container */}
        <div className="p-6 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible print:text-black font-sans leading-relaxed text-slate-800">
          <div className="border border-slate-300 p-8 rounded-2xl bg-white print:border-none print:p-0">
            {/* Header / University Banner */}
            <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
              <div className="flex items-center justify-center gap-3 mb-1">
                <Building className="w-8 h-8 text-red-900 print:text-black" />
                <h1 className="text-xl font-bold tracking-tight text-slate-900 print:text-black">
                  มหาวิทยาลัยกาฬสินธุ์
                </h1>
              </div>
              <h2 className="text-sm font-semibold text-slate-700 print:text-black">
                คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม
              </h2>
              <div className="inline-block mt-3 px-4 py-1 bg-slate-100 print:bg-transparent border border-slate-300 rounded-lg">
                <span className="text-sm font-bold text-slate-900 print:text-black">
                  แบบใบลา ({request.leave_type_name || "การลา"})
                </span>
              </div>
            </div>

            {/* Document Meta Info */}
            <div className="flex justify-between items-start text-xs sm:text-sm mb-6 text-slate-700 print:text-black">
              <div>
                <p><strong>เลขที่คำขอ:</strong> ENG-LV-{String(request.id).padStart(5, "0")}</p>
                <p><strong>เขียนที่:</strong> คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม</p>
              </div>
              <div className="text-right">
                <p><strong>วันที่ยื่นคำขอ:</strong> {formatThaiDate(request.created_at || new Date())}</p>
              </div>
            </div>

            {/* Salutation */}
            <div className="mb-4 text-xs sm:text-sm text-slate-800 print:text-black">
              <p><strong>เรื่อง:</strong> ขออนุญาต{request.leave_type_name}</p>
              <p className="mt-1"><strong>เรียน:</strong> คณบดีคณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม (ผ่านหัวหน้าสาขาวิชา)</p>
            </div>

            {/* Body Content */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-800 print:text-black leading-relaxed indent-8 text-justify">
              <p>
                ข้าพเจ้า <strong>{reqUser.full_name || request.full_name || "บุคลากร"}</strong> รหัสประจำตัว{" "}
                <strong>{reqUser.employee_code || request.employee_code || "-"}</strong> ตำแหน่ง{" "}
                <strong>{reqUser.position || request.position || "อาจารย์/บุคลากร"}</strong> สังกัด{" "}
                <strong>{reqUser.department_name || request.department_name || "คณะวิศวกรรมศาสตร์"}</strong> มีความประสงค์ขอ{" "}
                <strong>{request.leave_type_name}</strong> เนื่องจาก <strong>{request.reason || "มีภารกิจจำเป็น"}</strong>
              </p>
              <p>
                โดยขอลาตั้งแต่วันที่ <strong>{formatThaiDate(request.start_date)}</strong> ถึงวันที่{" "}
                <strong>{formatThaiDate(request.end_date)}</strong> มีกำหนด <strong>{request.days_count} วันทำการ</strong>
              </p>
              <p>
                ในระหว่างการลานี้ ข้าพเจ้าสามารถติดต่อได้ที่เบอร์โทรศัพท์ <strong>{reqUser.phone || request.phone || "08x-xxx-xxxx"}</strong> หรืออีเมล{" "}
                <strong>{reqUser.email || request.email || "-"}</strong>
              </p>
            </div>

            {/* Applicant Signature */}
            <div className="mt-8 flex justify-end text-xs sm:text-sm text-slate-800 print:text-black">
              <div className="text-center w-64">
                <div className="h-10"></div>
                <p className="border-b border-dotted border-slate-400 pb-1 font-semibold">
                  ( {reqUser.full_name || request.full_name || "...................................................."} )
                </p>
                <p className="mt-1 text-xs text-slate-600 print:text-black">ผู้ขอลา (ลงนามอิเล็กทรอนิกส์)</p>
                <p className="text-xs text-slate-500 print:text-black mt-0.5">
                  วันที่ {formatThaiDate(request.created_at || new Date())}
                </p>
              </div>
            </div>

            {/* Approvals Section / Sign-off Boxes */}
            <div className="mt-8 pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Box 1: Head of Department */}
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 print:bg-transparent">
                <p className="font-bold text-slate-900 print:text-black mb-2">๑. ความเห็นของหัวหน้าสาขาวิชา</p>
                <div className="space-y-1 text-slate-700 print:text-black">
                  <p className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-slate-400 inline-block bg-slate-800"></span>
                    <span>เห็นควรอนุญาต</span>
                  </p>
                  <p className="text-slate-600 print:text-black text-[11px] italic mt-1">
                    "ได้ตรวจสอบตารางปฏิบัติงานและภาระงานแล้ว ไม่กระทบต่อการเรียนการสอน"
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <p className="font-semibold text-slate-800 print:text-black">
                    {request.approver_name || "หัวหน้าสาขาวิชา"}
                  </p>
                  <p className="text-[11px] text-slate-500 print:text-black">หัวหน้าสาขาวิชา</p>
                </div>
              </div>

              {/* Box 2: Dean / Final Order */}
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 print:bg-transparent relative overflow-hidden">
                {isApproved && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold border border-emerald-300 print:border-black print:text-black">
                    <CheckCircle className="w-3 h-3" />
                    <span>อนุมัติในระบบแล้ว</span>
                  </div>
                )}
                <p className="font-bold text-slate-900 print:text-black mb-2">๒. คำสั่งคณบดี / ผู้มีอำนาจ</p>
                <div className="space-y-1 text-slate-700 print:text-black">
                  <p className="flex items-center gap-1.5 font-semibold text-emerald-800 print:text-black">
                    <span className="w-3 h-3 rounded-full border border-emerald-600 inline-block bg-emerald-600 print:bg-black"></span>
                    <span>{isApproved ? "อนุมัติ" : "รอการอนุมัติ"}</span>
                  </p>
                  {request.approved_at && (
                    <p className="text-[11px] text-slate-500 print:text-black mt-1">
                      อนุมัติเมื่อ: {formatThaiDateTime(request.approved_at)}
                    </p>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <p className="font-semibold text-slate-800 print:text-black">
                    {request.approver_name || "คณบดีคณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม"}
                  </p>
                  <p className="text-[11px] text-slate-500 print:text-black">
                    คณบดีคณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม
                  </p>
                </div>
              </div>
            </div>

            {/* Form Footer Stamp */}
            <div className="mt-8 text-center text-[10px] text-slate-400 print:text-slate-600 border-t border-slate-100 pt-3">
              เอกสารนี้สร้างขึ้นโดยระบบสารสนเทศบุคลากรและการลางานออนไลน์ มหาวิทยาลัยกาฬสินธุ์ (Electronic Form Verified)
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar (Hidden on Print) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl text-xs shadow-md shadow-red-900/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ พิมพ์เอกสาร / ดาวน์โหลด PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
