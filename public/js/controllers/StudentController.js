angular.module('eObrazovanjeApp').controller(
    'StudentController',
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
            $scope.getStudent = function (id) {
                $http.get('api/users/' + id).success(
                    function (data, status) {
                        $scope.student.content = data;

                    }).error(function () {
                    $scope.redAlert = true;

                });
            };

            $scope.pageNumber = 1;

            $scope.getAllStudents = function () {
                $http.get('api/users/students', {
                    params: {
                        "text": $scope.text,
                        "pageNumber": $scope.pageNumber

                    }
                }).success
                (function (data, status) {
                    $scope.students = data.content;
                    $scope.pageNum = data.number;
                    $scope.pageNumMax = data.totalPages;
                }).error(function () {
                    console.log("");
                });

                $scope.resetFilter = function () {

                }
            };

            $scope.getAllDocumentsForUser = function (id) {
                $http.get('api/documents/getFor/' + id).success
                (function (data, status) {
                    $scope.documents = data;
                    $location.path('/documents/getFor/' + id);
                }).error(function () {
                    alert('Oops, something went wrong!');
                });
                $scope.resetFilter = function () {
                }
            };

            $scope.deleteStudent = function (id) {
                $http.delete('api/users/students/' + id).success(
                    function (data, status) {
                        $scope.deleted = data;
                        $scope.blueAlert = true;
                        $scope.getAllStudents();

                    }).error(function () {
                    $scope.redAlert = true;

                });
            };

            $scope.hideAlerts = function () {
                $scope.redAlert = false;
                $scope.blueAlert = false;
                $scope.orangeAlert = false;
            };

            $scope.initStudent = function () {
                $scope.student = {};

                if ($routeParams && $routeParams.id) {
                    $http.get('api/users/' + $routeParams.id).success(
                        function (data) {
                            $scope.student = data;
                        }).error(function () {
                    });
                }
            };

            $scope.saveStudent = function () {
                if ($scope.student._id) {
                    // edit stranica
                    $http.put('api/users/students/' + $scope.student._id,
                        $scope.student).success(function () {
                        if ($scope.isAdmin()) {
                            alert("admin");
                            window.location = "#/students";
                        } else if ($scope.isStudent()) {
                            alert("user");
                            window.location = "#/subjects/getForS/" + $rootScope.userId;
                        }
                    }).error(function () {
                        alert("neka greska edita");
                    });
                } else {
                    // add stranica
                    $http.post('api/users/students', $scope.student).success(
                        function () {
                            window.location = "#/students";
                        }).error(function () {
                        alert('greska dodavanja!')
                    });
                }
            };
            //paginacija
            $scope.previousPage = function () {
                if ($scope.pageNumber != 1) {
                    $scope.pageNumber = $scope.pageNumber - 1;
                }
                $http.get('api/users/students', {
                    params: {
                        "pageNumber": $scope.pageNumber
                    }
                })
                    .success(function (data, status) {
                        $scope.students = data.content;
                        $scope.pageNum = data.number;

                    })
                    .error(function () {
                        alert('Oops, something went wrong!');
                    });

            };
            $scope.firstPage = function () {
                $scope.pageNumber = 1;
                $http.get('api/users/students', {
                    params: {
                        "pageNumber": $scope.pageNumber
                    }
                })
                    .success(function (data, status) {
                        $scope.students = data.content;
                        $scope.pageNum = data.number;
                    })
                    .error(function () {
                        alert('Oops, something went wrong!');
                    });

            };
            $scope.nextPage = function () {
                if ($scope.pageNumber < $scope.pageNumMax) {
                    $scope.pageNumber = $scope.pageNumber + 1;
                }
                $http.get('api/users/students', {
                    params: {
                        "pageNumber": $scope.pageNumber
                    }
                })
                    .success(function (data, status) {
                        $scope.students = data.content;
                        $scope.pageNum = data.number;
                    })
                    .error(function () {
                        alert('Oops, something went wrong!');
                    });
            };
            $scope.lastPage = function () {
                $scope.pageNumber = $scope.pageNumMax;
                $http.get('api/users/students', {
                    params: {
                        "pageNumber": $scope.pageNumber
                    }
                })
                    .success(function (data, status) {
                        $scope.students = data.content;
                        $scope.pageNum = data.number;
                    })
                    .error(function () {
                        alert('Oops, something went wrong!');
                    });
            };

            $scope.upload = function () {
                var id = $routeParams.id;
                var fd = new FormData();
                angular.forEach($scope.files, function (file) {
                    fd.append('file', file)
                });
                $http.post('api/documents/profilePic/' + id, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function (data) {
                        console.log(data);
                        $scope.student.picturePath = "uploads/" + data.filename;
                    });

            };
        }

    ]);