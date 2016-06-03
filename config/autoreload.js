module.exports.autoreload = {
    active: true,
    usePolling: false,
    dirs: [
        "api/models",
        "api/controllers",
        "api/services",
        "api/blueprints",
        "api/hooks",
        "api/policies",
        "api/responses"
    ],
    overrideMigrateSetting: false,
    ignored: ['i18n']
};