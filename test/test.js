const {requireVm} = require('../index');
const assert = require('assert');
const path = require('path');
// example a------------------------------------------------------
const testUnit = {
  [Symbol('test.export')] : async function() {
    /**
     * ./a.js:
     * module.exports = {__dirname,__filename};
     */
    const moduleA = requireVm('./a.js');
    assert.strictEqual(JSON.stringify(moduleA), JSON.stringify({
      __dirname: __dirname,
      __filename: path.join(__dirname, 'a.js'),
    }));
  },
  [Symbol('test.function.import')] : async function() {
    let contextB = {setTimeout};
    requireVm('./b.js', contextB);
    assert.deepStrictEqual(contextB.setTimeout, setTimeout);
    // If a file has a memory leak, it can be deleted as an unreachable object
    // delete contextB; 
  },
  [Symbol('test.cache.import')] : async function() {
    // use cache,Do not open it unless repeat run requireVm function with same module name
    const cache = true;
    for(let i=0;i<1000;i++) {
      requireVm('./c.js', {}, {}, {}, cache);
    }
  },
  [Symbol('test.moduleMap')] : async function() {
    // moduleMap example ------------------------------------------------------
    const moduleMap ={
      'fs':{
        readFileSync(filePath, options={}) {
          return require('fs').readFileSync(filePath, options);
        },
      },
    };
    const fs = requireVm('fs', {}, {}, moduleMap); // only readFileSync'fs
    assert.deepStrictEqual(fs, moduleMap['fs']);
  },
  [Symbol('test.grandchildren.reference')] : async function() {
    // grandchildren reference ------------------------------------------------------
    const moduleAP1 = requireVm('./ap/ap1.js');
    assert.strictEqual(JSON.stringify(moduleAP1), 
      JSON.stringify({
        __dirname: path.join(__dirname, 'ap'),
        __filename: path.join(__dirname, 'ap', 'ap1.js'),
        ap2: {
          __dirname: path.join(__dirname, 'ap'),
          __filename: path.join(__dirname, 'ap', 'ap2.js'),
          a: {
            __dirname: __dirname,
            __filename: path.join(__dirname, 'a.js'),
          },
        },
      }),
    );
  },
};

async function run(testUnitList) {
  for(let testUnitValue of testUnitList) {
    for(let testFunc of Object.getOwnPropertySymbols(testUnitValue)) {
      await testUnitValue[testFunc]();
    }
  }
}
(async function() {
  await run([testUnit]);
})();