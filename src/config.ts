import { readFileSync, existsSync, writeFile, writeFileSync } from "fs";
import { validate, JSONSchema7 } from "json-schema";
import logger from 'standalone-logger';
const log = logger(module);


interface AppConfig {
  $schema: string,
  endpoints: string[]
}

function createConfigTemplate () {
  let template: AppConfig = {
    $schema: './config-schema.json',
    endpoints: [
      'https://example.com/',
      'https://example.com/?p=login'
    ]
  };
  writeFileSync('config.json', JSON.stringify(template, null, 2), 'utf8');
  log('config missing; created a <config.json> in project directory');
}

function loadSchema (): JSONSchema7 {
  return JSON.parse(readFileSync('config-schema.json', 'utf8'));
}

function loadConfig (): AppConfig {
  if (!existsSync('config.json')) {
    createConfigTemplate();
    process.exit(1);
  }
  const cfgFile = readFileSync('config.json', 'utf8');
  const config: AppConfig = JSON.parse(cfgFile);
  if (config.endpoints.find(ep => ep.includes('example.com'))) {
    log('please adapt your <config.json> to your needs');
    process.exit(1);
  }
  const validation = validate(config, loadSchema());
  if (!validation.valid) {
    log('your <config.json> has errors');
    validation.errors.forEach(err => log(err));
    process.exit(1);
  }
  return config;
}

const config = loadConfig();
export default config;
