const vm = require('vm');
const fs = require('fs');
const path = require('path');

function getResolvePath(reqest, paths) {
  const jsPath = require.resolve(reqest, {paths});
  return jsPath;
}
class RequireVmModule {
  constructor(filename, contextObject= {}, options={}, moduleMap={}, isCache=false) {
    this.filename = filename;
    this.contextObject = contextObject;
    this.options = options;
    this.moduleMap = moduleMap;
    this.isCache = isCache;
    this._cacheMap = {};
  }

  createRequireVm(filename) {
    const requireVmModuleInstance = new RequireVmModule(filename, this.contextObject, Object.assign({
      ...this.options,
    }, {paths:[path.dirname(filename)]}), this.moduleMap, this.isCache);
    return function(reqest){
      return requireVmModuleInstance.requireVm(reqest);
    };
  }

  requireVm(reqest) {
    if(this.moduleMap[reqest]) {
      return this.moduleMap[reqest];
    }
    const jsPath = getResolvePath(reqest, this.options.paths);
    if(!path.isAbsolute(jsPath)) {
      throw new Error(`can't find module<${jsPath}>,you maybe need moduleMap params`);
    }
    let jsCode = 'var require;' + 
      'if(module.createRequire){'+
        'require = module.createRequire(__filename)'+
      '};';
    let codeScript;
    if(this.isCache && this._cacheMap[jsPath]){
      jsCode += this._cacheMap[jsPath].code;
      codeScript = this._cacheMap[jsPath].script;
      this.options.cachedData = this._cacheMap[jsPath].cachedData;
    } else {
      if(!fs.existsSync(jsPath)) {
        throw new Error(`can't find file:${jsPath}`);
      }
      jsCode += fs.readFileSync(jsPath);
      codeScript = new vm.Script(jsCode, this.options);
      if(this.isCache && codeScript.createCachedData) {
        this._cacheMap[jsPath] = {
          code:jsCode,
          script:codeScript,
          cachedData:codeScript.createCachedData(),
        };
      }
    }
    if(!this.options.filename) {
      this.options.filename = jsPath;
    }
    if(!this.contextObject.__dirname) {
      this.contextObject.__dirname = path.dirname(jsPath);
    }
    if(!this.contextObject.__filename) {
      this.contextObject.__filename = jsPath;
    }
    if(!this.contextObject.module) {
      this.contextObject.module = {};
    }
    if(!this.contextObject.module.exports) {
      this.contextObject.module.exports = {};
    }
    if(!this.contextObject.module.createRequire) {
      this.contextObject.module.createRequire = this.createRequireVm;
    }
    this.contextObject.exports = this.contextObject.module.exports;
    codeScript.runInNewContext(this.contextObject, this.options);
    return this.contextObject.module.exports;
  }
}

function requireVm(reqest, contextObject={}, options={}, moduleMap={}, isCache=false) {
  if(!options.paths) {
    const resolvePath = [];
    if(module.parent && module.parent.filename) {
      resolvePath.push(path.dirname(module.parent.filename), ...module.parent.paths);
    }
    options.paths = resolvePath;
  }
  const filename = getResolvePath(reqest, options.paths);
  const requireVmModuleInstance = new RequireVmModule(filename, contextObject, options, moduleMap, isCache);
  return requireVmModuleInstance.requireVm(reqest);
}
module.exports = requireVm;
module.exports.default = requireVm;
module.exports.requireVm = requireVm;
module.exports.RequireVmModule = RequireVmModule;