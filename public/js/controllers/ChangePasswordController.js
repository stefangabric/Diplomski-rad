angular.module('eObrazovanjeApp').controller(
    'ChangePasswordController',
    [
        '$rootScope',
        '$scope',
        '$http',
        '$routeParams',
        '$location',
        function ($rootScope, $scope, $http, $routeParams, $location) {
            if (localStorage.getItem('ngStorage-userId') == undefined) {
                window.location = "#/login";
            }
            if (localStorage.getItem('ngStorage-token')) {
                $http.defaults.headers.common.Authorization = localStorage.getItem('ngStorage-token').replace(/['"]+/g, '');
                console.log($http.defaults.headers.common);
            }
            $rootScope.userId = localStorage.getItem('ngStorage-userId').replace(/['"]+/g, '');
            $scope.initPassword = function () {
                $scope.password = "";
            };

            $scope.savePassword = function () {
                $http.put('api/users/changePassword/'+$rootScope.userId, $scope.password).success(
                    function () {
                        window.location = "#/";
                    }).error(function () {
                    alert('greska dodavanja!')
                });

            };

        }]);