var mongoose = require('mongoose');
require('./schemas');
var Todo = mongoose.model('Todo');

exports.addTodo = function(name,priority,due_date,user,callback){
    var now = new Date();
    var todo = new Todo({
        name : name,
        priority : priority,
        due_date : due_date,
        completed : false,
        user : user,
        created_at : now,
        updated_at : now
    });
    todo.save(function(err,todo){
        if (err) {
            console.log("Error Creating Todo");
            console.log(err);
            callback(err);
        }
        else{
            callback(null,todo);
        }
    });
}

exports.findTodo = function(_id, user_id, callback){
    Todo.findOne({ _id : _id , user : user_id },function(err,todo){
        if (err) {
            console.log("Error Finding Todo");
            console.error(err);
            callback(err);
        }
        else {
            callback(null,todo);
        }
    });
}

exports.findTodosByUserId = function( user_id, callback){
    Todo.find({ user : user_id },function(err,todos){
        if (err) {
            console.log("Error Finding Todos by User id");
            console.error(err);
            callback(err);
        }
        else {
            callback(null,todos);
        }
    });
}

exports.updateTodo = function(_id, user_id, data, callback){
    Todo.findOneAndUpdate({ _id : _id , user : user_id }, data, function(err,todo){
        if (err) {
            console.log("Error Updating Todo");
            console.error(err);
            callback(err);
        }
        else {
            callback(null,todo);
        }
    });
}

exports.deleteTodo = function(_id, user_id, callback){
    Todo.findOneAndRemove({ _id : _id , user : user_id }, function(err,todo){
        if (err) {
            console.log("Error Deleting Todo");
            console.error(err);
            callback(err);
        }
        else {
            callback(null,todo);
        }
    });
}