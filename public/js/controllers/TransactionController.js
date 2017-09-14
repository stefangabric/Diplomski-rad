angular.module('eObrazovanjeApp').controller(
		'TransactionController',
		[
				'$rootScope',
				'$scope',
				'$http',
				'$routeParams',
				'$location',
				'AuthService',
				function($rootScope, $scope, $http, $routeParams, AuthService,  $location) {
                    if (localStorage.getItem('ngStorage-token')) {
                        $http.defaults.headers.common.Authorization = localStorage.getItem('ngStorage-token');
                        console.log($http.defaults.headers.common);
                    }
			$rootScope.userId = localStorage.getItem('ngStorage-userId').replace(/['"]+/g, '');
					$scope.getUserTransactions = function() {
						$http.get('api/transactions/getFor/' + $routeParams.id).success
						(function(data, status) {
							$scope.transactions = data;
						}).error(function() {
						alert('Oops, something went wrong!');
					});
				};
					$scope.getAllTransactions = function() {
						$http.get('api/transactions/').success
							(function(data, status) {
								$scope.transactions = data;

						}).error(function() {
							alert('Oops, something went wrong!');
						});

					};
					

					$scope.saveTransaction = function() {
							$scope.transaction.student=$rootScope.userId;
							// add stranica
							$http.post('api/transactions/', $scope.transaction).success(
									function() {
										window.location ="#/transactions/getFor/"+$rootScope.userId;
									}).error(function() {
								alert('Error while adding!')
							});
					
					};
					

				} ]);