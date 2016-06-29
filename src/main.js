import path from 'path';
import program from 'commander';
import sh from 'shelljs';
import {version} from '../package.json';
import {spawn} from 'child_process';

let wasHandled = false;
let basePath = path.join(__dirname, '..');

program
  .version(version)
  .usage('init <project_name> [options]')
  .option('-t, --type [react|react-native|node]', 'Create a project of the given type.', 'react');

program.command('init <project_name>')
  .description('Create a directory with the given name and initialize an empty project.')
  .action((name) => {
    wasHandled = true;
    createProject(name, program.type);
  });

program.parse(process.argv);
if (!wasHandled) {
  program.help();
}

function createProject(name, type) {
  if (type !== 'react') {
    console.log(`Type "${type}" not yet supported.`);
    return;
  }
  let starterPath = `${basePath}/starter/react-web`;
  // let outputPath = path.join(process.cwd(), name);
  sh.mkdir(name);
  sh.cd(name);
  let pkgJSON = sh.cat(`${starterPath}/default-package.json`);
  let pkg = JSON.parse(pkgJSON);
  pkg.name = name;
  pkg.description = name;
  sh.ShellString(JSON.stringify(pkg, null, 2)).to('./package.json');
  sh.cp(`${starterPath}/.babelrc`, './');
  sh.cp(`${starterPath}/.eslintignore`, './');
  sh.cp(`${starterPath}/.eslintrc`, './');
  sh.cp(`${starterPath}/.flowconfig`, './');
  sh.cp(`${starterPath}/.gitignore`, './');
  sh.cp('-R', `${starterPath}/test`, './');
  sh.cp(`${starterPath}/webpack.config.js`, './');
  sh.mkdir('assets', 'src', 'node_modules');
  sh.ShellString('console.log(\'Hello World\');\n').to('./src/main.js');
  let args = (
    'install --save-dev ' +
    // babel (with react)
    'babel-core babel-preset-es2015 babel-preset-react babel-preset-stage-2 babel-plugin-transform-class-properties ' +
    // eslint (with react)
    'eslint babel-eslint eslint-plugin-babel eslint-plugin-flow-vars eslint-plugin-react ' +
    // flow
    'flow-bin ' +
    // webpack
    'webpack webpack-dev-server babel-loader css-loader css-modules-require-hook raw-loader style-loader ' +
    // react
    'react react-dom class-autobind classnames ' +
    // testing
    'mocha expect enzyme'
  ).split(' ');
  let child = spawn('npm', args, {cwd: process.cwd, stdio: 'inherit'});
  child.on('close', (code) => {
    console.log(`npm exited with code ${code}`);
  });
}
