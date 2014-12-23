var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name : String,
    email : String,
    password : String,
    created_at : { type: Date },
    updated_at : { type: Date }
});

mongoose.model('User',UserSchema);

var TodoSchema = new Schema({
    name : String,
    due_date : { type: Date },
    priority : String,
    completed : { type: Boolean , default : false },
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    created_at : { type: Date },
    updated_at : { type: Date }
});

mongoose.model('Todo',TodoSchema);

var MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/gteamfzprogtest' ;
mongoose.connect(MONGO_URI,function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + MONGO_URI + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + MONGO_URI);
  }
})