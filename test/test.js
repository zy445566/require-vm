const requireVm = require('../index');
// example 1 ------------------------------------------------------
/**
 * ./a.js:
 * module.exports = {__dirname,__filename};
 */
const moduleA = requireVm('./a.js');
console.log(moduleA)
/**
 * output:
 * {
 * __dirname: 'D:\\Github\\require-vm\\test',
 * __filename: 'D:\\Github\\require-vm\\test\\a.js'
 * }
 */

// example 2 ------------------------------------------------------
let contextB = {setTimeout}
requireVm('./b.js',contextB)
console.log(contextB)
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
delete contextB 

// example 3 ------------------------------------------------------
const moduleMap ={
    'fs':{
        readFileSync(filePath,options={}) {
            return require('fs').readFileSync(filePath,options)
        }
    }
}
const fs = requireVm('fs',{},{},moduleMap) // only readFileSync'fs
console.log(fs)
/**
 * output:
 * { readFileSync: [Function: readFileSync] }
 */