

var qLinkIOApp = angular.module('qLinkIOApp', []);



function AppController($scope, $http) {


}


AppController.$inject = ['$scope', '$http'];


// Init setup and attach event listeners.
document.addEventListener('DOMContentLoaded', function(e) {
    var closeButton = document.querySelector('#close-button');
    closeButton.addEventListener('click', function(e) {
        window.close();
    });

    // FILESYSTEM SUPPORT --------------------------------------------------------
    window.webkitRequestFileSystem(TEMPORARY, 1024 * 1024, function(localFs) {
        fs = localFs;
    }, onError);
    // ---------------------------------------------------------------------------
});
