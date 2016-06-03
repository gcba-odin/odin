module.exports.autoreload = {
    active: true,
    usePolling: false,
    dirs: [
        "api/models",
        "api/controllers",
        "api/services"
    ],
    overrideMigrateSetting: true,
    ignored: ['i18n']
};