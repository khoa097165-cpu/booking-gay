import {
  Router
}
from 'express';
import Favorite from '../models/Favorite.js';
import {
  auth
}
from '../middleware/auth.js';
const r=Router();
r.use(auth);
r.get('/',async(req,res)=>res.json(await Favorite.find( {
  user:req.user._id
}
).populate('talent')));
r.post('/:talent',async(req,res)=> {
  const x=await Favorite.findOneAndUpdate( {
    user:req.user._id,talent:req.params.talent
  }
  , {
    user:req.user._id,talent:req.params.talent
  }
  , {
    upsert:true,new:true
  }
  );
  res.status(201).json(x);
}
);
r.delete('/:talent',async(req,res)=> {
  await Favorite.deleteOne( {
    user:req.user._id,talent:req.params.talent
  }
  );
  res.sendStatus(204);
}
);
export default r;
