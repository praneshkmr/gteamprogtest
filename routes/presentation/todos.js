var express = require('express');
var async = require('async');
var router = express.Router();
var todo = require('./../mongodb/todo');

var jwt = require('jwt-simple');
var jwt_secret = "hello_world";

router.use(function(req, res, next) {
    var auth_header = req.headers['authorization'];
    if (auth_header || auth_header.split(" ")[1] == null) {
        var token = auth_header.split(" ")[1];
        if (token) {
            try {
                var decoded = jwt.decode(token, jwt_secret);
                if (decoded.exp <= Date.now()) {
                    res.status(401).send({ status : "failure" , message : "Access token has expired" });
                }
                else{
                    req.user = {};
                    req.user._id = decoded.iss;
                    next();
                }
            } catch (err) {
                next();
            }
        } else {
            next();
        }
    }
    else{
        res.status(401).send({ status : "failure" , message : "Unauthorized" });
    }
});

router.post('/',function(req,res){
    if (req.user && req.user._id && req.body.name && req.body.priority && req.body.due_date ) {
        var user_id = req.user._id;
        todo.addTodo( req.body.name, req.body.priority, req.body.due_date, user_id, function(err,todo){
            if (err) {
                res.status(500).send({ status : "failure" , message : err.message });
            }
            if (todo) {
                res.send({ status : "success" , todo : todo });
            }
        });
    }
    else{
        res.status(400).send({ status : "failure" , message : "Bad Request" });
    }
});

router.get('/',function(req,res){
    if (req.user && req.user._id ) {
        var user_id = req.user._id;
        todo.findTodosByUserId( user_id, function(err,todos){
            if (err) {
                res.status(500).send({ status : "failure" , message : err.message });
            }
            if (todos) {
                res.send(todos);
            }
        });
    }
    else{
        res.status(400).send({ status : "failure" , message : "Bad Request" });
    }
});

router.get('/:id' , function(req,res){
    if (req.params.id && req.user && req.user._id) {
        var id = req.params.id;
        var user_id = req.user._id;
        todo.findTodo(id,user_id,function(err,tdo){
            if (err) {
                res.status(500).send({ status : "failure" , message : err.message });
            }
            if (tdo) {
                res.send(tdo);
            }
            else{
                res.send(404).end();
            }
        });
    }
    else{
        res.send(400).end();
    }
});

router.put('/:id' , function(req,res){
    if (req.params.id && req.user && req.user._id && req.body.name && req.body.priority && req.body.due_date && (req.body.completed != null) ) {
        var id = req.params.id;
        var user_id = req.user._id;
        var data = { name : req.body.name , priority : req.body.priority , due_date : req.body.due_date , completed : req.body.completed}
        todo.updateTodo(id,user_id,data,function(err,tdo){
            if (err) {
                res.status(500).send({ status : "failure" , message : err.message });
            }
            if (tdo) {
                res.send(tdo);
            }
            else{
                res.send(404).end();
            }
        });
    }
    else{
        res.send(400).end();
    }
});

router.delete('/:id' , function(req,res){
    if (req.params.id && req.user && req.user._id) {
        var id = req.params.id;
        var user_id = req.user._id;
        todo.deleteTodo(id,user_id,function(err,tdo){
            if (err) {
                res.status(500).send({ status : "failure" , message : err.message });
            }
            else{
                res.send(tdo);
            }
        });
    }
    else{
        res.send(400).end();
    }
});

module.exports = router;