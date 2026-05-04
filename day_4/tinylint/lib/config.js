const fs = require('fs');
const path = require('path');

function loadConfig(configPath = path.resolve(process.cwd(), '.tinylintrc.json')) {

    try {
      const raw = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return { rules: {} };
      }
      throw new Error(`Failed to parse .tinylintrc.json: ${err.message}`);
    }
  }

module.exports = { loadConfig };