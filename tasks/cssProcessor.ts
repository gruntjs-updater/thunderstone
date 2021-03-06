﻿import grunt = require("grunt");
import css = require("css");
import path = require("path");
import _ = require("underscore");
export function loadCssFiles(patterns:string[]):ICssFile[] {
    var cssPaths: string[] = grunt.file.expand(patterns);
    var cssFiles: ICssFile[] = [];
    for (var i: number = 0; i < cssPaths.length; i++) {
        cssFiles.push(parseCssFile(cssPaths[i]));
    }
    return sortCssFiles(cssFiles);
}

function parseCssFile(cssPath: string): ICssFile {
    var cssContent: string = grunt.file.read(cssPath);
    var cssObject: css.ICss = css.parse(cssContent);
    var cssFile: ICssFile = {
        relativePath: cssPath,
        selectors: getSelectorsFromCssObject(cssObject),
        fileName: path.basename(cssPath),
        usageResults: [],
        id: createID(path.basename(cssPath))
    };
    return cssFile;
}

function createID(fileName: string): string {
    return fileName.toLowerCase()
        .replace(/[^a-zA-Z0-9-_]+/g, '-')
        .replace(/^-+|\n|-+$/g, '');
}

function getSelectorsFromCssObject(cssObject:css.ICss):string[] {
    var selectors: string[] = [];
    for (var r: number = 0; r < cssObject.stylesheet.rules.length; r++) {
        var rule: css.IRule = cssObject.stylesheet.rules[r];
        if(rule.selectors && isValidSelector(rule.selectors)){
            selectors = selectors.concat(rule.selectors);
        }
    }
    return selectors;
}

function isValidSelector(selectorPieces:string[]):boolean{
    var selector:string = selectorPieces.join(" ");
    var invalidSelectors:string[] = 
    [":hover",
    ":visited",
    "::-webkit-input-placeholder",
    "::-moz-placeholder",
    ":-ms-input-placeholder",
    ":focus",
    ":before",
    ":after",
    ":active"];
    var regex = new RegExp(invalidSelectors.join("|"));
    return !regex.test(selector);
}

function sortCssFiles(cssFiles:ICssFile[]):ICssFile[]{
    return _.sortBy(cssFiles, (cssFile:ICssFile) => {
            return cssFile.fileName;
        });
}