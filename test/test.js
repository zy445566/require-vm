const {requireVm} = require('../index');
// example a------------------------------------------------------
/**
 * ./a.js:
 * module.exports = {__dirname,__filename};
 */
const moduleA = requireVm('./a.js');
console.log(moduleA);
/**
 * output:
 * {
 * __dirname: 'D:\\Github\\require-vm\\test',
 * __filename: 'D:\\Github\\require-vm\\test\\a.js'
 * }
 */

// example b ------------------------------------------------------
let contextB = {setTimeout};
requireVm('./b.js', contextB);
console.log(contextB);
/**
 * output:
 * {
 * setTimeout: [Function: setTimeout] { [Symbol(util.promisify.custom)]: [Function] },
 * module: { exports: {} },
 * exports: {},
 * __dirname: 'D:\\Github\\require-vm\\test',
 * __filename: 'D:\\Github\\require-vm\\test\\b.js'
 * }
 */
// If a file has a memory leak, it can be deleted as an unreachable object
delete contextB; 

// example c ------------------------------------------------------
// use cache,Do not open it unless repeat run requireVm function with same module name
const cache = true;
for(let i=0;i<1000;i++) {
  requireVm('./c.js', {}, {}, {}, cache);
}


// other example ------------------------------------------------------
const moduleMap ={
  'fs':{
    readFileSync(filePath, options={}) {
      return require('fs').readFileSync(filePath, options);
    },
  },
};
const fs = requireVm('fs', {}, {}, moduleMap); // only readFileSync'fs
console.log(fs);
/**
 * output:
 * { readFileSync: [Function: readFileSync] }
 */

// // grandchildren reference ------------------------------------------------------
const moduleAP1 = requireVm('./ap/ap1.js');
console.log(moduleAP1);
/**
 * output:
 * {
 *   __dirname: 'D:\\Github\\require-vm\\test\\ap',
 *   __filename: 'D:\\Github\\require-vm\\test\\ap\\ap1.js',
 *   ap2: {
 *     __dirname: 'D:\\Github\\require-vm\\test\\ap',
 *     __filename: 'D:\\Github\\require-vm\\test\\ap\\ap2.js',
 *     a: {
 *       __dirname: 'D:\\Github\\require-vm\\test',
 *       __filename: 'D:\\Github\\require-vm\\test\\a.js'
 *     }
 *   }
 * }
 */