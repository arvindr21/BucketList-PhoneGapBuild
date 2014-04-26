angular.module('bucketList.controllers', ['bucketList.services'])

.controller('SignInCtrl', function ($scope, API, $window) {
    var isSessionActive = $window.sessionStorage.token ? true : false;
    if (isSessionActive) {
        $window.location.href = ('#/bucket/list');
    }
    $scope.user = {
        email: "",
        password: ""
    };

    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password) {
        	$scope.notify("Please enter valid credentials");
        	return false;
        }
        API.signin({
            email: email,
            password: password
        }).success(function (data) {
            $window.sessionStorage.token = email;
            $window.location.href = ('#/bucket/list');
        }).error(function (error) {
            $scope.notify("Invalid Username or password");
        });
    }

})

.controller('SignUpCtrl', function ($scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        name: ""
    };

    $scope.createUser = function () {
    	var email = this.user.email;
        var password = this.user.password;
        var uName = this.user.name;
        if(!email || !password || !uName) {
        	$scope.notify("Please enter valid data");
        	return false;
        }
        API.signup({
            email: email,
            password: password,
            name: uName
        }).success(function (data) {
            $window.sessionStorage.token = email;
            $window.location.href = ('#/bucket/list');
        }).error(function (error) {
        	if(error.error && error.error.code == 11000)
        	{
        		$scope.notify("A user with this email already exists");
        	}
        	else
        	{
        		$scope.notify("Oops something went wrong, Please try again!");
        	}
            
        });
    }
})

.controller('myListCtrl', function ($scope, API, $timeout, $ionicModal, $window) {
    API.getAll($window.sessionStorage.token).success(function (data, status, headers, config) {
        $scope.list = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].isCompleted == false) {
                $scope.list.push(data[i]);
            }
        };
        if($scope.list.length == 0)
        {
        	$scope.noData = true;
        }
        $ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
            $scope.newTemplate = modal;
        });


        $scope.newTask = function () {
            $scope.newTemplate.show();
        };
    }).error(function (data, status, headers, config) {
        $scope.notify("Oops something went wrong!! Please try again later");
    });

    $scope.markCompleted = function (id) {
        $scope.show();
        API.putItem(id, {
            isCompleted: true
        }, $window.sessionStorage.token)
            .success(function (data, status, headers, config) {
                $window.location.reload(true);
            });
    };



    $scope.deleteItem = function (id) {
        $scope.show();
        API.deleteItem(id, $window.sessionStorage.token)
            .success(function (data, status, headers, config) {
                $window.location.reload(true);
            });
    };

})

.controller('completedCtrl', function ($scope, API, $window) {
        API.getAll($window.sessionStorage.token).success(function (data, status, headers, config) {
            $scope.list = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isCompleted == true) {
                    $scope.list.push(data[i]);
                }
            };
	        if(data.length > 0 & $scope.list.length == 0)
	        {
	        	$scope.incomplete = true;
	        }
	        
	        if(data.length == 0)
	        {
	        	$scope.noData = true;
	        }
        }).error(function (data, status, headers, config) {
            $scope.notify("Oops something went wrong!! Please try again later");
        });


        $scope.deleteItem = function (id) {
            $scope.show();
            API.deleteItem(id, $window.sessionStorage.token)
                .success(function (data, status, headers, config) {
                    $window.location.reload(true);
                });
        };
    })

.controller('newCtrl', function ($rootScope, $scope, API, $window) {
        $scope.data = {
	        item: ""
	    };

        $scope.close = function () {
            $scope.modal.hide();
        };

        $scope.createNew = function () {
			var item = this.data.item;
        	if (!item) return;
            $scope.modal.hide();
            $rootScope.show();
            
            

            var form = {
                item: item,
                isCompleted: false,
                user: $window.sessionStorage.token,
                created: Date.now(),
                updated: Date.now()
            }

            API.saveItem(form, form.user)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $window.location.reload(true);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                });
        };
    })