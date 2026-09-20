import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Talent from '../models/Talent.js';
import Booking from '../models/Booking.js';
import { auth, allow } from '../middleware/auth.js';
import { saveTalentPhoto } from '../services/imageStorage.js';

const r = Router();
r.use(auth, allow('admin'));

r.get('/stats', async (req, res) => {
  const [users, staff, customers, talents, bookings, pending] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'talent' }),
    User.countDocuments({ role: 'customer' }),
    Talent.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
  ]);
  res.json({ users, staff, customers, talents, bookings, pending });
});

r.get('/users', async (req, res) => {
  res.json(await User.find().select('-passwordHash').sort({ createdAt: -1 }));
});

r.patch('/users/:id', async (req, res) => {
  const safe = {};
  if (typeof req.body.isActive === 'boolean') safe.isActive = req.body.isActive;
  if (['customer', 'talent', 'admin'].includes(req.body.role)) safe.role = req.body.role;
  const user = await User.findByIdAndUpdate(req.params.id, safe, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

r.get('/talents', async (req, res) => {
  res.json(await Talent.find().populate('owner', 'name username email isActive').sort({ createdAt: -1 }));
});



r.post('/talents', async (req, res) => {
  let createdUser = null;
  try {
    const { name, username, password, email, phone, city, displayName, roles, skills, bio, ratePerShift, photoData, verified, published } = req.body;
    if (!name || !username || !password || password.length < 3 || !city || !displayName || !ratePerShift) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ tên, username, mật khẩu, thành phố, tên hiển thị và giá.' });
    }
    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = (email || `${cleanUsername}@lunatalent.local`).toLowerCase().trim();
    const exists = await User.exists({ $or: [{ username: cleanUsername }, { email: cleanEmail }] });
    if (exists) return res.status(409).json({ message: 'Username hoặc email đã tồn tại.' });

    createdUser = await User.create({
      name: name.trim(), username: cleanUsername, email: cleanEmail,
      passwordHash: await bcrypt.hash(password, 12), role: 'talent', phone, city, isActive: true,
    });
    const baseSlug = displayName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || cleanUsername;
    let slug = baseSlug; let n = 1;
    while (await Talent.exists({ slug })) slug = `${baseSlug}-${++n}`;
    const talent = await Talent.create({
      owner: createdUser._id, slug, displayName: displayName.trim(), city: city.trim(),
      roles: Array.isArray(roles) ? roles : String(roles || '').split(',').map(x => x.trim()).filter(Boolean),
      skills: Array.isArray(skills) ? skills : String(skills || '').split(',').map(x => x.trim()).filter(Boolean),
      bio: bio || '', ratePerShift: Number(ratePerShift), photos: photoData ? [await saveTalentPhoto(photoData)] : [],
      verified: !!verified, published: published !== false,
    });
    res.status(201).json({ user: { id: createdUser._id, username: createdUser.username }, talent });
  } catch (e) {
    if (createdUser) await User.findByIdAndDelete(createdUser._id).catch(() => {});
    res.status(400).json({ message: e.message });
  }
});

r.patch('/talents/:id/photo', async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);
    if (!talent) return res.status(404).json({ message: 'Talent not found' });
    if (!req.body.photoData) return res.status(400).json({ message: 'Vui lòng chọn ảnh mới.' });
    const photoUrl = await saveTalentPhoto(req.body.photoData);
    talent.photos = [photoUrl];
    await talent.save();
    res.json({ success: true, photo: photoUrl, talent });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

r.patch('/talents/:id', async (req, res) => {
  const talent = await Talent.findById(req.params.id);
  if (!talent) return res.status(404).json({ message: 'Talent not found' });
  const safe = ['displayName','city','roles','skills','bio','ratePerShift','photos','verified','published'];
  for (const k of safe) if (k in req.body) talent[k] = req.body[k];
  await talent.save();
  res.json(talent);
});

r.delete('/talents/:id', async (req, res) => {
  const talent = await Talent.findById(req.params.id);
  if (!talent) return res.status(404).json({ message: 'Talent not found' });
  const owner = talent.owner;
  await Booking.deleteMany({ talent: talent._id });
  await Talent.deleteOne({ _id: talent._id });
  if (owner) await User.deleteOne({ _id: owner, role: 'talent' });
  res.json({ success: true });
});

r.get('/bookings', async (req, res) => {
  res.json(await Booking.find()
    .populate('customer', 'name email phone')
    .populate({ path: 'talent', select: 'displayName city owner', populate: { path: 'owner', select: 'name email' } })
    .sort({ createdAt: -1 }));
});

export default r;
