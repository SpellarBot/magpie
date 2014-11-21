'use strict';

angular.module('qLinkIOApp')
    .factory('UploadService', function ($http, $q, FileUpload) {

        var creds = {
            bucket: '',
            access_key: '',
            secret_key: ''
        };

        var POOL_SIZE = 2;


        var STATUS = {
            CANCELED    : 'cancelled',
            PENDING     : 'pending',
            UPLOADING   : 'uploading',
            COMPLETE    : 'complete',
            ABORTING    : 'aborting'
        };

        var filesToUpload = [];

        AWS.config.update({
            accessKeyId: creds.access_key,
            secretAccessKey: creds.secret_key
        });

        AWS.config.region = 'us-east-1';


        var uploadFile = function(fileObject) {
            var deferred = $q.defer();
            var S3 = new AWS.S3();

            var fileKey = Util.createUUID() + '/' + Util.cleanFileName(fileObject.name);
            S3.createMultipartUpload({
                Key: fileKey,
                Bucket: creds.bucket
            }, function(err, data){
                if (err !== null) {
                    deferred.reject(err);
                } else {
                    filesToUpload.push(new FileUpload(data.UploadId, fileObject, deferred));
                    processUploads();
                }
            });

            return deferred.promise;
        };

        var processUploads = function() {
            for (var i=0; i<filesToUpload.length; i++) {
                for (var j=0; j<filesToUpload[i].poolSpace; j++) {
                    var nextPart = filesToUpload[i].getNextPart();
                    if (nextPart !== false) {
                        doPartUpload(nextPart);
                    }
                }
            }
        };

        var doPartUpload = function(filePart) {

            //filePartBlob = self.uploadFileObj.slice(uploadPool[i].start, uploadPool[i].end);

            console.log(filePart);
        };


        return {
            uploadFile : uploadFile
        }
    });
    
