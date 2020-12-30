export function requireVm(reqest:string,contextObject:Object,options:Object,moduleMap:Object,isCache:boolean):any;
export default function requireVm(reqest:string,contextObject:Object,options:Object,moduleMap:Object,isCache:boolean):any;
export class RequireVmModule {
  constructor(filename:string, contextObject:Object, options:Object, moduleMap:Object, isCache:boolean);

  createRequireVm(filename:string):(reqest:string)=>any;

  requireVm(reqest:string):any;
}