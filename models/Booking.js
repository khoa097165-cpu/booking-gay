import mongoose from 'mongoose';
const schema = new mongoose.Schema( {
  customer: {
    type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true
  }
  ,
  talent: {
    type:mongoose.Schema.Types.ObjectId,ref:'Talent',required:true,index:true
  }
  ,
  eventType: {
    type:String,required:true,trim:true
  }
  , eventDate: {
    type:Date,required:true,index:true
  }
  ,
  startTime: {
    type:String,required:true
  }
  , durationHours: {
    type:Number,required:true,min:1,max:12
  }
  ,
  venue: {
    type:String,required:true,trim:true,maxlength:250
  }
  , brief: {
    type:String,required:true,maxlength:1500
  }
  ,
  status: {
    type:String,enum:['pending','confirmed','completed','cancelled','declined'],default:'pending',index:true
  }
  ,
  quotedAmount: {
    type:Number,min:0
  }
  , statusHistory:[ {
    status:String,at: {
      type:Date,default:Date.now
    }
    ,by: {
      type:mongoose.Schema.Types.ObjectId,ref:'User'
    }
  }
  ]
}
, {
  timestamps:true
}
);
export default mongoose.model('Booking',schema);
