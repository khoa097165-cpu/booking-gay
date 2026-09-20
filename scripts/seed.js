import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import User from '../models/User.js';
import Talent from '../models/Talent.js';

await connectDB();

const accounts = [
  { name: 'Luna Admin', username: 'admin', email: 'admin@lunatalent.vn', password: '123', role: 'admin', city: 'Hồ Chí Minh' },
  { name: 'Mai Anh', username: 'nhanvien', email: 'staff@lunatalent.vn', password: '123', role: 'talent', city: 'Hồ Chí Minh' },
  { name: 'Khách Demo', username: 'khachhang', email: 'customer@lunatalent.vn', password: '123', role: 'customer', city: 'Hồ Chí Minh' },
];

const seeded = {};
for (const a of accounts) {
  const passwordHash = await bcrypt.hash(a.password, 12);
  seeded[a.role] = await User.findOneAndUpdate(
    { email: a.email },
    { name: a.name, username: a.username, email: a.email, passwordHash, role: a.role, city: a.city, isActive: true },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

const rows = [
  ['mai-anh', 'Mai Anh', 'Hồ Chí Minh', ['Hostess', 'Event Talent'], 2200000, seeded.talent._id],
  ['linh-chi', 'Linh Chi', 'Hà Nội', ['MC', 'Hostess'], 2600000, null],
  ['thao-vy', 'Thảo Vy', 'Đà Nẵng', ['Model', 'Event Talent'], 2100000, null],
];

for (const [slug, displayName, city, roles, ratePerShift, owner] of rows) {
  await Talent.findOneAndUpdate(
    { slug },
    {
      slug,
      displayName,
      city,
      roles,
      skills: ['Giao tiếp', 'Sự kiện'],
      bio: 'Hồ sơ demo cho Luna Talent.',
      ratePerShift,
      verified: true,
      published: true,
      ...(owner ? { owner } : {}),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

console.log('Seed completed.');
console.log('Admin:    admin / 123');
console.log('Nhân viên: nhanvien / 123');
console.log('Khách:    khachhang / 123');
await mongoose.disconnect();
