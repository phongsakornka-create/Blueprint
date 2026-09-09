import React from "react";
import { Printer, X, Building, FileText, CheckCircle2, ShieldCheck, Download } from "lucide-react";
import { formatThaiDate } from "../utils/dateUtils";

export default function OfficialTemplateViewerModal({ isOpen, onClose, doc, user }) {
  if (!isOpen || !doc) return null;

  const handlePrint = () => {
    window.print();
  };

  const title = doc.title || "";
  const category = doc.category || "";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">{title}</h3>
              <p className="text-[11px] text-slate-300">แบบฟอร์มทางราชการ • มหาวิทยาลัยกาฬสินธุ์</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร / บันทึก PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Paper Container */}
        <div className="p-6 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible print:text-black font-sans leading-relaxed text-slate-800">
          <div className="border border-slate-300 p-8 sm:p-12 rounded-2xl bg-white print:border-none print:p-0 shadow-xs">
            
            {/* 1. แบบฟอร์มขออนุมัติเดินทางไปปฏิบัติงาน / ประชุมวิชาการ */}
            {title.includes("เดินทาง") || title.includes("ประชุม") ? (
              <div className="space-y-6 text-xs sm:text-sm">
                <div className="text-center border-b-2 border-slate-800 pb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building className="w-7 h-7 text-red-900 print:text-black" />
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 print:text-black">
                      บันทึกข้อความ (แบบขออนุมัติเดินทางไปปฏิบัติงานและประชุมวิชาการ)
                    </h1>
                  </div>
                  <h2 className="text-xs font-semibold text-slate-700 print:text-black">
                    คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยกาฬสินธุ์
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 print:text-black">
                  <p><strong>หน่วยงาน:</strong> ภาควิชาวิศวกรรมคอมพิวเตอร์ / สำนักงานคณบดี</p>
                  <p className="text-right"><strong>วันที่:</strong> {formatThaiDate(new Date())}</p>
                  <p><strong>เรื่อง:</strong> ขออนุมัติเดินทางไปปฏิบัติงาน ประชุมวิชาการ และนำเสนอผลงานวิจัย</p>
                  <p className="text-right"><strong>เรียน:</strong> คณบดีคณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม</p>
                </div>

                <div className="space-y-3 leading-relaxed text-justify text-slate-800 print:text-black indent-8">
                  <p>
                    ด้วยข้าพเจ้า <strong>{user?.full_name || "...................................................."}</strong> ตำแหน่ง <strong>{user?.position || "อาจารย์ประจำภาควิชา"}</strong> มีความประสงค์จะเดินทางไปปฏิบัติราชการเพื่อเข้าร่วมประชุมวิชาการระดับชาติ/นานาชาติ ณ ............................................................................ ระหว่างวันที่ ............................................. ถึงวันที่ ............................................. รวมระยะเวลา ................... วัน
                  </p>
                  <p>
                    ในการนี้ ข้าพเจ้าได้ดำเนินการจัดตารางสอนชดเชยและมอบหมายงานในหน้าที่ให้อาจารย์ ................................................................ ปฏิบัติหน้าที่แทนเรียบร้อยแล้ว โดยไม่กระทบต่อการจัดการเรียนการสอนและภารกิจของทางราชการ
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div className="border border-slate-300 p-4 rounded-xl text-center">
                    <p className="font-bold text-slate-800 mb-6">ความเห็นของหัวหน้าสาขาวิชา</p>
                    <p>( ................................................................ )</p>
                    <p className="text-[11px] text-slate-500 mt-1">หัวหน้าสาขาวิชา</p>
                  </div>
                  <div className="border border-slate-300 p-4 rounded-xl text-center">
                    <p className="font-bold text-slate-800 mb-6">คำสั่งคณบดี / ผู้มีอำนาจอนุมัติ</p>
                    <p>( ................................................................ )</p>
                    <p className="text-[11px] text-slate-500 mt-1">คณบดีคณะวิศวกรรมศาสตร์ฯ</p>
                  </div>
                </div>
              </div>
            ) : 

            /* 2. แบบใบลาพักผ่อน / ลากิจส่วนตัว / ลาป่วย */
            title.includes("ลา") || title.includes("พักผ่อน") || title.includes("ป่วย") ? (
              <div className="space-y-6 text-xs sm:text-sm">
                <div className="text-center border-b-2 border-slate-800 pb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building className="w-7 h-7 text-red-900 print:text-black" />
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 print:text-black">
                      แบบใบลา (ลาป่วย • ลากิจส่วนตัว • ลาพักผ่อน)
                    </h1>
                  </div>
                  <h2 className="text-xs font-semibold text-slate-700 print:text-black">
                    คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยกาฬสินธุ์
                  </h2>
                </div>

                <div className="flex justify-between text-xs text-slate-700 print:text-black">
                  <div>
                    <p><strong>เขียนที่:</strong> มหาวิทยาลัยกาฬสินธุ์</p>
                  </div>
                  <div className="text-right">
                    <p><strong>วันที่:</strong> {formatThaiDate(new Date())}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-800 print:text-black">
                  <p><strong>เรื่อง:</strong> ขออนุญาตลา ( [ ] ลาป่วย &nbsp;&nbsp; [ ] ลากิจส่วนตัว &nbsp;&nbsp; [ ] ลาพักผ่อน )</p>
                  <p className="mt-1"><strong>เรียน:</strong> คณบดีคณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม (ผ่านหัวหน้าสาขาวิชา)</p>
                </div>

                <div className="space-y-3 leading-relaxed text-justify text-slate-800 print:text-black indent-8">
                  <p>
                    ข้าพเจ้า <strong>{user?.full_name || "...................................................."}</strong> รหัสประจำตัว <strong>{user?.employee_code || "......................."}</strong> ตำแหน่ง <strong>{user?.position || "อาจารย์ประจำสาขาวิชา"}</strong> สังกัด <strong>{user?.department_name || "คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม"}</strong>
                  </p>
                  <p>
                    มีความประสงค์ขอลาเนื่องจาก .................................................................................................................................... ตั้งแต่วันที่ ........................................ ถึงวันที่ ........................................ มีกำหนด ........... วันทำการ
                  </p>
                  <p>
                    ในระหว่างการลานี้ ข้าพเจ้าสามารถติดต่อได้ที่เบอร์โทรศัพท์ <strong>{user?.phone || "...................................................."}</strong> อีเมล <strong>{user?.email || "................................@ksu.ac.th"}</strong>
                  </p>
                </div>

                {/* Balance Table */}
                <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-center">
                    <thead className="bg-slate-100 print:bg-transparent border-b border-slate-300 font-bold">
                      <tr>
                        <th className="p-2 border-r border-slate-300">ประเภทการลา</th>
                        <th className="p-2 border-r border-slate-300">สิทธิ์วันลาปีนี้</th>
                        <th className="p-2 border-r border-slate-300">ลามาแล้ว (วัน)</th>
                        <th className="p-2 border-r border-slate-300">ลาครั้งนี้ (วัน)</th>
                        <th className="p-2">คงเหลือ (วัน)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-semibold">ลาพักผ่อนประจำปี</td>
                        <td className="p-2 border-r border-slate-300">๑๐</td>
                        <td className="p-2 border-r border-slate-300">........</td>
                        <td className="p-2 border-r border-slate-300">........</td>
                        <td className="p-2">........</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-semibold">ลาป่วย / ลากิจ</td>
                        <td className="p-2 border-r border-slate-300">๓๐ / ๑๐</td>
                        <td className="p-2 border-r border-slate-300">........</td>
                        <td className="p-2 border-r border-slate-300">........</td>
                        <td className="p-2">........</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="pt-6 grid grid-cols-2 gap-4 text-xs">
                  <div className="border border-slate-300 p-4 rounded-xl text-center">
                    <p className="font-bold text-slate-800 mb-6">ความเห็นของหัวหน้าสาขาวิชา</p>
                    <p className="mb-1">[ ] เห็นควรอนุญาต &nbsp;&nbsp; [ ] ไม่เห็นควรอนุญาต</p>
                    <p className="mt-4">( ................................................................ )</p>
                    <p className="text-[11px] text-slate-500 mt-1">หัวหน้าสาขาวิชา</p>
                  </div>
                  <div className="border border-slate-300 p-4 rounded-xl text-center">
                    <p className="font-bold text-slate-800 mb-6">คำสั่งคณบดีคณะวิศวกรรมศาสตร์ฯ</p>
                    <p className="mb-1">[ ] อนุมัติ &nbsp;&nbsp; [ ] ไม่อนุมัติ</p>
                    <p className="mt-4">( ................................................................ )</p>
                    <p className="text-[11px] text-slate-500 mt-1">คณบดีคณะวิศวกรรมศาสตร์ฯ</p>
                  </div>
                </div>
              </div>
            ) : 

            /* 3. เอกสารระเบียบ / วิจัย / คู่มือ */
            (
              <div className="space-y-6 text-xs sm:text-sm">
                <div className="text-center border-b-2 border-slate-800 pb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building className="w-7 h-7 text-red-900 print:text-black" />
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 print:text-black">
                      {title}
                    </h1>
                  </div>
                  <h2 className="text-xs font-semibold text-slate-700 print:text-black">
                    มหาวิทยาลัยกาฬสินธุ์ • คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม
                  </h2>
                </div>

                <div className="p-4 bg-slate-50 print:bg-transparent rounded-xl border border-slate-200 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900">หมวดหมู่: {category}</p>
                  <p className="text-slate-700">
                    เอกสารนี้เป็นเอกสารและแบบฟอร์มมาตรฐานของคณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยกาฬสินธุ์ สำหรับให้อาจารย์ บุคลากร และเจ้าหน้าที่ใช้ในการดำเนินงานทางราชการ
                  </p>
                </div>

                <div className="space-y-3 leading-relaxed text-justify text-slate-800 print:text-black">
                  <h3 className="font-bold text-slate-900 text-sm">สาระสำคัญและข้อปฏิบัติ:</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 print:text-black">
                    <li>บุคลากรสามารถยื่นคำขอและติดตามสถานะได้ผ่านระบบสารสนเทศออนไลน์ตลอด ๒๔ ชั่วโมง</li>
                    <li>การยื่นขออนุมัติลางานล่วงหน้าควรดำเนินการก่อนวันเดินทางอย่างน้อย ๓ วันทำการ</li>
                    <li>เอกสารนี้ได้รับการรับรองความถูกต้องตามระเบียบมหาวิทยาลัยกาฬสินธุ์ ว่าด้วยการบริหารงานบุคคล</li>
                  </ul>
                </div>

                <div className="pt-8 text-center text-xs text-slate-500 border-t border-slate-200">
                  <p>ฝ่ายบริหารงานบุคคลและเทคโนโลยีสารสนเทศ คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม</p>
                  <p className="text-[11px] mt-0.5">มหาวิทยาลัยกาฬสินธุ์ • www.ksu.ac.th</p>
                </div>
              </div>
            )}

            {/* Verification Footer */}
            <div className="mt-8 text-center text-[10px] text-slate-400 print:text-slate-600 border-t border-slate-100 pt-3">
              เอกสารอิเล็กทรอนิกส์ คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยกาฬสินธุ์ (Official Electronic Paperless System)
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
            <span>🖨️ สั่งพิมพ์เอกสาร / ดาวน์โหลด PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
