angular.module('eObrazovanjeApp').controller(
    'PictureController',
    [

        '$rootScope',
        '$scope',
        '$http',
        '$routeParams',
        '$location',
        'AuthService',
        function ($rootScope, $scope, $http, $routeParams, AuthService, $location) {
            if (localStorage.getItem('ngStorage-userId') == undefined) {
                window.location = "#/login";
            }
            if (localStorage.getItem('ngStorage-token')) {
                $http.defaults.headers.common.Authorization = localStorage.getItem('ngStorage-token').replace(/['"]+/g, '');
                console.log($http.defaults.headers.common);
            }
            $rootScope.userId = localStorage.getItem('ngStorage-userId').replace(/['"]+/g, '');
            var id = $routeParams.id;

            $http.get("api/documents/downloadPicture/" + id)
                .then(function (response) {
                    $scope.availableImages[0].src = response.data;
                });

            $scope.availableImages = [
                {
                    src: "http://upload.wikimedia.org/wikipedia/commons/thumb/8/80/US_1.svg/50px-US_1.svg.png"
                }
            ];
        }]);