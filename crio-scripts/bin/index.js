#! /usr/bin/env node --max-old-space-size=10240

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex((x) => x === 'build' || x === 'start' || x === 'test');

const shouldInstrument = args.includes('--instrument') ? '-r @cypress/instrument-cra' : '';
if (shouldInstrument) {
  args.splice(args.indexOf('--instrument'), 1);
}

const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const envs = {
  dev: 'development',
  prod: 'production',
  qa: 'qa',
  staging: 'staging',
  local: 'development.local',
  test: 'test',
};

switch (script) {
  case 'build':
  case 'start':
  case 'test': {
    const chosenEnv = args[scriptIndex + 1] || '--local';
    const envName = envs[chosenEnv.replace('--', '')];
    const envLocation = path.resolve(process.cwd(), `.env.${envName}`);
    if (!fs.existsSync(envLocation)) {
      process.stdout.write("The specified env file isn't found!");
      process.exit(1);
    }
    const command = `env-cmd -f .env.${envName} react-scripts ${shouldInstrument} ${script}`;
    const [cmd, ...restArgs] = command.split(' ');
    console.log('Running, please wait...');
    spawn(cmd, restArgs, {
      cwd: process.cwd(),
      shell: true,
      stdio: 'inherit',
    });
    break;
  }
  default:
    console.log('Unknown script "' + script + '".');
}
process.on('SIGINT', () => process.exit(1));
