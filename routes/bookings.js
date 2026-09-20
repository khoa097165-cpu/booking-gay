import { Router } from 'express';
import Booking from '../models/Booking.js';
import Talent from '../models/Talent.js';
import { auth } from '../middleware/auth.js';

const r = Router();
r.use(auth);

r.get('/', async (req, res) => {
  let filter = { customer: req.user._id };
  if (req.user.role === 'admin') filter = {};
  if (req.user.role === 'talent') {
    const profile = await Talent.findOne({ owner: req.user._id });
    filter = profile ? { talent: profile._id } : { _id: null };
  }
  res.json(await Booking.find(filter)
    .populate('customer', 'name email phone')
    .populate('talent', 'displayName slug city photos owner')
    .sort({ createdAt: -1 }));
});

r.post('/', async (req, res) => {
  if (req.user.role !== 'customer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only customers can create bookings' });
  }
  const t = await Talent.findOne({ _id: req.body.talent, published: true });
  if (!t) return res.status(404).json({ message: 'Talent unavailable' });
  const b = await Booking.create({
    talent: t._id,
    customer: req.user._id,
    eventType: req.body.eventType,
    eventDate: req.body.eventDate,
    startTime: req.body.startTime,
    durationHours: req.body.durationHours,
    venue: req.body.venue,
    brief: req.body.brief,
    status: 'pending',
    quotedAmount: req.body.quotedAmount ?? t.ratePerShift,
    statusHistory: [{ status: 'pending', by: req.user._id }],
  });
  res.status(201).json(b);
});

r.patch('/:id/status', async (req, res) => {
  const b = await Booking.findById(req.params.id).populate('talent');
  if (!b) return res.sendStatus(404);
  const owner = String(b.talent?.owner) === String(req.user._id);
  const customer = String(b.customer) === String(req.user._id);
  const next = req.body.status;
  const allowed = req.user.role === 'admin' || owner || (customer && next === 'cancelled');
  if (!allowed) return res.sendStatus(403);
  if (!['confirmed', 'completed', 'cancelled', 'declined'].includes(next)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  b.status = next;
  b.statusHistory.push({ status: next, by: req.user._id });
  await b.save();
  res.json(b);
});

export default r;
