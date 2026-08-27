const bcrypt = require("bcrypt");
const pool = require("../config/db");

/**
 * GET /employees?search=&department_id=&position=&role=
 */
async function getAll(req, res) {
  const { search, department_id, position, role: filterRole } = req.query;
  const { role, department_id: myDept } = req.user;

  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(u.full_name ILIKE $${values.length} OR u.position ILIKE $${values.length} OR u.employee_code ILIKE $${values.length} OR u.email ILIKE $${values.length})`
    );
  }

  if (department_id) {
    values.push(department_id);
    conditions.push(`u.department_id = $${values.length}`);
  } else if (role === "head") {
    // Head เห็นเฉพาะคนในสาขาตัวเอง (หรือหากไม่มีสาขาให้เห็นของตนเอง)
    if (myDept) {
      values.push(myDept);
      conditions.push(`u.department_id = $${values.length}`);
    }
  }

  if (position) {
    values.push(`%${position}%`);
    conditions.push(`u.position ILIKE $${values.length}`);
  }

  if (filterRole) {
    values.push(filterRole);
    conditions.push(`u.role = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const result = await pool.query(
      `SELECT u.id, u.employee_code, u.full_name, u.email, u.department_id, d.name AS department_name, 
              u.position, u.role, u.phone, u.profile_image, u.created_at
       FROM users u
       LEFT JOIN departments d ON d.id = u.department_id
       ${whereClause} 
       ORDER BY u.id ASC`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function getById(req, res) {
  try {
    const result = await pool.query(
      `SELECT u.id, u.employee_code, u.full_name, u.email, u.department_id, d.name AS department_name,
              u.position, u.role, u.phone, u.profile_image, u.created_at
       FROM users u
       LEFT JOIN departments d ON d.id = u.department_id
       WHERE u.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบบุคลากร" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function getDepartments(req, res) {
  try {
    const result = await pool.query(
      `SELECT d.*, u.full_name AS head_name, COUNT(users_in_dept.id) AS employee_count
       FROM departments d
       LEFT JOIN users u ON u.id = d.head_user_id
       LEFT JOIN users users_in_dept ON users_in_dept.department_id = d.id
       GROUP BY d.id, u.full_name
       ORDER BY d.name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลสาขา" });
  }
}

async function create(req, res) {
  const {
    employee_code,
    full_name,
    email,
    password,
    department_id,
    position,
    role,
    phone,
  } = req.body;

  try {
    const password_hash = await bcrypt.hash(password || "changeme123", 10);

    const result = await pool.query(
      `INSERT INTO users (employee_code, full_name, email, password_hash, department_id, position, role, phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, employee_code, full_name, email, department_id, position, role, phone`,
      [employee_code, full_name, email, password_hash, department_id || null, position, role || 'lecturer', phone]
    );

    const newUser = result.rows[0];
    const currentYear = new Date().getFullYear();

    // Auto-create default leave_balances for the new user
    await pool.query(
      `INSERT INTO leave_balances (user_id, leave_type_id, year, total_days, used_days)
       SELECT $1, id, $2, max_days_per_year, 0
       FROM leave_types
       ON CONFLICT (user_id, leave_type_id, year) DO NOTHING`,
      [newUser.id, currentYear]
    );

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ message: "อีเมลหรือรหัสพนักงานนี้มีอยู่แล้วในระบบ" });
    }
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function update(req, res) {
  const { employee_code, full_name, email, department_id, position, role, phone, password } = req.body;

  try {
    let updateQuery = `UPDATE users SET full_name=$1, department_id=$2, position=$3, role=$4, phone=$5, updated_at=NOW()`;
    const values = [full_name, department_id || null, position, role, phone];

    if (employee_code) {
      values.push(employee_code);
      updateQuery += `, employee_code=$${values.length}`;
    }
    if (email) {
      values.push(email);
      updateQuery += `, email=$${values.length}`;
    }
    if (password && password.trim().length > 0) {
      const password_hash = await bcrypt.hash(password, 10);
      values.push(password_hash);
      updateQuery += `, password_hash=$${values.length}`;
    }

    values.push(req.params.id);
    updateQuery += ` WHERE id=$${values.length} RETURNING id, employee_code, full_name, email, department_id, position, role, phone`;

    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบบุคลากร" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ message: "อีเมลหรือรหัสพนักงานนี้มีอยู่แล้วในระบบ" });
    }
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function remove(req, res) {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "ลบข้อมูลบุคลากรเรียบร้อยแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

module.exports = { getAll, getById, getDepartments, create, update, remove };
