const klark = require('klark-js');
const argv = require('yargs').argv;

const modules = `plugins/**/index.js`;
const subModules = `plugins/**/*.module.js`;
const testModules = `plugins/**/*-test.module.js`;
const serverStartModule = `plugins/server/index.js`;
const scriptModules = `plugins/scripts`;
const klarkPlugins = `node_modules/klark-js-plugins/plugins/**/*.js`;
// const klarkPlugins = `../../Gitlab/klark-plugins/plugins/**/*.js`;
// const exceptModelsApp = `!node_modules/klark-js-plugins/plugins/models/app/**`;

const srcPaths = [
  modules,
  subModules,
  klarkPlugins
  // ,
  // exceptModelsApp
];

const script = argv.script;
const isTestEnv = process.env.UNIT_TEST;
if (script) {
  const scriptPath = `plugins/scripts/${script}.js`;
  srcPaths.push(scriptPath);
  srcPaths.push(`!${serverStartModule}`);
  srcPaths.push(`!${testModules}`);
} else if (isTestEnv) {
  srcPaths.push(`!${serverStartModule}`);
  srcPaths.push(`!${scriptModules}`);
} else {
  srcPaths.push(`!${testModules}`);
  srcPaths.push(`!${scriptModules}`);
}

const klarkApiPromise = klark.run({
  predicateFilePicker: () => srcPaths,
  logLevel: 'off'
});

if (isTestEnv) {
  describe('Main', () => {
    it('Should bootstrap normaly', cb => {
      klarkApiPromise.then(klarkApi => cb());
    }).timeout(5000);
  });
} else if (!script) {
  klarkApiPromise.then(klarkApi => {
    klarkApi.injectInternalModuleFromMetadata('main', (krkServer, app) => {
      krkServer.start(app);
    })
    .catch(e => console.error(e));
  });
}
