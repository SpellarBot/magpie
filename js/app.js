/**
 * Main Angular Application File for the MediaSilo
 * Quicklink.IO Chrome Application
 */

var qLinkIOApp = angular.module('qLinkIOApp', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/list.html',
                controller: 'ListController'
            })
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .otherwise({redirectTo: '/'});
    })

    .controller('ListController', function($scope, $location) {
        $scope.closeWindow = function () {
            window.close();
        };


        $location.path( "/login" );
    })


    .controller('LoginController', function($scope) {

        $scope.closeWindow = function () {
            window.close();
        };

    });


// Init setup and attach event listeners.
/*document.addEventListener('DOMContentLoaded', function(e) {

    // FILESYSTEM SUPPORT --------------------------------------------------------
    window.webkitRequestFileSystem(TEMPORARY, 1024 * 1024, function(localFs) {
        fs = localFs;
    }, onError);
    // ---------------------------------------------------------------------------
});*/
