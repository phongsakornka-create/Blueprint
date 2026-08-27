-- Migration: เพิ่มการรองรับ Google Sign-In
-- รันไฟล์นี้ถ้าคุณสร้างฐานข้อมูลจาก schema.sql ไปแล้วก่อนหน้านี้
-- (ถ้าเพิ่งสร้างฐานข้อมูลใหม่จาก schema.sql ล่าสุด ไม่ต้องรันไฟล์นี้ซ้ำ)
--
-- วิธีรัน: \i C:/path/to/backend/migrations/001_add_google_login.sql

ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
