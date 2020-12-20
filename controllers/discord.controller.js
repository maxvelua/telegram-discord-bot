const request = require('request');

/**
 * message: {
 *  description: string
 *  files: arrays of string (http link to content)
 * }
 */
module.exports.sendContent = function (content) {
    return new Promise((resolve, reject) => {
        request.post(
            {
                url: 'http://localhost:3001/discord/content',
                form: { content }
            },
            function (err, httpResponse, body) {
                if (!err) return resolve(body);
                return reject(err);
            }
        );
    });
};

module.exports.getMaxUploadFileSize = function () {
    return new Promise((resolve, reject) => {
        request.get(
            {
                url: 'http://localhost:3001/discord/getMaxUploadFileSize'
            },
            function (err, httpResponse, body) {
                if (!err) return resolve(JSON.parse(body).maxUploadFileSize);
                return reject(err);
            }
        );
    });
}