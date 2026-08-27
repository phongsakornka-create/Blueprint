# ระบบจัดการข้อมูลคณะวิศวกรรมศาสตร์

โปรเจกต์นี้มี 2 ส่วน:
- **`backend/`** — Node.js + Express + PostgreSQL (REST API)
- **`frontend/`** — React + Vite + Tailwind CSS v4 + React Router

---

## 1) ตั้งค่า Backend

```bash
cd backend
npm install
```

**สร้างฐานข้อมูล PostgreSQL** (เปิด psql หรือ pgAdmin):
```sql
CREATE DATABASE engineering_db;
```

**รัน schema** เข้าไปในฐานข้อมูล (ตั้ง encoding เป็น UTF8 ก่อนถ้าใช้ psql):
```bash
psql -U postgres -d engineering_db -f schema.sql
```

**ตั้งค่า `.env`** — คัดลอก `.env.example` เป็น `.env` แล้วใส่รหัสผ่าน PostgreSQL ของคุณ:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=รหัสผ่านของคุณ
DB_NAME=engineering_db
JWT_SECRET=เปลี่ยนเป็นข้อความสุ่มยาวๆ
```

**สร้างบัญชี admin คนแรก:**
```bash
node seed.js
```
จะได้บัญชี `admin@eng.ac.th` / `admin1234`

**รัน server:**
```bash
npm run dev
```
เปิดที่ `http://localhost:5000`

---

## 2) ตั้งค่า Frontend

```bash
cd frontend
npm install
```

**ตั้งค่า `.env`** — คัดลอก `.env.example` เป็น `.env` (ค่า default ใช้ได้เลยถ้า backend รันที่ port 5000):
```
VITE_API_URL=http://localhost:5000/api
```

**รัน dev server:**
```bash
npm run dev
```
เปิดที่ `http://localhost:5173` แล้ว login ด้วย `admin@eng.ac.th` / `admin1234`

---

## โครงสร้างสิทธิ์การใช้งาน (Role)

| Role | ค่าที่ใช้ในระบบ |
|---|---|
| อาจารย์ | `lecturer` |
| หัวหน้าสาขา | `head` |
| เจ้าหน้าที่ | `staff` |
| Admin | `admin` |

ดูรายละเอียด permission matrix เต็มๆ ได้ที่ `frontend/src/utils/permissions.js`

---

## หมายเหตุ

- บัญชี admin ที่ seed ไว้ยังไม่มีข้อมูลใน `leave_balances` — ต้อง insert ข้อมูลวันลาคงเหลือเพิ่มเองผ่าน pgAdmin/psql ก่อนถึงจะเห็นยอดวันลาในหน้า "ยื่นขอลา"
- หน้า Dashboard, Employees, LeaveHistory, LeaveApproval, LeaveCalendar, Announcements, Documents ยังเป็นหน้าโครงร่าง (placeholder) รอเติมเนื้อหาต่อ — มีแค่ Login และ LeaveRequest ที่เชื่อม backend สมบูรณ์แล้ว
