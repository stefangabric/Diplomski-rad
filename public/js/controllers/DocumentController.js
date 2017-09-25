angular.module('eObrazovanjeApp')
    .directive('fileInput', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind('change', function () {
                    $parse(attrs.fileInput)
                        .assign(scope, elm[0].files);
                    scope.$apply()
                })
            }
        }
    }])
    .controller(
        'DocumentController',
        [
            '$rootScope',
            '$scope',
            '$http',
            '$routeParams',
            '$location',
            //	'authService',
            //function($rootScope, $scope, $http, $routeParams,  authService,  $location) {
            function ($rootScope, $scope, $http, $routeParams, $location) {
                if (localStorage.getItem('ngStorage-userId') == undefined) {
                    window.location = "#/login";
                }
                if (localStorage.getItem('ngStorage-token')) {
                    $http.defaults.headers.common.Authorization = localStorage.getItem('ngStorage-token').replace(/['"]+/g, '');
                    console.log($http.defaults.headers.common);
                }
                $rootScope.userId = localStorage.getItem('ngStorage-userId').replace(/['"]+/g, '');
                $scope.getDocument = function (id) {
                    $http.get('api/documents/' + id).success(
                        function (data, status) {
                            $scope.document = data;
                        }).error(function () {
                        $scope.redAlert = true;
                    });
                };

                $scope.getAllDocumentsForUser = function () {
                    if ($routeParams && $routeParams.id) {
                        // ovo je edit stranica
                        $http.get('api/documents/getFor/' + $routeParams.id).success
                        (function (data, status) {
                            $scope.documents = data;
                        }).error(function () {
                            alert('Oops, something went wrong!');
                        });
                    }

                    $scope.resetFilter = function () {
                    }
                };

                $scope.getAllDocuments = function () {
                    $http.get('api/documents/').success
                    (function (data, status) {
                        $scope.documents = data;
                    }).error(function () {
                        alert('Oops, something went wrong!');
                    });
                    $scope.resetFilter = function () {
                    }
                };

                $scope.deleteDocument = function (id) {
                    $http.delete('api/documents/' + id).success(
                        function (data, status) {
                            $scope.deleted = data;
                            $scope.blueAlert = true;
                            $scope.getAllDocuments();

                        }).error(function () {
                        $scope.redAlert = true;
                    });
                };

                $scope.hideAlerts = function () {
                    $scope.redAlert = false;
                    $scope.blueAlert = false;
                    $scope.orangeAlert = false;
                };

                $scope.initDocument = function () {
                    $scope.document = {};

                    if ($routeParams && $routeParams.id) {
                        // ovo je edit stranica
                        $http.get('api/documents/' + $routeParams.id).success(
                            function (data) {
                                $scope.document = data;
                            }).error(function () {
                        });
                    }
                };

                $scope.saveDocument = function () {

                    $scope.document.student = $rootScope.userId;

                    if ($scope.document._id) {
                        // edit stranica
                        $http.put('api/documents/' + $scope.document._id,
                            $scope.document).success(function () {
                            window.location = "#/documents/getFor/" + $rootScope.userId;
                        }).error(function () {
                            alert("neka greska edita");
                        });
                    } else {
                        // add stranica
                        $http.post('api/documents/', $scope.document).success(
                            function () {
                                window.location = "#/documents/getFor/" + $rootScope.userId;
                            }).error(function () {
                            alert('greska dodavanja!')
                        });
                    }
                };

                $scope.filesChanged = function (element) {
                    $scope.files = element.files;
                    $scope.$apply();
                };

                $scope.upload = function () {
                    var fd = new FormData();
                    angular.forEach($scope.files, function (file) {
                        fd.append('file', file)
                    });
                    $http.post('api/documents/uploadAngular/' + $rootScope.userId, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                        .success(function (data) {
                            $scope.document.path = "uploads/" + data.filename;
                            $scope.document.student = $rootScope.userId;
                        });

                };
            }
        ]
    );