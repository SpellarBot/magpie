/**
 * Main Angular Application File for the MediaSilo
 * Quicklink.IO Chrome Application
 */

var qLinkIOApp = angular.module('qLinkIOApp', ['ngRoute'])
    .config(function($routeProvider, $compileProvider) {
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

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
    })

    .controller('ListController', function($scope, $location, ApiService) {
        $scope.closeWindow = function () {
            window.close();
        };

        if (!ApiService.isAuthorized()) {
            $location.path( "/login" );
            return;
        }

        $scope.quicklinks = [];

        ApiService.getQuicklinks().then(function(result) {
            $scope.quicklinks = result.data;
            for(var i = 0; i < $scope.quicklinks.length; i++) {
                if (!$scope.quicklinks[i].hasOwnProperty('thumb')) {
                    $scope.quicklinks[i].thumb = "img/no-thumb.png";
                }
            }
        });
    })

    .controller('LoginController', function($scope, $location, ApiService) {
        $scope.closeWindow = function () {
            window.close();
        };

        $scope.login = function(user) {
            ApiService.setCredentials(user.hostname, user.name, user.password);
            ApiService.getUser().then(function(){
                $location.path( "/list" );
            }, function() {
                console.log('login failed');
            });
        };

    });
