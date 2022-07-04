const providers = require('./services/providers')
const bootstrap = require('./bootstrap')

module.exports = (plugin) => {
  plugin.bootstrap = bootstrap
  plugin.services.providers = providers

  return plugin;
};
