import { formatThaiDate, formatThaiDateTime } from "./dateUtils";

/**
 * ส่งออกรายงานการลางานเป็นไฟล์ CSV / Excel พร้อมรองรับภาษาไทย 100% (UTF-8 BOM)
 */
export function exportLeaveRequestsToCSV(requests, filename = "รายงานการลางาน_คณะวิศวกรรมศาสตร์_มกส.csv") {
  if (!requests || requests.length === 0) {
    alert("ไม่พบข้อมูลคำขอลาสำหรับส่งออกรายงาน");
    return;
  }

  // Header คอลัมน์
  const headers = [
    "ลำดับ",
    "รหัสคำขอ",
    "รหัสพนักงาน",
    "ชื่อ-นามสกุล",
    "ตำแหน่ง",
    "ภาควิชา/สาขาวิชา",
    "ประเภทการลา",
    "วันที่เริ่มลา",
    "วันที่สิ้นสุดลา",
    "จำนวนวันลา",
    "เหตุผลความจำเป็น",
    "สถานะคำขอ",
    "ผู้อนุมัติ",
    "วันที่อนุมัติ",
    "วันที่ยื่นคำขอ",
  ];

  const statusMap = {
    pending: "รอการอนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่อนุมัติ",
  };

  const rows = requests.map((req, idx) => {
    const user = req.user || {};
    return [
      idx + 1,
      `ENG-LV-${String(req.id).padStart(5, "0")}`,
      `"${req.employee_code || user.employee_code || "-"}"`,
      `"${req.full_name || user.full_name || "-"}"`,
      `"${req.position || user.position || "-"}"`,
      `"${req.department_name || user.department_name || "-"}"`,
      `"${req.leave_type_name || "-"}"`,
      `"${formatThaiDate(req.start_date)}"`,
      `"${formatThaiDate(req.end_date)}"`,
      req.days_count || 0,
      `"${(req.reason || "").replace(/"/g, '""')}"`,
      `"${statusMap[req.status] || req.status}"`,
      `"${req.approver_name || "-"}"`,
      `"${req.approved_at ? formatThaiDateTime(req.approved_at) : "-"}"`,
      `"${req.created_at ? formatThaiDateTime(req.created_at) : "-"}"`,
    ];
  });

  // ใส่ \uFEFF นำหน้าเพื่อให้ Excel เปิดภาษาไทยได้ถูกต้อง 100% ไม่เพี้ยน
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
