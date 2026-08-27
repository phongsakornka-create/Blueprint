import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { leaveService } from "../services/leaveService";
import { LeaveStatusBadge } from "../components/Badge";
import Modal from "../components/Modal";
import { formatThaiDate, formatThaiDateTime } from "../utils/dateUtils";
import {
  History,
  FilePlus2,
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function LeaveHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getMyLeaveRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ประวัติการลางานของฉัน</h1>
          <p className="text-sm text-slate-600 mt-1">
            รายการคำขอลางานทั้งหมด สถานะการพิจารณา และประวัติการอนุมัติ
          </p>
        </div>

        <Link
          to="/leave-request"
          className="flex items-center gap-2 px-4 py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl text-sm shadow-md shadow-red-900/20 transition self-start sm:self-auto"
        >
          <FilePlus2 className="w-4 h-4" />
          ยื่นคำขอลาใหม่
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "ทั้งหมด" },
          { id: "pending", label: "รอการอนุมัติ" },
          { id: "approved", label: "อนุมัติแล้ว" },
          { id: "rejected", label: "ไม่อนุมัติ" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
              filterStatus === tab.id
                ? "bg-red-800 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label} (
            {tab.id === "all" ? requests.length : requests.filter((r) => r.status === tab.id).length}
            )
          </button>
        ))}
      </div>

      {/* Requests Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">ไม่มีรายการคำขอลางาน</h3>
          <p className="text-xs text-slate-600 mt-1">ยังไม่มีรายการคำขอในหมวดหมู่นี้</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="px-5 py-4">วันที่ยื่นคำขอ</th>
                  <th className="px-5 py-4">ประเภทการลา</th>
                  <th className="px-5 py-4">ช่วงวันที่ลา</th>
                  <th className="px-5 py-4">จำนวนวัน</th>
                  <th className="px-5 py-4">เหตุผล</th>
                  <th className="px-5 py-4">สถานะ</th>
                  <th className="px-5 py-4 text-right">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {formatThaiDateTime(req.created_at)}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{req.leave_type_name}</td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-700">
                      {formatThaiDate(req.start_date)} - {formatThaiDate(req.end_date)}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-800">{req.days_count} วัน</td>
                    <td className="px-5 py-4 text-slate-600 text-xs max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="px-5 py-4">
                      <LeaveStatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="p-1.5 text-slate-500 hover:text-red-800 hover:bg-slate-100 rounded-lg transition"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Detail Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="รายละเอียดคำขอลางาน"
        maxWidth="max-w-lg"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-600 block">ประเภทการลา</span>
                <span className="text-base font-bold text-slate-900">
                  {selectedRequest.leave_type_name}
                </span>
              </div>
              <LeaveStatusBadge status={selectedRequest.status} className="scale-110" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 block">ช่วงวันที่ลา</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formatThaiDate(selectedRequest.start_date)} - {formatThaiDate(selectedRequest.end_date)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 block">จำนวนวันที่ขอลา</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {selectedRequest.days_count} วัน
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                <span className="text-slate-600 block">เหตุผลความจำเป็น</span>
                <span className="font-medium text-slate-800 mt-1 block">
                  {selectedRequest.reason || "-"}
                </span>
              </div>
            </div>

            {selectedRequest.attachment_url && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  <span>เอกสารแนบประกอบคำขอ</span>
                </div>
                <a
                  href={selectedRequest.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-700 hover:underline"
                >
                  เปิดดูเอกสาร
                </a>
              </div>
            )}

            {/* Approval Info */}
            {selectedRequest.status === "approved" && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ได้รับการอนุมัติเรียบร้อยแล้ว
                </p>
                <p className="mt-1">
                  ผู้อนุมัติ: {selectedRequest.approver_name || "ผู้มีอำนาจอนุมัติ"} (เมื่อ{" "}
                  {formatThaiDateTime(selectedRequest.approved_at)})
                </p>
              </div>
            )}

            {selectedRequest.status === "rejected" && (
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900">
                <p className="font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  คำขอลาไม่ได้รับการอนุมัติ
                </p>
                <p className="mt-1 font-semibold text-rose-800">
                  เหตุผล: {selectedRequest.reject_reason || "ไม่ได้ระบุเหตุผล"}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
