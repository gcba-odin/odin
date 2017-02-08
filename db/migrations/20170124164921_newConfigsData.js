var moment = require('moment')
exports.up = function(knex, Promise) {

    var now = moment().format('YYYY-MM-DD HH:mm:ss Z');
    var socialNetworks = {
        id: 'ho5GzCz9',
        description: 'Social networks',
        type: 'group',
        multiple: true,
        model: '',
        key: 'socialNetworks',
        value: 'false',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        required: false,
        editable: false
    };
    var facebook = {
        id: 'iogGzCz9',
        description: 'Facebook',
        type: 'string',
        multiple: false,
        model: '',
        key: 'facebook',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'ho5GzCz9',
        required: false,
        editable: false
    };
    var twitter = {
        id: 'izgGzPx9',
        description: 'Twitter',
        type: 'string',
        multiple: false,
        model: '',
        key: 'twitter',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'ho5GzCz9',
        required: false,
        editable: false
    };
    var instagram = {
        id: 'iP2S3Cz9',
        description: 'Instagram',
        type: 'string',
        multiple: false,
        model: '',
        key: 'instagram',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'ho5GzCz9',
        required: false,
        editable: false
    };
    var pinterest = {
        id: 'coxG8Cz9',
        description: 'Pinterest',
        type: 'string',
        multiple: false,
        model: '',
        key: 'pinterest',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'ho5GzCz9',
        required: false,
        editable: false
    };
    var youtube = {
        id: 'bo97zLz9',
        description: 'YouTube',
        type: 'string',
        multiple: false,
        model: '',
        key: 'youtube',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'ho5GzCz9',
        required: false,
        editable: false
    };
    var googlePlus = {
        id: 'po2GbCz9',
        description: 'Google Plus',
        type: 'string',
        multiple: false,
        model: '',
        key: 'googlePlus',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'ho5GzCz9',
        required: false,
        editable: false
    };
    var linkedin = {
        id: 'ls2GzXz8',
        description: 'Linkedin',
        type: 'string',
        multiple: false,
        model: '',
        key: 'linkedin',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'ho5GzCz9',
        required: false,
        editable: false
    };
    var github = {
        id: 'ua2GzCzL',
        description: 'Github',
        type: 'string',
        multiple: false,
        model: '',
        key: 'github',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'ho5GzCz9',
        required: false,
        editable: false
    };

    var googleAnalytics = {
        id: 'jogGzCz9',
        description: 'Google Analytics',
        type: 'group',
        multiple: true,
        model: '',
        key: 'googleAnalytics',
        value: 'false',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        required: true,
        editable: false,
    };

    var googleAnalyticsAccount = {
        id: 'p8xGzaE9',
        description: 'Google Analytics Account',
        type: 'string',
        multiple: false,
        model: '',
        key: 'googleAnalyticsAccount',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        required: true,
        editable: false,
        parent: 'jogGzCz9',
        tooltip: 'Account where the statistics will be shown'
    };

    var disqus = {
        id: 'qlgCzCz9',
        description: 'Disqus',
        type: 'group',
        multiple: true,
        model: '',
        key: 'disqus',
        value: 'false',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        required: true,
        editable: false
    };
    var disqusDisableMobile = {
        id: 'inaG9Cz9',
        description: 'Enable/disable mobile disqus',
        type: 'boolean',
        multiple: false,
        model: '',
        key: 'disqusDisableMobile',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'qlgCzCz9',
        required: false,
        editable: false,
        tooltip: 'Enable/disable mobile disqus'
    };
    var disqusConfigLanguage = {
        id: '3jnG0Cz9',
        description: 'Choose a particular language (Browser language by default)',
        type: 'string',
        multiple: false,
        model: '',
        key: 'disqusConfigLanguage',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'qlgCzCz9',
        required: false,
        editable: false,
        tooltip: 'Choose a particular language',
    };
    var disqusApiKey = {
        id: '2soC1Cz9',
        description: 'Disqus Public Key provided through its administration panel',
        type: 'string',
        multiple: false,
        model: '',
        key: 'disqusApiKey',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'qlgCzCz9',
        required: false,
        editable: false,
        tooltip: 'Disqus Public Key, depends on disqusRemoteAuthS3 field'
    };
    var disqusRemoteAuthS3 = {
        id: '2z0GmCz9',
        description: 'Authentication format provided by Disqus through its administration panel',
        type: 'string',
        multiple: false,
        model: '',
        key: 'disqusRemoteAuthS3',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'qlgCzCz9',
        required: false,
        editable: false,
        tooltip: 'Authentication format provided by Disqus, depends on disquisApiKey field'
    };

    var reCaptcha = {
        id: 'co1HzCz6',
        description: 'Captcha',
        type: 'group',
        multiple: true,
        model: '',
        key: 'reCaptcha',
        value: 'false',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        required: true,
        editable: false
    };
    var reCaptchaSecret = {
        id: 'p8Ah9cz9',
        description: 'Google Private API KEY',
        type: 'string',
        multiple: false,
        model: '',
        key: 'reCaptchaSecret',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'co1HzCz6',
        required: false,
        editable: false,
        tooltip: 'Google Private API KEY',
    };
    var reCaptchaPublicKey = {
        id: '2htG0Cz9',
        description: 'Google Public API KEY',
        type: 'string',
        multiple: false,
        model: '',
        key: 'reCaptchaPublicKey',
        value: '',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'co1HzCz6',
        required: false,
        editable: false,
        tooltip: 'Google Public API KEY',

    };

    var reCaptchaFrontend = {
        id: '3gqG0Cz9',
        description: 'Enable frontend captcha',
        type: 'boolean',
        multiple: false,
        model: '',
        key: 'reCaptchaFrontend',
        value: 'false',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'co1HzCz6',
        required: false,
        editable: false
    };
    var reCaptchaAdmin = {
        id: '2va4ACz9',
        description: 'Enable admin captcha',
        type: 'boolean',
        multiple: false,
        model: '',
        key: 'reCaptchaAdmin',
        value: 'false',
        updatedBy: '',
        createdAt: now,
        updatedAt: now,
        category: 'integrations',
        parent: 'co1HzCz6',
        required: false,
        editable: false
    };

    return Promise.all([
        knex.insert(socialNetworks).into('config'),
        knex.insert(facebook).into('config'),
        knex.insert(twitter).into('config'),
        knex.insert(instagram).into('config'),
        knex.insert(pinterest).into('config'),
        knex.insert(youtube).into('config'),
        knex.insert(googlePlus).into('config'),
        knex.insert(linkedin).into('config'),
        knex.insert(github).into('config'),
        knex.insert(googleAnalytics).into('config'),
        knex.insert(googleAnalyticsAccount).into('config'),
        knex.insert(disqus).into('config'),
        knex.insert(disqusDisableMobile).into('config'),
        knex.insert(disqusConfigLanguage).into('config'),
        knex.insert(disqusApiKey).into('config'),
        knex.insert(disqusRemoteAuthS3).into('config'),
        knex.insert(reCaptcha).into('config'),
        knex.insert(reCaptchaSecret).into('config'),
        knex.insert(reCaptchaPublicKey).into('config'),
        knex.insert(reCaptchaAdmin).into('config'),
        knex.insert(reCaptchaFrontend).into('config'),


        knex('config').where('key', '=', 'defaultStatus').update({
            category: 'site',
            required: true,
            editable: false,
            description: 'Default status'
        }),
        knex('config').where('key', '=', 'frontEndPagination').update({
            category: 'site',
            required: false,
            editable: false,
            description: 'Frontend pagination'
        }),
        knex('config').where('key', '=', 'adminPagination').update({
            category: 'site',
            required: false,
            editable: true,
            description: 'Admin pagination'
        }),
        knex('config').where('key', '=', 'frontEndUrl').update({
            category: 'site',
            required: true,
            editable: false,
            description: 'Frontend Url'
        }),
        knex('config').where('key', '=', 'mapPointsLimit').update({
            category: 'visualizations',
            required: true,
            editable: true,
            description: 'Points limit on map creation'
        }),
        knex('config').where('key', '=', 'defaultMaxZoom').update({
            category: 'visualizations',
            required: true,
            editable: true,
            description: 'Max zoom on basemap creation'
        }),
        knex('config').where('key', '=', 'defaultMinZoom').update({
            category: 'visualizations',
            required: true,
            editable: true,
            description: 'Min zoom on basemap creation'
        }),
        knex('config').where('key', '=', 'defaultOrganization').update({
            category: 'site',
            required: false,
            editable: true,
            description: 'Default organization'
        }),
        knex('config').where('key', '=', 'logWhitelist').update({
            category: 'site',
            required: true,
            editable: false,
            description: 'Logged models',
            tooltip: 'Split with commas for more than one entity'
        }),
        knex('config').where('key', '=', 'defaultOptionals').update({
            category: 'site',
            required: false,
            editable: true,
            tooltip: 'Split with commas for more than one field',
            description: 'Default optionals'
        }),
    ])
    // .catch(function(error) {
    //     console.log(error);
    // });
};

exports.down = function(knex, Promise) {

};
