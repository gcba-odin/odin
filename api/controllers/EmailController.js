"use strict";

/**
 * EmailController
 * @description :: Server-side logic for Email Controller
 */
const requestify = require('requestify');

module.exports = {
    send(req, res) {
        var secret = sails.config.odin.recaptchaSecret;
        var response = req.param('g-recaptcha-response');
        requestify.get('https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=' + response)
            .then(function(response) {
                var data = response.getBody();
                if (data.success) {
                    this.sendMail(req, res)
                } else {
                    return res.forbidden(data);
                }
            }.bind(this));

    },
    sendMail(req, res) {
        var mail = req.param('mail');
        var name = req.param('name');
        var description = req.param('description');
        sails.hooks.email.send(
            "", {
                name: name,
                mail: mail,
                description: description
            }, {
                subject: "Odin"
            },
            function(err) {
                if (err) return res.negotiate(err)
                else return res.ok('email sent')
            }
        )
    }
};
