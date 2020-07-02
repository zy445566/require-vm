const vm = require("vm");
const fs = require("fs");
const path = require("path");
function requireVm(reqest,contextObject={},options={},moduleMap={}) {
    if(moduleMap[reqest]) {
        return moduleMap[reqest];
    }
    const resolvePath = [];
    if(module.parent && module.parent.path) {
        resolvePath.push(module.parent.path,...module.parent.paths);
    }
    const jsPath = require.resolve(reqest,{paths:resolvePath});
    if(!path.isAbsolute(jsPath)) {
        throw new Error(`can't find module<${jsPath}>,you maybe nedd moduleMap params`);
    }
    if(!fs.existsSync(jsPath)) {
        throw new Error(`can't find file:${jsPath}`);
    }
    let jsCode = fs.readFileSync(jsPath);
    options.filename = jsPath;
    contextObject.module = {
        exports:{},
    };
    contextObject.exports = contextObject.module.exports;
    contextObject.__dirname = path.dirname(jsPath);
    contextObject.__filename = jsPath;
    vm.runInNewContext(jsCode,contextObject,options);
    return contextObject.module.exports;
}
module.exports = requireVm;
module.exports.default = requireVm;
module.exports.requireVm = requireVm;