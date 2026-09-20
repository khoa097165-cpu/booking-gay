import { Router } from 'express';
import Talent from '../models/Talent.js';
import Booking from '../models/Booking.js';
import { auth, allow } from '../middleware/auth.js';

const r = Router();
r.use(auth, allow('talent'));

r.get('/profile', async (req, res) => {
  const profile = await Talent.findOne({ owner: req.user._id });
  res.json(profile);
});

r.patch('/profile', async (req, res) => {
  let profile = await Talent.findOne({ owner: req.user._id });
  if (!profile) return res.status(404).json({ message: 'Talent profile not found' });
  const safe = ['displayName', 'city', 'roles', 'skills', 'bio', 'ratePerShift', 'photos', 'availability'];
  for (const key of safe) if (key in req.body) profile[key] = req.body[key];
  await profile.save();
  res.json(profile);
});

r.get('/bookings', async (req, res) => {
  const profile = await Talent.findOne({ owner: req.user._id });
  if (!profile) return res.json([]);
  res.json(await Booking.find({ talent: profile._id }).populate('customer', 'name email phone').sort({ createdAt: -1 }));
});

export default r;
