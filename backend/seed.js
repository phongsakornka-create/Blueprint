/**
 * Seed data สำหรับระบบจัดการข้อมูลและลางาน คณะวิศวกรรมศาสตร์
 * คำสั่งรัน: node seed.js
 */
require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./src/config/db");

async function seed() {
  try {
    console.log("กำลังเริ่มสร้างข้อมูลตั้งต้น (Seed Data)...");

    // 1. เพิ่มประเภทการลา (Leave Types)
    await pool.query(`
      INSERT INTO leave_types (id, name, max_days_per_year) VALUES
        (1, 'ลาป่วย', 30),
        (2, 'ลากิจ', 10),
        (3, 'ลาพักร้อน', 10)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, max_days_per_year = EXCLUDED.max_days_per_year;
    `);
    await pool.query(`SELECT setval('leave_types_id_seq', (SELECT MAX(id) FROM leave_types));`);

    // 2. เพิ่มสาขาวิชา (Departments)
    await pool.query(`
      INSERT INTO departments (id, name) VALUES
        (1, 'ภาควิชาวิศวกรรมคอมพิวเตอร์'),
        (2, 'ภาควิชาวิศวกรรมไฟฟ้า'),
        (3, 'ภาควิชาวิศวกรรมโยธา'),
        (4, 'ภาควิชาวิศวกรรมเครื่องกล'),
        (5, 'ภาควิชาวิศวกรรมอุตสาหการ')
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
    `);
    await pool.query(`SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));`);

    // 3. สร้างรหัสผ่าน Hash สำหรับบัญชีทดสอบ
    const pwAdmin = await bcrypt.hash("admin1234", 10);
    const pwHead = await bcrypt.hash("head1234", 10);
    const pwStaff = await bcrypt.hash("staff1234", 10);
    const pwUser = await bcrypt.hash("user1234", 10);

    // 4. เพิ่มผู้ใช้งาน (Users) ครอบคลุม 4 ระดับสิทธิ์
    const users = [
      {
        code: "ENG-ADM01",
        name: "ผู้ดูแลระบบ คณะวิศวกรรมศาสตร์",
        email: "admin@eng.ac.th",
        password: pwAdmin,
        dept_id: 1,
        position: "ผู้อำนวยการฝ่ายเทคโนโลยีสารสนเทศ",
        role: "admin",
        phone: "02-123-4567",
      },
      {
        code: "ENG-STF01",
        name: "นางสาวสมศรี จัดการงาน",
        email: "staff@eng.ac.th",
        password: pwStaff,
        dept_id: null,
        position: "เจ้าหน้าที่บริหารงานทั่วไป (งานบุคคล)",
        role: "staff",
        phone: "02-123-4568",
      },
      {
        code: "ENG-HOD01",
        name: "รศ.ดร.วิศวกิจ นวัตกรรม",
        email: "head.cpe@eng.ac.th",
        password: pwHead,
        dept_id: 1,
        position: "หัวหน้าภาควิชาวิศวกรรมคอมพิวเตอร์",
        role: "head",
        phone: "081-234-5678",
      },
      {
        code: "ENG-HOD02",
        name: "ศ.ดร.ธนากร ไฟฟ้าพลังงาน",
        email: "head.ee@eng.ac.th",
        password: pwHead,
        dept_id: 2,
        position: "หัวหน้าภาควิชาวิศวกรรมไฟฟ้า",
        role: "head",
        phone: "082-345-6789",
      },
      {
        code: "ENG-LEC01",
        name: "ผศ.ดร.สมชาย ปัญญาประดิษฐ์",
        email: "somchai.cpe@eng.ac.th",
        password: pwUser,
        dept_id: 1,
        position: "อาจารย์ประจำภาควิชาวิศวกรรมคอมพิวเตอร์",
        role: "lecturer",
        phone: "083-456-7890",
      },
      {
        code: "ENG-LEC02",
        name: "อ.ดร.สุดา สัญญาณอัจฉริยะ",
        email: "suda.ee@eng.ac.th",
        password: pwUser,
        dept_id: 2,
        position: "อาจารย์ประจำภาควิชาวิศวกรรมไฟฟ้า",
        role: "lecturer",
        phone: "084-567-8901",
      },
      {
        code: "ENG-LEC03",
        name: "ผศ.อนันต์ โครงสร้างมั่นคง",
        email: "anant.ce@eng.ac.th",
        password: pwUser,
        dept_id: 3,
        position: "อาจารย์ประจำภาควิชาวิศวกรรมโยธา",
        role: "lecturer",
        phone: "085-678-9012",
      },
      {
        code: "ENG-LEC04",
        name: "อ.วิชัย ยานยนต์พลังงานใหม่",
        email: "wichai.me@eng.ac.th",
        password: pwUser,
        dept_id: 4,
        position: "อาจารย์ประจำภาควิชาวิศวกรรมเครื่องกล",
        role: "lecturer",
        phone: "086-789-0123",
      },
    ];

    for (const u of users) {
      await pool.query(
        `INSERT INTO users (employee_code, full_name, email, password_hash, department_id, position, role, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (email) DO UPDATE 
         SET full_name = EXCLUDED.full_name,
             department_id = EXCLUDED.department_id,
             position = EXCLUDED.position,
             role = EXCLUDED.role,
             phone = EXCLUDED.phone,
             password_hash = EXCLUDED.password_hash`,
        [u.code, u.name, u.email, u.password, u.dept_id, u.position, u.role, u.phone]
      );
    }

    // อัปเดต head_user_id ใน departments
    const headCPE = await pool.query("SELECT id FROM users WHERE email = 'head.cpe@eng.ac.th'");
    const headEE = await pool.query("SELECT id FROM users WHERE email = 'head.ee@eng.ac.th'");
    if (headCPE.rows[0]) {
      await pool.query("UPDATE departments SET head_user_id = $1 WHERE id = 1", [headCPE.rows[0].id]);
    }
    if (headEE.rows[0]) {
      await pool.query("UPDATE departments SET head_user_id = $1 WHERE id = 2", [headEE.rows[0].id]);
    }

    // 5. เพิ่มข้อมูลยอดวันลา (Leave Balances) สำหรับปีปัจจุบันและปีก่อนหน้า
    const allUsers = await pool.query("SELECT id FROM users");
    const currentYear = new Date().getFullYear();

    for (const u of allUsers.rows) {
      for (let y = currentYear - 1; y <= currentYear; y++) {
        await pool.query(
          `INSERT INTO leave_balances (user_id, leave_type_id, year, total_days, used_days)
           SELECT $1, id, $2, max_days_per_year, 0
           FROM leave_types
           ON CONFLICT (user_id, leave_type_id, year) DO NOTHING`,
          [u.id, y]
        );
      }
    }

    // ปรับยอดวันลาตัวอย่างบางคน
    const somchai = await pool.query("SELECT id FROM users WHERE email = 'somchai.cpe@eng.ac.th'");
    if (somchai.rows[0]) {
      await pool.query(
        `UPDATE leave_balances SET used_days = 2 WHERE user_id = $1 AND leave_type_id = 1 AND year = $2`,
        [somchai.rows[0].id, currentYear]
      );
      await pool.query(
        `UPDATE leave_balances SET used_days = 1 WHERE user_id = $1 AND leave_type_id = 2 AND year = $2`,
        [somchai.rows[0].id, currentYear]
      );
    }

    // 6. เพิ่มตัวอย่างคำขอลา (Leave Requests)
    const adminUser = await pool.query("SELECT id FROM users WHERE email = 'admin@eng.ac.th'");
    const headCPEUser = await pool.query("SELECT id FROM users WHERE email = 'head.cpe@eng.ac.th'");
    const adminId = adminUser.rows[0]?.id;
    const headCPEId = headCPEUser.rows[0]?.id;

    if (somchai.rows[0]) {
      const somchaiId = somchai.rows[0].id;
      // คำขอรออนุมัติ (Pending)
      await pool.query(`
        INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, days_count, reason, status)
        VALUES 
          (${somchaiId}, 3, CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '6 days', 2, 'พักผ่อนประจำปีกับครอบครัว', 'pending'),
          (${somchaiId}, 1, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '9 days', 2, 'มีไข้หวัด ปวดศีรษะ (มีใบรับรองแพทย์)', 'approved')
      `);
    }

    const suda = await pool.query("SELECT id FROM users WHERE email = 'suda.ee@eng.ac.th'");
    if (suda.rows[0]) {
      const sudaId = suda.rows[0].id;
      await pool.query(`
        INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, days_count, reason, status)
        VALUES 
          (${sudaId}, 2, CURRENT_DATE, CURRENT_DATE, 1, 'ติดต่อราชการทำหนังสือเดินทางเพื่อเข้าร่วมสัมมนาวิชาการ', 'approved')
      `);
    }

    // 7. เพิ่มประกาศข่าวสาร (Announcements)
    await pool.query(`
      INSERT INTO announcements (title, content, posted_by) VALUES
        ('ประกาศปฏิทินวันหยุดราชการและการปฏิบัติงานประจำภาคการศึกษา', 'ขอความร่วมมือคณาจารย์และบุคลากรทุกท่านตรวจสอบปฏิทินการปฏิบัติงานและกำหนดการยื่นขออนุมัติต่างๆ ประจำภาคเรียนผ่านระบบออนไลน์', ${adminId}),
        ('เปิดรับสมัครข้อเสนอโครงการวิจัยเพื่อขอรับทุนสนับสนุน ประจำปีงบประมาณ', 'ฝ่ายวิจัยและนวัตกรรม คณะวิศวกรรมศาสตร์ ขอเชิญชวนอาจารย์และนักวิจัยยื่นข้อเสนอโครงการวิจัยเพื่อขอรับทุนสนับสนุน สามารถดาวน์โหลดแบบฟอร์มได้ที่เมนูคลังเอกสาร', ${adminId}),
        ('การส่งเสริมระบบสำนักงานไร้กระดาษ (Paperless) ภายในคณะวิศวกรรมศาสตร์', 'คณะวิศวกรรมศาสตร์ได้พัฒนาระบบยื่นคำขอลางานและจัดเก็บข้อมูลบุคลากรออนไลน์ เพื่อลดขั้นตอนการใช้กระดาษและเพิ่มความสะดวกรวดเร็วในการทำงาน', ${adminId})
    `);

    // 8. เพิ่มเอกสารตัวอย่าง (Documents)
    await pool.query(`
      INSERT INTO documents (user_id, title, file_url, category) VALUES
        (${adminId}, 'แบบฟอร์มขออนุมัติเดินทางไปปฏิบัติงานและประชุมวิชาการ', '/uploads/sample-travel-form.pdf', 'แบบฟอร์มการลาและขออนุมัติ'),
        (${adminId}, 'คู่มือการใช้งานระบบสารสนเทศบุคลากรและลางานออนไลน์', '/uploads/manual-hr-system.pdf', 'คู่มือและระเบียบข้อบังคับ'),
        (${adminId}, 'ระเบียบมหาวิทยาลัยว่าด้วยการลาของบุคลากร', '/uploads/leave-regulation.pdf', 'คู่มือและระเบียบข้อบังคับ'),
        (${adminId}, 'แบบฟอร์มขอรับทุนสนับสนุนการวิจัยและตีพิมพ์ผลงาน', '/uploads/research-fund-form.docx', 'เอกสารงานวิจัยและวิชาการ')
    `);

    // 9. เพิ่มการแจ้งเตือนตัวอย่าง (Notifications)
    if (headCPEId) {
      await pool.query(`
        INSERT INTO notifications (user_id, type, message, is_read) VALUES
          (${headCPEId}, 'leave_request', 'มีคำขอลาพักร้อนใหม่จาก ผศ.ดร.สมชาย ปัญญาประดิษฐ์ รอการอนุมัติ', false)
      `);
    }

    console.log("✅ สร้างข้อมูล Seed สำเร็จเรียบร้อยสมบูรณ์!");
    console.log("=========================================");
    console.log("รายชื่อบัญชีทดสอบ:");
    console.log("1. Admin: admin@eng.ac.th (รหัสผ่าน: admin1234)");
    console.log("2. Staff: staff@eng.ac.th (รหัสผ่าน: staff1234)");
    console.log("3. Head:  head.cpe@eng.ac.th (รหัสผ่าน: head1234)");
    console.log("4. User:  somchai.cpe@eng.ac.th (รหัสผ่าน: user1234)");
    console.log("=========================================");
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการ seed:", err.message);
  } finally {
    await pool.end();
  }
}

seed();
