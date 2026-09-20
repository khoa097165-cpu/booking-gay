import mongoose from 'mongoose';
const schema=new mongoose.Schema( {
  user: {
    type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
  }
  ,talent: {
    type:mongoose.Schema.Types.ObjectId,ref:'Talent',required:true
  }
}
, {
  timestamps:true
}
);
schema.index( {
  user:1,talent:1
}
, {
  unique:true
}
);
export default mongoose.model('Favorite',schema);
