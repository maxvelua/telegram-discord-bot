const request = require('request');

/**
 * message: {
 *  description: string
 *  path: string (http link to content)
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
            });
    });
};