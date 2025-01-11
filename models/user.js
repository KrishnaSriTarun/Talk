const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema =new Schema(
      {
            email:{
                  type: String,
                  required: true,
                  unique: true, 
                  match: [/.+\@.+\..+/, 'Please fill a valid email address'],
            },
            profile:{
                  type: String,
                  default:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
                  set: (v) =>
                        v === ""
                        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                        : v,
            },
            followers:[
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                  },
            ],
            following:[
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                  },
            ],
      }
)
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
