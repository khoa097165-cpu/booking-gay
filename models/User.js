import mongoose from 'mongoose';
const schema = new mongoose.Schema( {
  name: {
    type:String,required:true,trim:true,maxlength:80
  }
  ,
  username: {
    type:String,required:true,unique:true,lowercase:true,trim:true,index:true
  }
  ,
  email: {
    type:String,required:true,unique:true,lowercase:true,trim:true,index:true
  }
  ,
  passwordHash: {
    type:String,required:true,select:false
  }
  ,
  role: {
    type:String,enum:['customer','talent','admin'],default:'customer'
  }
  ,
  phone: {
    type:String,trim:true
  }
  , city: {
    type:String,trim:true
  }
  ,
  isActive: {
    type:Boolean,default:true
  }
}
, {
  timestamps:true
}
);
export default mongoose.model('User',schema);
