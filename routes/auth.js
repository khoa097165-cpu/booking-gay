import {
  Router
}
from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  auth
}
from '../middleware/auth.js';
const r=Router();
const token=u=>jwt.sign( {
  sub:u._id.toString(),role:u.role
}
,process.env.JWT_SECRET, {
  expiresIn:'7d'
}
);
r.post('/register',async(req,res)=> {
  try {
    const {
      name,username,email,password,city,phone
    }
    =req.body;
    if(!name||!username||!email||!password||password.length<3)return res.status(400).json( {
      message:'Name, username, email and password required'
    }
    );
    const exists=await User.exists({ $or: [
      { username: username.toLowerCase() },
      { email: email.toLowerCase() }
    ] });
    if(exists)return res.status(409).json( {
      message:'Username or email already registered'
    }
    );
    const u=await User.create( {
      name,username:username.toLowerCase(),email,passwordHash:await bcrypt.hash(password,12),city,phone
    }
    );
    res.status(201).json( {
      token:token(u),user: {
        id:u._id,name:u.name,username:u.username,email:u.email,role:u.role
      }
    }
    );
  } catch(e) {
    res.status(400).json( {
      message:e.message
    }
    );
  }
}
);
r.post('/login',async(req,res)=> {
  const u=await User.findOne({
    username:(req.body.username||'').toLowerCase()
  }
  ).select('+passwordHash');
  if(!u||!await bcrypt.compare(req.body.password||'',u.passwordHash))return res.status(401).json( {
    message:'Invalid credentials'
  }
  );
  res.json( {
    token:token(u),user: {
      id:u._id,name:u.name,username:u.username,email:u.email,role:u.role
    }
  }
  );
}
);
r.get('/me',auth,(req,res)=>res.json( {
  id:req.user._id,name:req.user.name,username:req.user.username,email:req.user.email,role:req.user.role,city:req.user.city
}
));
export default r;
