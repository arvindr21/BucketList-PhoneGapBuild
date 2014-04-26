angular.module('bucketList.services', [])
    .factory('API', function ($rootScope, $http, $ionicLoading, $window) {
        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };

        $rootScope.hide = function () {
            $ionicLoading.hide();
        };

        $rootScope.logout = function () {
            $window.sessionStorage.token = "";
            $window.location.href = '#/auth/signin';
        };

        $rootScope.notify =function(text){
            $rootScope.show(text);
            setTimeout(function () {
              $rootScope.hide();
            }, 1999);
        };

        $rootScope.doRefresh = function () {
            // I am extremely lazy to hit the service fetch data and append
            // yeah I know, I cam broadcast a event :P
            // But I prefer just to relaod, what say??? :P
            $window.location.reload(true);
        };

        return {
            signin: function (form) {
                return $http.post('http://bucketlist.cloudno.de/api/v1/bucketList/auth/login', form);
            },
            signup: function (form) {
                return $http.post('http://bucketlist.cloudno.de/api/v1/bucketList/auth/register', form);
            },
            getAll: function (email) {
                return $http.get('http://bucketlist.cloudno.de/api/v1/bucketList/data/list', {
                    method: 'GET',
                    params: {
                        token: email
                    }
                });
            },
            getOne: function (id, email) {
                return $http.get('http://bucketlist.cloudno.de/api/v1/bucketList/data/list/' + id, {
                    method: 'GET',
                    params: {
                        token: email
                    }
                });
            },
            saveItem: function (form, email) {
                return $http.post('http://bucketlist.cloudno.de/api/v1/bucketList/data/item', form, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            },
            putItem: function (id, form, email) {
                return $http.put('http://bucketlist.cloudno.de/api/v1/bucketList/data/item/' + id, form, {
                    method: 'PUT',
                    params: {
                        token: email
                    }
                });
            },
            deleteItem: function (id, email) {
                return $http.delete('http://bucketlist.cloudno.de/api/v1/bucketList/data/item/' + id, {
                    method: 'DELETE',
                    params: {
                        token: email
                    }
                });
            }
        }
    });