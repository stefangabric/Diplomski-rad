(function (angular) {
    angular.module('eObrazovanjeApp')
        .controller('LoginController', function($scope, $log, AuthService){
            AuthService.logout();
            $scope.user={};

            $scope.login1=function () {

                AuthService.login($scope.user.username,$scope.user.password,loginCbck);
            };
            function loginCbck(success) {
                if (success) {
                    $log.info('success!');
                }
                else{
                    $log.info('failure!');
                }
            }
        });
}(angular));