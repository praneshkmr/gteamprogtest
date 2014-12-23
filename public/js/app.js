var todoapp = angular.module('TodoApp',['ngRoute','ngResource','ui.bootstrap']);
todoapp.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider) {
    $routeProvider
    .when('/todos', {
        templateUrl: 'partials/TodosTemplate.html',
        controller: 'TodosController'
    })
    .when('/todo/:id', {
        templateUrl: 'partials/TodosTemplate.html',
        controller: 'TodosController'
    })
    .when('/signin',{
        templateUrl : 'partials/SignInTemplate.html',
        controller : 'SignInController'
    })
    .otherwise({
        redirectTo: '/todos'
    });
    
    $httpProvider.interceptors.push(function($q,$location) {
        return {
            'responseError': function(response) {
                if(response.status === 401) {
                    console.log("Unauthorized");
                    window.localStorage.removeItem('user');
                    window.localStorage.removeItem('token');
                    window.localStorage.removeItem('token_expiry');
                    $location.path("/signin");
                }
                return $q.reject(response);
            }
        };
    });
}]).
run(function($http,$rootScope, $location,$window) {
    //$http.defaults.headers.common.Authorization = 'Basic '+window.localStorage.getItem('token');
    $rootScope.$on( "$locationChangeStart", function(event, next, current) {
        if (window.localStorage.getItem('user') == null) {
            $location.path("/signin");
        }
        else{
            //var route = next.split('#')[1];
            //if (route == "/" || route == "/eula" || route == "/signin" ) {
                //$location.path("/todos");
            //}
        }
    });
});
todoapp.controller('SignInController',['$scope',function($scope){
    $scope.text="sign in";
}]);
todoapp.controller('TodosController',['$scope','Todo','$modal','$routeParams','$location',function($scope,Todo,$modal,$routeParams,$location){
    if ($routeParams.id) {
        Todo.get({ _id: $routeParams.id },
            function(todo){
                $scope.todo = todo;
                //$scope.today();
            },
            function(err){
                console.log("Error Loading Todo");
                console.log(JSON.stringify(err));
                if (err.status == 404) {
                    $location.path('/todos');
                }
            }
        );
    }
    else{
        $scope.todo = new Todo();
        $scope.todo.priority = 1;
    }
    Todo.query({},function(data, status, headers, config) {
                $scope.todos = data;
            },function(data, status, headers, config) {
                
            }
        );
    $scope.order = "";
    $scope.predicate = "name";
    $scope.updateOrder = function(order){
        $scope.order = order;
        $scope.updateSort();
    }
    $scope.updatePredicate = function(predicate){
        $scope.predicate = predicate;
        $scope.updateSort();
    }
    $scope.updateSort = function(){
        $scope.sortby = $scope.order + $scope.predicate;
    }
    $scope.updateSort();
    $scope.today = function() {
        $scope.todo.due_date = new Date();
    };
    $scope.updateTodo = function(todo){
        Todo.update({ _id : todo._id }, todo,function(data) {
             $location.path('/todos');
        });
    }
    $scope.gotoTodos = function(){
        $location.path('/todos');
    }
    $scope.clear = function () {
        $scope.todo.due_date = null;
    };
  
    // Disable weekend selection
    //$scope.disabled = function(date, mode) {
    //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    //};
  
    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
  
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
        $scope.today();
    };
  
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
  
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[3];
    $scope.addTodo = function(){
        $scope.todo.$save().then(function(data) {
            $scope.todos.push(data.todo);
        },function(err){
            var message = null;
            if (err && err.data) {
                message = err.data.message;
            }
            else{
                message = "Error Adding Alert";
            }
            console.log(JSON.stringify(err));
        });
    }
    $scope.toggleCompleted = function(todo,$event){
        $event.preventDefault();
        $event.stopPropagation();
        todo.completed = !todo.completed;
        Todo.update({ _id : todo._id }, todo,function(data) {
            //$scope.$apply() ;
            console.log("Update Successful");
        });
    }
    $scope.deleteTodo = function (todo,$event) {
        $event.preventDefault();
        $event.stopPropagation();
        var index = $scope.todos.indexOf(todo);
        var modalInstance = $modal.open({
            templateUrl: 'ModalContent.html',
            controller: 'ModalInstanceController',
            size: 'sm',
            resolve : {
                options : function(){
                    return {
                        title : "Delete Todo",
                        body : "Do you want to delete this Todo?"
                    }
                }
            }
        });
  
        modalInstance.result.then(
            function (result) {
                Todo.delete({ _id : todo._id },function(){
                    console.log("Delete Success");
                    $scope.todos.splice(index,1);
                },function(){
                    console.log("Error Deleting Todo");
                });
            },
            function () {
                console.log("Modal Cancel Clicked");
        });
    };
}]);
todoapp.filter('priority', function() {
    return function(input) {
        if (input == 0) {
            return "Low";
        }
        else if (input == 1) {
            return "Medium";
        }
        else if (input == 2) {
            return "High";
        }
    };
})
todoapp.controller('HeaderController',['$scope','$location',function($scope,$location){
    $scope.signout = function(){
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('token_expiry');
        $location.path("/signin");
    }
}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

todoapp.controller('ModalInstanceController', function ($scope, $modalInstance, options) {
    $scope.title = options.title;
    $scope.body = options.body;
    $scope.ok = function () {
        $modalInstance.close(true);
    };
  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

todoapp.factory('Todo', ['$resource',
    function($resource){
        var token = window.localStorage.getItem('token');
        var auth_header = "Basic "+ token;
        return $resource("/todo/:_id", { _id : '@_id' }, {
            'get':    {method:'GET' , headers : { "Authorization" : auth_header } },
            'save':   {method:'POST' , headers : { "Authorization" : auth_header } },
            'query':  {method:'GET', isArray:true , headers : { "Authorization" : auth_header } },
            'remove': {method:'DELETE'  , headers : { "Authorization" : auth_header } },
            'delete': {method:'DELETE'  , headers : { "Authorization" : auth_header } },
            'update': {method:'PUT' , headers : { "Authorization" : auth_header } }
        });
    }
]);