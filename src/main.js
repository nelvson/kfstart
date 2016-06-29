import path from 'path';
import program from 'commander';
import sh from 'shelljs';
import {version} from '../package.json';
import {spawn} from 'child_process';

let wasHandled = false;
let basePath = path.join(__dirname, '..');

const CONFIG = {
  react: {
    configFiles: {
      'default.babelrc': '.babelrc',
      'default.eslintignore': '.eslintignore',
      'default.eslintrc': '.eslintrc',
      'default.flowconfig': '.flowconfig',
      'default.gitignore': '.gitignore',
      test: '',
      'webpack.config.js': '',
    },
    mkdir: ['assets', 'src', 'node_modules'],
    packages: [
      // react
      'react', 'react-dom', 'class-autobind', 'classnames',
    ],
    devPackages: [
      // babel (with react)
      'babel-core', 'babel-preset-es2015', 'babel-preset-react', 'babel-preset-stage-2', 'babel-plugin-transform-class-properties',
      // eslint (with react)
      'eslint', 'babel-eslint', 'eslint-plugin-babel', 'eslint-plugin-flow-vars', 'eslint-plugin-react',
      // flow
      'flow-bin',
      // webpack
      'webpack', 'webpack-dev-server', 'babel-loader', 'css-loader', 'css-modules-require-hook', 'raw-loader', 'style-loader',
      // testing
      'mocha', 'expect', 'enzyme',
    ],
  },
};

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
  if (!CONFIG.hasOwnProperty(type)) {
    console.log(`Type "${type}" not yet supported.`);
    return;
  }
  let config = CONFIG[type];
  let starterPath = `${basePath}/starter/react-web`;
  console.log(`Creating directory "${name}" ...`);
  sh.mkdir(name);
  sh.cd(name);
  console.log('Writing package.json ...');
  let pkgJSON = sh.cat(`${starterPath}/default-package.json`);
  let pkg = JSON.parse(pkgJSON);
  pkg.name = name;
  pkg.description = name;
  sh.ShellString(JSON.stringify(pkg, null, 2)).to('./package.json');
  console.log('Copying config files ...');
  let {configFiles, mkdir} = config;
  for (let srcFile of Object.keys(configFiles)) {
    let dstFile = configFiles[srcFile];
    sh.cp('-R', `${starterPath}/${srcFile}`, `./${dstFile}`);
  }
  console.log('Creating direcotries ...');
  if (mkdir && mkdir.length) {
    sh.mkdir(...mkdir);
  }
  sh.ShellString('console.log(\'Hello World\');\n').to('./src/main.js');
  console.log('Installing packages ...');
  installPackages(config.packages, 'save', () => {
    console.log('Installing dev packages ...');
    installPackages(config.devPackages, 'save-dev', () => {
      console.log('Project created successfully.');
    });
  });
}

function installPackages(packages, save, callback) {
  let args = ['install'];
  if (save) {
    args.push(`--${save}`);
  }
  args = args.concat(packages);
  let child = spawn('npm', args, {cwd: process.cwd, stdio: 'inherit'});
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`npm exited with code ${code}`);
      process.exit();
    } else {
      callback();
    }
  });
}
