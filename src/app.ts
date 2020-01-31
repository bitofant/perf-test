import logger from 'standalone-logger';
const log = logger(module);
import config from "./config";
import request = require("request");

log(config.endpoints.join('\n'));
