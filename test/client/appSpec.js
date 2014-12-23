describe("TodoApp module", function () {
    
    beforeEach(module("TodoApp"));
 
    describe("SignInController", function () {
        var scope,
            controller;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller;
        }));

        it("should assign text to sign in", function () {
            controller("SignInController", {$scope: scope});
            expect(scope.text).toBe("sign in");
        });
    });
    
    describe("TodosController", function () {
        var scope, controller;
        
        beforeEach(angular.mock.inject(function ($injector) {
            scope = $injector.get('$rootScope');
            controller = $injector.get('$controller');
            $httpBackend = $injector.get('$httpBackend');
            Todo = $injector.get('Todo');
            $httpBackend.when('GET','/todo').respond([{"_id":"5499ae1558a48cfc24af2546","name":"Complete Todo","priority":"2","due_date":"2014-12-24T18:01:56.293Z","user":"54987a3403a374e806583244","created_at":"2014-12-23T18:01:57.866Z","updated_at":"2014-12-23T18:01:57.866Z","__v":0,"completed":false}
                                                      ,{"_id":"5499ae8958a48cfc24af2547","name":"Buy Vegetables","priority":"1","due_date":"2014-12-25T18:03:51.071Z","user":"54987a3403a374e806583244","created_at":"2014-12-23T18:03:53.033Z","updated_at":"2014-12-23T18:03:53.033Z","__v":0,"completed":false}
                                                      ,{"_id":"5499ae9558a48cfc24af2548","name":"Check Train Ticket","priority":"0","due_date":"2014-12-26T18:04:02.853Z","user":"54987a3403a374e806583244","created_at":"2014-12-23T18:04:05.001Z","updated_at":"2014-12-23T18:04:05.001Z","__v":0,"completed":true}]);
        }));
        
        it("should assign sortby to name", function () {
            controller("TodosController", {$scope: scope});
            expect(scope.predicate).toBe("name");
            expect(scope.order).toBe("");
            expect(scope.sortby).toBe("name");
        });
        
        it("should have Three todos", function () {
            controller("TodosController", {$scope: scope , Todo : Todo});
            $httpBackend.flush();
            expect(scope.todos.length).toBe(3);
            expect(scope.todos[0].name).toEqual('Complete Todo');
        });
    });
});