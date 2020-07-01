# require-vm
more safe require

# install
```sh
npm install require-vm
```

# example
```js
const requireVm = require('require-vm');
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
```
# API
####  requireVm @return any
|ParamName |Must|Type|Default|Remark|
|:----    |:---|:----- |:----- |-----   |
|reqest |yes  |string |  / | module name or js filename  |
|contextObject |no  |Object |  {}   |   |
|options |no  |Object |  {}   | [contextobject_options](https://nodejs.org/dist/latest/docs/api/vm.html#vm_vm_runinnewcontext_code_contextobject_options)  |
|moduleMap |no  |Object |  {}   |   |