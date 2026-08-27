import { useState, useEffect } from "react";
import { documentService } from "../services/documentService";
import { useAuth } from "../context/AuthContext";
import { formatThaiDate } from "../utils/dateUtils";
import Modal from "../components/Modal";
import {
  FolderArchive,
  Upload,
  Search,
  Download,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Printer,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    category: "แบบฟอร์มการลาและขออนุมัติ",
    file: null,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const categories = [
    { id: "all", label: "ทั้งหมด" },
    { id: "แบบฟอร์มการลาและขออนุมัติ", label: "แบบฟอร์มการลา/ขออนุมัติ" },
    { id: "คู่มือและระเบียบข้อบังคับ", label: "คู่มือ/ระเบียบข้อบังคับ" },
    { id: "เอกสารงานวิจัยและวิชาการ", label: "งานวิจัยและวิชาการ" },
    { id: "คำสั่งและประกาศคณะ", label: "คำสั่งและประกาศคณะ" },
    { id: "เอกสารทั่วไป", label: "เอกสารทั่วไป" },
  ];

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentService.getDocuments({
        search: search || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
      });
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDocuments();
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      setMessage({ text: "กรุณาเลือกไฟล์เอกสารที่ต้องการอัปโหลด", type: "error" });
      return;
    }

    setActionLoading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("title", uploadData.title || uploadData.file.name);
    formData.append("category", uploadData.category);
    formData.append("file", uploadData.file);

    try {
      await documentService.uploadDocument(formData);
      setMessage({ text: "อัปโหลดเอกสารเข้าสู่ระบบสำเร็จ (Paperless)", type: "success" });
      setIsUploadOpen(false);
      setUploadData({ title: "", category: "แบบฟอร์มการลาและขออนุมัติ", file: null });
      loadDocuments();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "เกิดข้อผิดพลาดในการอัปโหลดเอกสาร",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await documentService.deleteDocument(id);
      setMessage({ text: "ลบเอกสารเรียบร้อยแล้ว", type: "success" });
      setDeleteConfirmId(null);
      loadDocuments();
    } catch (err) {
      setMessage({ text: "ไม่สามารถลบเอกสารได้", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const getFullDocUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>คลังเอกสารและแบบฟอร์มทางการ (Paperless)</span>
            <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
              แบบราชการ
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            ศูนย์รวมแบบฟอร์ม บันทึกข้อความ ระเบียบข้อบังคับ และเอกสารทางการ คณะวิศวกรรมศาสตร์
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl text-sm shadow-md shadow-red-900/20 transition self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          อัปโหลดเอกสารใหม่
        </button>
      </div>

      {/* Notification Toast */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ text: "", type: "" })} className="text-xs font-semibold underline">
            ปิด
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อเอกสาร หรือแบบฟอร์มทางการ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl"
          >
            ค้นหา
          </button>
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
              selectedCategory === cat.id
                ? "bg-red-800 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <FolderArchive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">ไม่พบเอกสารในหมวดหมู่นี้</h3>
          <p className="text-xs text-slate-600 mt-1">สามารถอัปโหลดเอกสารใหม่เข้าสู่ระบบได้ทันที</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-red-50 text-red-800 shrink-0 shadow-2xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">
                      {doc.category || "เอกสารทั่วไป"}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1 leading-snug">
                      {doc.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p>ผู้อัปโหลด: <strong className="text-slate-800">{doc.owner_name || "ผู้ดูแลระบบ คณะวิศวกรรมศาสตร์"}</strong></p>
                  <p>วันที่บันทึก: {formatThaiDate(doc.uploaded_at)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={getFullDocUrl(doc.file_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    เปิดดู & สั่งพิมพ์
                  </a>

                  <a
                    href={getFullDocUrl(doc.file_url)}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    ดาวน์โหลด
                  </a>
                </div>

                {(user?.role === "admin" || user?.id === doc.user_id) && (
                  <button
                    onClick={() => setDeleteConfirmId(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="ลบเอกสาร"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="อัปโหลดเอกสารใหม่ (Paperless)"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              หมวดหมู่เอกสาร <span className="text-red-500">*</span>
            </label>
            <select
              value={uploadData.category}
              onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            >
              <option value="แบบฟอร์มการลาและขออนุมัติ">แบบฟอร์มการลาและขออนุมัติ</option>
              <option value="คู่มือและระเบียบข้อบังคับ">คู่มือและระเบียบข้อบังคับ</option>
              <option value="เอกสารงานวิจัยและวิชาการ">เอกสารงานวิจัยและวิชาการ</option>
              <option value="คำสั่งและประกาศคณะ">คำสั่งและประกาศคณะ</option>
              <option value="เอกสารทั่วไป">เอกสารทั่วไป</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">ชื่อเอกสาร / รายละเอียด</label>
            <input
              type="text"
              placeholder="หากเว้นว่างจะใช้ชื่อไฟล์เดิม"
              value={uploadData.title}
              onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              เลือกไฟล์เอกสาร (PDF, Word, Excel, รูปภาพ) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              required
              onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-800 file:text-white hover:file:bg-red-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              {actionLoading ? "กำลังอัปโหลด..." : "ยืนยันอัปโหลด"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="ยืนยันการลบเอกสาร"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-900">คุณต้องการลบเอกสารนี้ใช่หรือไม่?</p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => handleDelete(deleteConfirmId)}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
            >
              {actionLoading ? "กำลังลบ..." : "ยืนยันการลบ"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
