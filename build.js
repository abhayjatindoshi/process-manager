global.fs = require('fs');
global.uglify = require("uglify-es");

const SRC_DIR = './src/';
const DIST_DIR = './dist/';

var sourceFileNames = fs.readdirSync(SRC_DIR);
var code = '';
var minifiedCode = '';
for(var i = 0; i < sourceFileNames.length ; i++){
    var originalCode = fs.readFileSync(SRC_DIR+sourceFileNames[i]);
    code += originalCode.toString('utf8') + '\n';
}
minifiedCode = uglify.minify(code);
if(!fs.existsSync(DIST_DIR)){
    fs.mkdirSync(DIST_DIR);
}
fs.writeFileSync(DIST_DIR+'process.js',code);
fs.writeFileSync(DIST_DIR+'process.min.js',minifiedCode.code);