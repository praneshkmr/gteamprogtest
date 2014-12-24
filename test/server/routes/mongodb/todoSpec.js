var Todo = require("../../../../routes/mongodb/todo");

describe("TodoApp MongoDB CRUD", function () {
    var name = "Complete Todo App",
            priority = 2,
            due_date = "2014-12-24T18:01:56.293Z",
            user = "54987a3403a374e806583245";
    var _id = null;
    
    it("should create a new todo", function (done) {
        Todo.addTodo(name,priority,due_date,user,function(err,todo){
            expect(err).toBeNull();
            expect(todo).not.toBeNull();
            expect(todo._id).not.toBeUndefined();
            _id = todo._id
            done();
        })
    });
    
    it("should find a todo", function (done) {
        Todo.findTodo(_id,user,function(err,todo){
            expect(err).toBeNull();
            expect(todo).not.toBeNull();
            done();
        });
    });
    
    it("should find todo for a particular user", function (done) {
        Todo.findTodosByUserId(user,function(err,todos){
            expect(err).toBeNull();
            expect(todos).not.toBeNull();
            expect(todos.length).toBe(1);
            done();
        });
    });
    
    it("should update a todo", function (done) {
        Todo.updateTodo(_id,user,{ completed : true },function(err,todo){
            expect(err).toBeNull();
            expect(todo).not.toBeNull();
            expect(todo.completed).toBe(true);
            done();
        });
    });
    
    it("should delete a todo", function (done) {
        Todo.deleteTodo(_id,user,function(err,todo){
            expect(err).toBeNull();
            Todo.findTodo(_id,user,function(err,todo){
                expect(err).toBeNull();
                expect(todo).toBeNull();
                done();
            });
        })
    });
});