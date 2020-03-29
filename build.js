global.fs = require('fs');
global.uglify = require("uglify-es");

const SRC_DIR = './src/';
const DIST_DIR = './dist/';

let sourceFileNames = ['ProcessStatus.js', 'Process.js', 'ProcessQueue.js', 'DecoratedProcess.js', 'DecoratedProcessQueue.js'];
let code = '';
let minifiedCode = '';
sourceFileNames.forEach(fileName => {
    let originalCode = fs.readFileSync(SRC_DIR + fileName).toString('utf8');
    let originalCodeLines = originalCode.split('\n');
    originalCodeLines.forEach(line => {
        if (!/require(.*)/.test(line) && !line.startsWith('module.exports')) {
            code += line + '\n';
        }
    })
    code += '\n';
});
minifiedCode = uglify.minify(code);
if(!fs.existsSync(DIST_DIR)){
    fs.mkdirSync(DIST_DIR);
}
fs.writeFileSync(DIST_DIR+'process.js',code);
fs.writeFileSync(DIST_DIR+'process.min.js',minifiedCode.code);