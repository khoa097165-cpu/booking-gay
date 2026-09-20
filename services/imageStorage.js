import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
const ready = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (ready) cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
const localDir = path.join(process.cwd(), 'uploads', 'talents');
fs.mkdirSync(localDir, { recursive: true });
export async function saveTalentPhoto(data) {
  if (!data) return null;
  const m = String(data).match(/^data:image\/(jpeg|png|webp);base64,(.+)$/);
  if (!m) throw new Error('Ảnh không hợp lệ. Chỉ hỗ trợ JPG, PNG, WEBP.');
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 5 * 1024 * 1024) throw new Error('Ảnh tối đa 5MB.');
  if (ready) {
    const result = await cloudinary.uploader.upload(data, { folder: 'luna-talent/talents', resource_type: 'image' });
    return result.secure_url;
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Thiếu cấu hình Cloudinary trên Render.');
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  fs.writeFileSync(path.join(localDir, name), buf);
  return `/uploads/talents/${name}`;
}
