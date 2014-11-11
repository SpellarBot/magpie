'use strict';

angular.module('qLinkIOApp')
    .factory('ApiService', function ($http, $q, PHOENIX_URL) {

        var authSuccess = true;
        var authHostname = "";
        var authString = "";
        var userData = {};
        var assetCache = [];


        var setCredentials = function(hostname, username, password) {
            authHostname = hostname;
            authString = utf8_to_b64(username+":"+password);
        };


        var getUser = function() {
            var deferred = $q.defer();

            $http.get(PHOENIX_URL+"me", getCallConfig()).then(
                function(result) {
                    authSuccess = true;
                    userData = result;
                    deferred.resolve();
                },
                function() {
                    deferred.reject();
                }
            );
            return deferred.promise;
        };


        var getAsset = function(assetId) {
            var deferred = $q.defer();

            $http.get(PHOENIX_URL+"assets/"+assetId, getCallConfig()).then(
                function(result) {
                    deferred.resolve(result.data);
                },
                function() {
                    deferred.reject();
                }
            );

            return deferred.promise;
        };


        var getAssetThumbnail = function(assetId) {
            var deferred = $q.defer();
            getAsset(assetId).then(function(assetData){
                console.log(assetData);
                deferred.resolve("img/no-thumb.png");
            }, function(){
                deferred.resolve("img/no-thumb.png");
            });
            return deferred.promise;
        };


        var getQuicklinks = function(page) {
            var deferred = $q.defer();
            var page = page || 1;

            $http.get(PHOENIX_URL+"quicklinks?_page="+page+"&_pageSize=25", getCallConfig()).then(
                function(result) {
                    deferred.resolve(result);
                },
                function() {
                    deferred.reject();
                }
            );
            return deferred.promise;
        };


        var isAuthorized = function() {
            return authSuccess;
        };


        var checkAssetCache = function(assetId) {
            var result = assetCache.filter(function(v) {
                return v.id === assetId;
            })[0];
            return result !== undefined ? result : false;
        };


        var getCallConfig = function() {
            return {
                headers:  {
                    'Authorization': 'Basic '+authString,
                    'MediaSiloHostContext': authHostname,
                    'Accept': 'application/json;odata=verbose'
                }
            };
        };


        var utf8_to_b64 = function( str ) {
            return window.btoa(unescape(encodeURIComponent( str )));
        };


        return {
            setCredentials      : setCredentials,
            getUser             : getUser,
            getQuicklinks       : getQuicklinks,
            getAsset            : getAsset,
            getAssetThumbnail   : getAssetThumbnail,
            isAuthorized        : isAuthorized
        }

    });
