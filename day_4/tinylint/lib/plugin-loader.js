const path = require('path');

function loadPlugins(pluginPaths) {
  return pluginPaths.reduce((rules, pluginPath) => {
    let plugin;
    try {
      plugin = require(path.resolve(pluginPath));
    } catch (err) {
      throw new Error(`Cannot load plugin '${pluginPath}': ${err.message}`);
    }
    return { ...rules, ...plugin.rules };
  }, {});
}

module.exports = { loadPlugins };