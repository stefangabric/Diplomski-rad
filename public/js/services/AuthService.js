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
                    // ukoliko postoji token, prijava je uspecna
                    if (response.token) {
                        // korisnicko ime, token i rola (ako postoji) cuvaju se u lokalnom skladištu
                        var currentUser = { username: username, token: response.token };
                        var tokenPayload = jwtHelper.decodeToken(response.token);
                        console.log(tokenPayload);
                        var userId=tokenPayload._id;
                        if(tokenPayload.role){
                            currentUser.role = tokenPayload.role;
                        }
                        // prijavljenog korisnika cuva u lokalnom skladistu
                        $localStorage.currentUser = currentUser;
                        $localStorage.userId =userId;
                        // jwt token dodajemo u to auth header za sve $http zahteve
                        $http.defaults.headers.common.Authorization = response.token;
                        // callback za uspesan login
                        callback(true);
                        window.location.reload();
                        window.location="#/students";
                    } else {
                        // callback za neuspesan login
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