const vm = require('vm');
const fs = require('fs');
const path = require('path');

function requireVm(reqest, contextObject={}, options={}, moduleMap={}, isCache=false) {
  if(moduleMap[reqest]) {
    return moduleMap[reqest];
  }
  if(!options.paths) {
    const resolvePath = [];
    if(module.parent && module.parent.path) {
      resolvePath.push(module.parent.path, ...module.parent.paths);
    }
    options.paths = resolvePath;
  }
  const jsPath = require.resolve(reqest, {paths:options.paths});
  if(!path.isAbsolute(jsPath)) {
    throw new Error(`can't find module<${jsPath}>,you maybe need moduleMap params`);
  }
  let jsCode;
  let codeScript;
  if(isCache && requireVm.cacheMap[jsPath]){
    jsCode = requireVm.cacheMap[jsPath].code;
    codeScript = requireVm.cacheMap[jsPath].script;
    options.cachedData = requireVm.cacheMap[jsPath].cachedData;
  } else {
    if(!fs.existsSync(jsPath)) {
      throw new Error(`can't find file:${jsPath}`);
    }
    jsCode = fs.readFileSync(jsPath);
    codeScript = new vm.Script(jsCode, options);
    if(isCache) {
      requireVm.cacheMap[jsPath] = {
        code:jsCode,
        script:codeScript,
        cachedData:codeScript.createCachedData(),
      };
    }
  }
  if(!options.filename) {
    options.filename = jsPath;
  }
  contextObject.module = {
    exports:{},
  };
  contextObject.exports = contextObject.module.exports;
  if(!contextObject.__dirname) {
    contextObject.__dirname = path.dirname(jsPath);
  }
  if(!contextObject.__filename) {
    contextObject.__filename = jsPath;
  }
  codeScript.runInNewContext(contextObject, options);
  return contextObject.module.exports;
}

requireVm.cacheMap = {};

module.exports = requireVm;
module.exports.default = requireVm;
module.exports.requireVm = requireVm;