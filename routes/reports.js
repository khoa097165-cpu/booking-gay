import {
  Router
}
from 'express';
import Report from '../models/Report.js';
import {
  auth,allow
}
from '../middleware/auth.js';
const r=Router();
r.post('/',auth,async(req,res)=>res.status(201).json(await Report.create( {
  ...req.body,reporter:req.user._id
}
)));
r.get('/',auth,allow('admin'),async(req,res)=>res.json(await Report.find().populate('reporter','name email').sort( {
  createdAt:-1
}
)));
export default r;
