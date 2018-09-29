const child_process = require('child_process');
let lastUsedDebugPort = 0;

exports.fork = function fork(modulePath /* , args, options */) {

    let args = {};
    if(lastUsedDebugPort == 0)
    {
        lastUsedDebugPort = process.debugPort;
    }

    const inspectParamIndex = process.execArgv.findIndex(arg => { return arg.includes("--inspect-brk"); });
    if(inspectParamIndex != -1)
    {
        lastUsedDebugPort = lastUsedDebugPort + 1;
        process.execArgv[inspectParamIndex] = process.execArgv[inspectParamIndex].replace(/(--inspect-brk=)(\d*)/, "$1" + lastUsedDebugPort);
    }

    if(arguments.length > 1)
    {
        args = arguments[1];
    }    
    
    return child_process.fork(modulePath, args);
}