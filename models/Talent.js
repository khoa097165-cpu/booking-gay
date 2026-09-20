import mongoose from 'mongoose';
const schema = new mongoose.Schema( {
  owner: {
    type:mongoose.Schema.Types.ObjectId,ref:'User'
  }
  ,
  slug: {
    type:String,required:true,unique:true,lowercase:true,trim:true,index:true
  }
  ,
  displayName: {
    type:String,required:true,trim:true,maxlength:80
  }
  ,
  city: {
    type:String,required:true,trim:true,index:true
  }
  ,
  roles:[ {
    type:String,trim:true
  }
  ], skills:[ {
    type:String,trim:true
  }
  ],
  bio: {
    type:String,maxlength:1200
  }
  , ratePerShift: {
    type:Number,required:true,min:0
  }
  ,
  photos:[ {
    type:String
  }
  ], verified: {
    type:Boolean,default:false
  }
  , published: {
    type:Boolean,default:false,index:true
  }
  ,
  availability:[ {
    date: {
      type:Date,required:true
    }
    ,start: {
      type:String
    }
    ,end: {
      type:String
    }
  }
  ]
}
, {
  timestamps:true
}
);
schema.index( {
  displayName:'text',city:'text',roles:'text',skills:'text'
}
);
export default mongoose.model('Talent',schema);
