(function () {
    angular
        .module('eObrazovanjeApp')
        .service('AuthService',Service);

    function Service($http, $log, jwtHelper,$localStorage,$rootScope,$route) {
        var service = {};

        service.login = login;
        service.logout = logout;
        service.getCurrentUser = getCurrentUser;
        return service;

        function login(username, password, callback) {
            $http.post('/authenticate', { name: username, password: password })
                .success(function (response,request) {
                    if (response.token) {
                        $localStorage.token=response.token;
                        var currentUser = { username: username, token: response.token };
                        var tokenPayload = jwtHelper.decodeToken(response.token);
                        var userId=tokenPayload._id;
                        if(tokenPayload.role){
                            currentUser.role = tokenPayload.role;
                        }
                        $localStorage.currentUser = currentUser;
                        $localStorage.userId =userId;
                        $localStorage.role=tokenPayload.role;
                        $rootScope.userId=userId;
                        callback(true);
                        $http.defaults.headers.common.Authorization = response.token;
                        if(tokenPayload.role=='professor'){
                            window.location ="#/subjects/getForP/"+userId;
                        }
                        if(tokenPayload.role=='admin'){
                            window.location ="#/professors";
                        }
                        if(tokenPayload.role=='student'){
                            window.location ="#/subjects/getForS/"+userId;
                        }
                        window.location.reload(false);

                    } else {
                        callback(false);
                        window.location ="#/login";
                    }
                });
        }
        function logout() {
            // uklonimo korisnika iz lokalnog skladišta
            if($localStorage.currentUser!=undefined ){
                window.localStorage.clear();
                $http.defaults.headers.common.Authorization = '';
                window.location.reload();
                window.location="#/login";
            }
        }
        function getCurrentUser() {
            return $localStorage.currentUser;
        }



    }
})();