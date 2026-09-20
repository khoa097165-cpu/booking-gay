import {
  Router
}
from 'express';
import Talent from '../models/Talent.js';
import {
  auth,allow
}
from '../middleware/auth.js';
const r=Router();
r.get('/',async(req,res)=> {
  const {
    q,city,role
  }
  =req.query;
  const f= {
    published:true
  }
  ;
  if(city)f.city=new RegExp(`^${city}$`,'i');
  if(role)f.roles=new RegExp(role,'i');
  if(q)f.$text= {
    $search:q
  }
  ;
  res.json(await Talent.find(f).sort( {
    verified:-1,createdAt:-1
  }
  ).limit(100));
}
);
r.get('/:slug',async(req,res)=> {
  const t=await Talent.findOne( {
    slug:req.params.slug,published:true
  }
  );
  if(!t)return res.status(404).json( {
    message:'Talent not found'
  }
  );
  res.json(t);
}
);
r.post('/',auth,allow('talent','admin'),async(req,res)=> {
  const t=await Talent.create( {
    ...req.body,owner:req.user._id,published:req.user.role==='admin'&&!!req.body.published
  }
  );
  res.status(201).json(t);
}
);
r.patch('/:id',auth,async(req,res)=> {
  const t=await Talent.findById(req.params.id);
  if(!t)return res.sendStatus(404);
  if(req.user.role!=='admin'&&String(t.owner)!==String(req.user._id))return res.sendStatus(403);
  const safe=['displayName','city','roles','skills','bio','ratePerShift','photos','availability'];
  for(const k of safe)if(k in req.body)t[k]=req.body[k];
  if(req.user.role==='admin') {
    if('verified'in req.body)t.verified=!!req.body.verified;
    if('published'in req.body)t.published=!!req.body.published;
  }
  await t.save();
  res.json(t);
}
);
export default r;
