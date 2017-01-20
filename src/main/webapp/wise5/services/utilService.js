'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UtilService = function () {
    function UtilService() {
        _classCallCheck(this, UtilService);
    }

    /**
     * Generates and returns a random key of the given length if
     * specified. If length is not specified, returns a key 10
     * characters in length.
     */


    _createClass(UtilService, [{
        key: "generateKey",
        value: function generateKey(length) {
            this.CHARS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

            /* set default length if not specified */
            if (!length) {
                length = 10;
            }

            /* generate the key */
            var key = '';
            for (var a = 0; a < length; a++) {
                key += this.CHARS[Math.floor(Math.random() * (this.CHARS.length - 1))];
            }

            /* return the generated key */
            // TODO: check that the new key is unique
            return key;
        }
    }, {
        key: "convertStringToNumber",


        /**
         * Try to convert a string to a number
         * @param str the string to convert
         * @returns a number if we were able to convert the string to a number.
         * if we couldn't convert the string to a number we will just return the string.
         */
        value: function convertStringToNumber(str) {
            var result = str;

            if (str != null && str != '' && !isNaN(Number(str))) {
                result = Number(str);
            }

            return result;
        }
    }, {
        key: "makeCopyOfJSONObject",


        /**
         * Create a copy of a JSON object
         * @param jsonObject the JSON object to get a copy of
         * @return a copy of the JSON object that was passed in
         */
        value: function makeCopyOfJSONObject(jsonObject) {
            var copyOfJSONObject = null;

            if (jsonObject != null) {
                // create a JSON string from the JSON object
                var jsonObjectString = angular.toJson(jsonObject);

                // create a JSON object from the JSON string
                copyOfJSONObject = angular.fromJson(jsonObjectString);
            }

            return copyOfJSONObject;
        }
    }, {
        key: "getImageObjectFromBase64String",


        /**
         * Get the image object
         * @params img_b64 the base64 image string
         * @returns an image object
         */
        value: function getImageObjectFromBase64String(img_b64) {

            // create a blob from the base64 image string
            var blob = this.dataURItoBlob(img_b64);

            var now = new Date().getTime();
            var filename = encodeURIComponent('picture_' + now + '.png');
            var pngFile = new File([blob], filename, {
                lastModified: now, // optional - default = now
                type: 'image/png' // optional - default = ''
            });

            return pngFile;
        }

        /**
         * Convert base64/URLEncoded data component to raw binary data held in a string
         * @param dataURI base64/URLEncoded data
         * @returns a Blob object
         */

    }, {
        key: "dataURItoBlob",
        value: function dataURItoBlob(dataURI) {

            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);else byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], { type: mimeString });
        }
    }, {
        key: "getImageObjectFromImageElement",


        /**
         * Get an image object from an image element
         * @param imageElement an image element (<img src='abc.jpg'/>)
         * @returns an image object
         */
        value: function getImageObjectFromImageElement(imageElement) {

            var imageObject = null;

            if (imageElement != null) {
                // create a canvas element that we will use to generate a base64 string
                var canvas = document.createElement("canvas");

                // set the width and height of the canvas to match the image dimensions
                canvas.width = imageElement.naturalWidth;
                canvas.height = imageElement.naturalHeight;

                // draw the image onto the canvas
                var ctx = canvas.getContext("2d");
                ctx.drawImage(imageElement, 0, 0);

                // create the base64 string representation of the image
                var dataURL = canvas.toDataURL("image/png");

                // get the image object
                imageObject = this.getImageObjectFromBase64String(dataURL);
            }

            return imageObject;
        }

        /**
         * Hide all the iframes. This is used before a student snips something
         * to put into their notebook. Iframes shift the position of elements
         * below it which causes issues when html2canvas tries to capture
         * certain elements.
         */

    }, {
        key: "hideIFrames",
        value: function hideIFrames() {

            // get all the iframes
            var iframes = angular.element('iframe');

            // loop through all the iframes
            for (var i = 0; i < iframes.length; i++) {
                var iframe = iframes[i];

                if (iframe != null) {
                    // hide the iframe
                    iframe.style.display = 'none';
                }
            }
        }

        /**
         * Show all the iframes. This is used after the student snips something
         * to put into their notebook. Iframes shift the position of elements
         * below it which causes issues when html2canvas tries to capture
         * certain elements.
         */

    }, {
        key: "showIFrames",
        value: function showIFrames() {

            // get all the iframes
            var iframes = angular.element('iframe');

            // loop through all the iframes
            for (var i = 0; i < iframes.length; i++) {
                var iframe = iframes[i];

                if (iframe != null) {
                    // show the iframe
                    iframe.style.display = '';
                }
            }
        }

        /**
         * Check if the asset is an image
         * @param fileName the file name of the asset
         * @return whether the asset is an image or not
         */

    }, {
        key: "isImage",
        value: function isImage(fileName) {
            var result = false;

            if (fileName != null) {
                var lowerCaseFileName = fileName.toLowerCase();

                // regex to match image extensions
                var imageExtensionsRegEx = new RegExp('.*\.(png|jpg|jpeg|bmp|gif|tiff|svg)');

                var matchResult = lowerCaseFileName.match(imageExtensionsRegEx);

                if (matchResult != null) {
                    // we have found a match so the asset is an image
                    result = true;
                }
            }

            return result;
        }

        /**
         * Check if the asset is a video
         * @param fileName the file name of the asset
         * @return whether the asset is an image or not
         */

    }, {
        key: "isVideo",
        value: function isVideo(fileName) {
            var result = false;

            if (fileName != null) {
                var lowerCaseFileName = fileName.toLowerCase();

                // regex to match video extensions
                var imageExtensionsRegEx = new RegExp('.*\.(mp4|mpg|mpeg|m2v|avi|gifv|mov|qt)');

                var matchResult = lowerCaseFileName.match(imageExtensionsRegEx);

                if (matchResult != null) {
                    // we have found a match so the asset is a video
                    result = true;
                }
            }

            return result;
        }
    }]);

    return UtilService;
}();

// Get the last element of the array


if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
};

UtilService.$inject = [];

exports.default = UtilService;
//# sourceMappingURL=utilService.js.map