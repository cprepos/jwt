//Import JWTApp
angular.module('JWTApp')
//init factory
 .factory('JWTService', ['$resource', function ($resource) {
        'use strict';

        var jwt = $resource('https://localhost:8443/auth', {}, {

            save: { // redefine save action defaults
                method: 'POST',
                isArray: false,
                transformResponse: function (data) {
                    return {
                        serverResponse: angular.fromJson(data)
                    }
                }
            }
        });
        //return resource promise
        return jwt;

    }])