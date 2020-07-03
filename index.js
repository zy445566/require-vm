const vm = require("vm");
const fs = require("fs");
const path = require("path");
const cacheMap = {};
function requireVm(reqest,contextObject={},options={},moduleMap={},isCache=false) {
    if(moduleMap[reqest]) {
        return moduleMap[reqest];
    }
    const resolvePath = [];
    if(module.parent && module.parent.path) {
        resolvePath.push(module.parent.path,...module.parent.paths);
    }
    const jsPath = require.resolve(reqest,{paths:resolvePath});
    if(!path.isAbsolute(jsPath)) {
        throw new Error(`can't find module<${jsPath}>,you maybe need moduleMap params`);
    }
    let jsCode;
    let codeScript;
    if(isCache && cacheMap[jsPath]){
        jsCode = cacheMap[jsPath].code;
        codeScript = cacheMap[jsPath].script;
        options.cachedData = cacheMap[jsPath].cachedData;
    } else {
        if(!fs.existsSync(jsPath)) {
            throw new Error(`can't find file:${jsPath}`);
        }
        jsCode = fs.readFileSync(jsPath);
        codeScript = new vm.Script(jsCode,options);
    }
    if(isCache) {
        cacheMap[jsPath] = {
            code:jsCode,
            script:codeScript,
            cachedData:codeScript.createCachedData()
        }
    }
    options.filename = jsPath;
    contextObject.module = {
        exports:{},
    };
    contextObject.exports = contextObject.module.exports;
    contextObject.__dirname = path.dirname(jsPath);
    contextObject.__filename = jsPath;
    codeScript.runInNewContext(contextObject,options);
    return contextObject.module.exports;
}
module.exports = requireVm;
module.exports.default = requireVm;
module.exports.requireVm = requireVm;