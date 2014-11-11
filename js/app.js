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

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|chrome-extension):|data:image\//);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|blob|chrome-extension):/);
    })

    .controller('ListController', function($scope, $location, ApiService, UploadService) {
        $scope.closeWindow = function () {
            window.close();
        };

        $scope.fileUploadInit = function(file) {
            UploadService.uploadFile(file).then(function() {
                console.log('finished');
            }, function(err) {
                console.log('failed: ', err)
            }, function(progress) {
                console.log('progress: ', progress)
            });
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
                    loadQuicklinkThumb($scope.quicklinks[i]);
                }
            }
        });

        var loadQuicklinkThumb = function(quicklinkObj) {
            if (quicklinkObj.assetIds.length) {
                var firstAssetId = quicklinkObj.assetIds[0];
                ApiService.getThumbnailForAsset(firstAssetId, 105, 75).then(function(thumbUrl){

                    loadImage(thumbUrl, function(blob_uri, requested_uri) {
                        quicklinkObj.thumb = blob_uri;
                    });

                });
            }
        };


        var loadImage = function(uri, callback) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
                callback(window.URL.createObjectURL(xhr.response), uri);
            }
            xhr.open('GET', uri, true);
            xhr.send();
        };

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


// Init setup and attach event listeners.
/*document.addEventListener('DOMContentLoaded', function(e) {

    // FILESYSTEM SUPPORT --------------------------------------------------------
    window.webkitRequestFileSystem(TEMPORARY, 1024 * 1024, function(localFs) {
        fs = localFs;
    }, onError);
    // ---------------------------------------------------------------------------
});*/
