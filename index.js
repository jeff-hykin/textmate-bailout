const fs = require("fs");
const request = require('sync-request');

let downloadUrl = (url) => {
    var res = request('GET', url);
    return res.body.toString('utf-8');
}

module.exports = duplicateForEmbedding

function duplicateForEmbedding({ url, grammarFilePath, appendScope, bailoutPattern, newFileLocation}) {
    // allow for either a url or a local file
    let grammar
    if (url) {
        grammar = JSON.parse(downloadUrl(url))
    } else if (grammarFilePath) {
        grammar = JSON.parse(fs.readFileSync(grammarFilePath))
    }
    grammar["scopeName"] = grammar["scopeName"] + ".embedded." + appendScope;
    rewriteRules(grammar, bailoutPattern);
    // save the new grammar
    fs.writeFileSync(
        newFileLocation,
        JSON.stringify(grammar)
    );
}

function rewriteRules(rule, newEnding) {
    if (rule.end) {
        rule.end = `${rule.end}|${newEnding}`;
    }
    if (rule.patterns) {
        rule.patterns.map(r => rewriteRules(r, newEnding));
    }
    // rule.repository is apparently allowed, at least in vscode-textmate, its not documented however
    if (rule.repository) {
        Object.keys(rule.repository).map(key =>
            rewriteRules(rule.repository[key], newEnding)
        );
    }
    if (rule.captures) {
        Object.keys(rule.captures).map(key => {
            rewriteRules(rule.captures[key], newEnding);
        });
    }
    if (rule.beginCaptures) {
        Object.keys(rule.beginCaptures).map(key => {
            rewriteRules(rule.beginCaptures[key], newEnding);
        });
    }
    if (rule.endCaptures) {
        Object.keys(rule.endCaptures).map(key => {
            rewriteRules(rule.endCaptures[key], newEnding);
        });
    }
    if (rule.whileCaptures) {
        Object.keys(rule.whileCaptures).map(key => {
            rewriteRules(rule.whileCaptures[key], newEnding);
        });
    }
}
