angular.module('eObrazovanjeApp').controller(
		'ApplicationController',
		[
				'jwtHelper',

				'$rootScope',
				'$scope',
				'$http',
				'$routeParams',
				'$location',
            	'AuthService',




				function($localStorage,$rootScope, $scope, $http, $routeParams, $location,AuthService) {

                    console.log(AuthService);
                    if(AuthService.getCurrentUser()!=undefined){
                        $scope.isAdmin = function()
                        {
                        	if (AuthService.getCurrentUser().role=="admin"){
                        		return true;
							}
							else{return false;}
						};

                        $scope.isProfessor =function()
                        {
                            if (AuthService.getCurrentUser().role=="professor"){
                                return true;
                            }
                            else{
                            	return false;}
                        };

                        $scope.isStudent = function()
                        {
                            if (AuthService.getCurrentUser().role=="student"){
                                return true;
                            }
                            else{return false;}
                        };
					}

				}
		]
);