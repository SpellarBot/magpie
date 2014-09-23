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
    })

    .directive('elapasedTime', function() {
        return {
            restrict: 'EA',
            link: function(scope, element, attr) {
                var timestamp = attr.timestamp;
                var value = parseInt(scope.$eval(timestamp));
                if (isNaN(value)) {
                    element.text('');
                }
                else {
                    var now = new Date();
                    var newVal = "";
                    var elapsedTime = now.getTime()-value;

                    var msInHour = 3600000;
                    if (elapsedTime > msInHour*24) {
                        var days = Math.ceil(elapsedTime / (msInHour*24));
                        if (days > 1) {
                            newVal = days+" days";
                        } else {
                            newVal = "1 day";
                        }
                    } else {
                        var hours = Math.ceil(elapsedTime/msInHour);
                        if (hours > 1) {
                            newVal = hours + " hours";
                        }
                        else if (hours === 1) {
                            newVal = "1 Hour";
                        }
                        else {
                            newVal = "Less than an hour";
                        }
                    }
                    element.text(newVal);
                }
            }
        };
    })

    .directive('dropZone', function() {
        return {
            templateUrl: 'templates/dropZone.html',
            restrict: 'E',
            link: function(scope, element, attrs) {
                var dnd = new DnDFileController('#dropzone', function(files) {
                    var $scope = angular.element(this).scope();
                    Util.toArray(files).forEach(function(file, i) {
                        console.log(file);
                    });
                });
            }
        }
    });