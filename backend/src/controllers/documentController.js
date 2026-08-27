const pool = require("../config/db");

/**
 * GET /documents?search=&category=&user_id=
 * ขอบเขตข้อมูลตาม role ทำใน route middleware ไม่ใช่ที่นี่ (ดู routes/documents.js)
 */
async function getAll(req, res) {
  const { search, category, user_id } = req.query;

  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }
  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }
  if (user_id) {
    values.push(user_id);
    conditions.push(`user_id = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const result = await pool.query(
      `SELECT d.*, u.full_name AS owner_name
       FROM documents d
       LEFT JOIN users u ON u.id = d.user_id
       ${whereClause}
       ORDER BY d.uploaded_at DESC`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function upload(req, res) {
  const { title, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "กรุณาแนบไฟล์" });
  }

  const file_url = `/uploads/${req.file.filename}`;

  try {
    const result = await pool.query(
      `INSERT INTO documents (user_id, title, file_url, category)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, title || req.file.originalname, file_url, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function remove(req, res) {
  try {
    await pool.query("DELETE FROM documents WHERE id = $1", [req.params.id]);
    res.json({ message: "ลบเอกสารแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

module.exports = { getAll, upload, remove };
