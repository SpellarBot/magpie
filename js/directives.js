'use strict';

angular.module('qLinkIOApp')
    .directive('topNav', function () {
        return {
            templateUrl: 'templates/nav.html',
            restrict: 'E',
            scope: {
                onClose: '&'
            },
            link: function(scope, element, attrs) {

            }
        };
    });