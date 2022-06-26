const spawn = require('child_process').spawn;
//@param commend    {string}   bash command
//@param opt        {Object}   opt
//@param opt.onData {Function} called when script writes new line
//
//@returns {Object}
//  resultCode {int}
//  command    {string}
//  lines      {Array of string}
function run(command, opt) {
  return new Promise(function(resolve, reject){
    if (!command || typeof command != 'string') {
      reject({
        resultCode:-1,
        command:command,
        lines:["ERROR NO_COMMAND"]
      });
    }

    const result = {resultCode:0, command:command, lines:[]}    

    try{
      const cmd_args = command.split(" ");
      const cmd = cmd_args[0];
      cmd_args.shift();
    
      const proc = spawn(cmd, cmd_args);

      proc.stdout.on('data', function (data) {
        const s = data.toString('utf8');
        result.lines.push(s);
        if (opt && opt.onData) {
          if (typeof opt.onData == 'function'){
            opt.onData(s);
          } else {
            result.lines.push('\nERROR opt.onData is not a function\n');
          }
        }
      });

      proc.stderr.on('data', function (data) {
        const s = data.toString('utf8');
        result.lines.push(s);
        if (opt && opt.onData) {
          if (typeof opt.onData == 'function'){
            opt.onData(s);
          } else {
            result.lines.push('\nERROR opt.onData is not a function\n');
          }
        }
      });

      proc.on('exit', function (code) {
        result.lines.push('\nEXIT '+ code);
        result.lines = result.lines.join("").split(/[\n\r]/g);

        if (code == 0) { 
          resolve(result);
        } else {
          result.resultCode = code;
          reject(result);
        }
      });

      proc.on('error', function (data) {
        result.lines.push('\nERROR '+ data.toString('utf8'));
        result.lines = result.lines.join("").split(/[\n\r]/g);
        reject(result);
      });

    } catch (err) {
      result.resultCode = -1;
      result.lines.push('\nERROR '+ err.stack);
      result.lines = result.lines.join("").split(/[\n\r]/g);
      reject(result);
    }
  })
}

module.exports = {runScript:run};
