const pool = require("../config/db");

async function getAll(req, res) {
  try {
    const result = await pool.query(
      `SELECT a.*, u.full_name AS posted_by_name
       FROM announcements a
       LEFT JOIN users u ON u.id = a.posted_by
       ORDER BY a.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function create(req, res) {
  const { title, content, image_url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO announcements (title, content, posted_by, image_url)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [title, content, req.user.id, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function update(req, res) {
  const { title, content, image_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE announcements SET title=$1, content=$2, image_url=$3 WHERE id=$4 RETURNING *`,
      [title, content, image_url, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบประกาศ" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

async function remove(req, res) {
  try {
    await pool.query("DELETE FROM announcements WHERE id = $1", [req.params.id]);
    res.json({ message: "ลบประกาศแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

module.exports = { getAll, create, update, remove };
