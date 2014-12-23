var mongoose = require('mongoose');
require('./schemas');
var User = mongoose.model('User');

exports.addUser = function(name,email,password,callback){
    var now = new Date();
    var u =  new User({
        name : name,
        email : email,
        password : password,
        created_at : now,
        updated_at : now
    });
    u.save(function(err,user){
        if (err) {
            console.log("Error Adding User : ",err);
            callback(err);
        }
        else{
            callback(null,user);
        }
    });
}

exports.findUserById = function(id,callback){
    User.findById(id,function(err,user){
        if (err) {
            console.log("Error Getting User By Id : ",err);
            callback(err);
        }
        else{
            callback(null,user);
        }
    });
};

exports.findUserByEmail = function(email,callback){
    User.findOne({ email : email },function(err,user){
        if (err) {
            console.log("Error Getting User By Email : ",err);
            callback(err);
        }
        else{
            callback(null,user);
        }
    });
};