"use strict";

/**
 * BasemapController
 * @description :: Server-side logic for ...
 */

module.exports = {
    send(req, res) {

        var secret = sails.config.odin.recaptchaSecret;
        var response = req.param('g-recaptcha-response');
        requestify.get('https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=' + response)
            .then(function(response) {
                var data = response.getBody();
                if (data.success) {
                    this.sendMail(req)
                } else {
                    return res.forbidden(data);
                }
            }.bind(this));

    },
    sendMail: (req) {
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
                console.log(err || "Mail sent");
            }
        )
    }
};
