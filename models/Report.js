import mongoose from 'mongoose';
const schema=new mongoose.Schema( {
  reporter: {
    type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
  }
  ,booking: {
    type:mongoose.Schema.Types.ObjectId,ref:'Booking'
  }
  ,category: {
    type:String,trim:true
  }
  ,details: {
    type:String,required:true,maxlength:2000
  }
  ,status: {
    type:String,enum:['open','reviewing','closed'],default:'open'
  }
}
, {
  timestamps:true
}
);
export default mongoose.model('Report',schema);
