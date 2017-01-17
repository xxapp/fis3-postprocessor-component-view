var cssModulesSync = require('postcss-modules-sync');
var postcss = require('postcss');
var htmlCompiler = require('vue-template-compiler');

module.exports = function (content, file, setting) {
    var output = htmlCompiler.parseComponent(content.toString(), { pad: true });
    var exportedTokens = {}, content;
    var rAttr = /(class[\s\n]*=[\s\n]*)('|")([^\2]*?)\2/g, result;
    var rClassName = /[\n\s]*([^\n\s]*)[\n\s]*/g;

    output['styles'].forEach(function(item, index) {
        if (item.content) {
            var styleFileName, styleFile, styleContent;
            var tokenFile, tokenContent;

            if (output['styles'].length == 1) {
                styleFileName = file.realpathNoExt + '.css';
            } else {
                styleFileName = file.realpathNoExt + '-' + index + '.css';
            }

            var styles = postcss([
                cssModulesSync.default({
                    getTokens: function (tokens) {
                        exportedTokens = fis.util.merge(exportedTokens ,tokens);
                    }
                })
            ]).process(item.content).css;

            // css
            styleFile = fis.file.wrap(styleFileName);

            styleContent = fis.compile.partial(styles, file, {
                ext: item.lang || 'css',
                isCssLike: true
            });

            styleFile.cache = file.cache;
            styleFile.isCssLike = true;
            styleFile.setContent(styleContent);
            fis.compile.process(styleFile);
            styleFile.links.forEach(function(derived) {
                file.addLink(derived);
            });
            file.derived.push(styleFile);
            file.addRequire(styleFile.getId());
        }
    });

    // token
    // tokenFile = fis.file.wrap(file.realpathNoExt + '1.js');
    // tokenContent = fis.compile.partial('define(\'ms-control-file-token\', function(require, exports, module) {modules.exports = ' + JSON.stringify(exportedTokens) + '});', file, {
    //     ext: 'js',
    //     isJsLike: true
    // });

    // tokenFile.cache = file.cache;
    // tokenFile.isJsLike = true;
    // tokenFile.setContent(tokenContent);
    // file.derived.push(tokenFile);
    // file.addRequire(tokenFile.getId());

    if (!output.template) {
        throw new Error('tag "tempate" not found.');
    }
    content = output.template.content || content;
    do {
        content = content.replace(rAttr, function (s, attrName, quote, attrValue) {
            if (s && attrValue) {
                // 'class=' + '"' + 'btn btn-info' + '"'
                return attrName + quote + attrValue.replace(rClassName, function (s, className, index) {
                    return (index ? ' ' : '') + (exportedTokens[className] || className);
                }) + quote;
            } else {
                return '';
            }
        });
    } while (rAttr.lastIndex != 0)

    return content;
}