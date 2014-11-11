'use strict';

angular.module('qLinkIOApp')
    .factory('FileUpload', function () {

        var PART_SIZE = 1024 * 1024 * 5; // Minimum 5MB per chunk, except the last part
        var MAX_UPLOAD_TRIES = 30;
        var RETRY_TIMEOUT_MILLISECONDS = 1000;
        var MAX_POOL_SIZE = 2;

        var STATUS = {
            CANCELED    : 'cancelled',
            PENDING     : 'pending',
            UPLOADING   : 'uploading',
            COMPLETE    : 'complete',
            ABORTING    : 'aborting'
        };

        function FileUpload(uploadId, fileObject, promise) {
            this.uploadId = uploadId;
            this.fileObject = fileObject;
            this.promise = promise;
            this.uploadStatus = STATUS.PENDING;
            this.poolSpace = MAX_POOL_SIZE;

            this.parts = [];
            var rangeStart = 0;
            for (var i = 0; i < this.fileObject.size / PART_SIZE; i++) {
                this.parts.push({
                    uploadId: uploadId,
                    start: rangeStart,
                    end: Math.min(rangeStart + PART_SIZE, this.fileObject.size),
                    partNumber: i + 1,
                    status: STATUS.PENDING,
                    uploadedBytes: 0,
                    tryCount: 0
                });
                rangeStart += PART_SIZE;
            }
        }

        FileUpload.prototype.getStatus = function() {
            return this.uploadStatus();
        };

        FileUpload.prototype.cancelUpload = function() {
            this.parts.length = 0;
            this.status = STATUS.CANCELED;
        };

        FileUpload.prototype.completeUpload = function() {
            this.parts.length = 0;
            this.status = STATUS.COMPLETE;
            this.promise.resolve();
        };

        FileUpload.prototype.completePart = function(partNumber) {

        };

        FileUpload.prototype.hasMoreParts = function() {
            var pendingParts = 0;
            for (var i=0; i<this.parts.length; i++) {
                if (this.parts[i].status === STATUS.PENDING) {
                    pendingParts++;
                }
            }
            return pendingParts;
        };

        FileUpload.prototype.getNextPart = function() {
            console.log(this.poolSpace);
            if (!this.poolSpace) return false;
            console.log(this.parts);
            for (var i=0; i<this.parts.length; i++) {
                if (this.parts[i].status === STATUS.PENDING) {
                    this.uploadStatus = STATUS.UPLOADING;
                    this.parts[i].status = STATUS.UPLOADING;
                    this.poolSpace--;
                    return this.parts[i];
                }
            }

            return false;
        };

        FileUpload.prototype.getPartBlob = function (partNumber) {
            return this.fileObject.slice(this.parts[partNumber].start, this.parts[partNumber].end);
        };

        return FileUpload;
    });
