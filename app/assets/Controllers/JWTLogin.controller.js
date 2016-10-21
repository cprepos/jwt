//INIT JWTApp
angular.module('JWTApp')
//Init Main Controller
.controller('MainController', ['$scope', '$rootScope', 'JWTService',
        function ($scope, $rootScope, JWTService) {
            'use strict';

            //init scope vars
            $scope.jwt = "Not Logged in.";
            $scope.user = '';
            $scope.pass = '';

            //submit function
            $scope.submit = function (credentials) {
                JWTService.save({ user: $scope.user, pass: $scope.pass }).$promise.then(function (authRes) {

                    //Grab index of response "jwt" or "error"
                    var index = Object.keys(authRes.serverResponse)[0];

                    //populate message
                    var loginResponse = authRes.serverResponse[index]

                    //broadcast to authReturn
                    $rootScope.$broadcast('authReturn', loginResponse);

                });
            }


            //Listen for authentication response
            $scope.$on('authReturn', function (event, value) {
                //pass value to $scope.jwt
                $scope.jwt = value;
            })

        }])
