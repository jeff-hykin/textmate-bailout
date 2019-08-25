const fs = require("fs")
const _ = require("lodash")
const request = require("sync-request")

let downloadUrl = url => {
    var res = request("GET", url)
    return res.body.toString("utf-8")
}

module.exports = duplicateForEmbedding

function duplicateForEmbedding({ url, grammarFilePath, appendScope, bailoutPattern, newFileLocation, deleteMatchRules }) {
    // allow for either a url or a local file
    let grammar
    if (url) {
        grammar = JSON.parse(downloadUrl(url))
    } else if (grammarFilePath) {
        grammar = JSON.parse(fs.readFileSync(grammarFilePath))
    }
    originalScopeName = grammar["scopeName"]
    grammar["scopeName"] = grammar["scopeName"] + ".embedded." + appendScope
    rewriteRules(
        originalScopeName,
        deleteMatchRules && selectRulesForDeletion(grammar) || [],
        grammar,
        bailoutPattern
    )
    // save the new grammar
    fs.writeFileSync(newFileLocation, JSON.stringify(grammar))
}

function selectRulesForDeletion(rule, repositoryName = undefined) {
    if (rule.match) {
        if (repositoryName) {
            return [repositoryName]
        }
        return []
    }
    if (rule.patterns) {
        if (Object.keys(rule).length == 1) {
            const deleteable = rule.patterns.reduce((array, r) => {
                if (!array) return array
                const deleteable = selectRulesForDeletion(r)
                if (!deleteable) return false
                return array.concat(deleteable)
            }, [])
            if (deleteable) {
                return (repositoryName && [repositoryName]) || []
            }
        }
    }
    if (rule.repository) {
        return Object.keys(rule.repository).reduce((array, key) => {
            const deleteable = selectRulesForDeletion(rule.repository[key], key)
            if (deleteable) {
                array = array.concat(deleteable)
            }
            return array
        }, [])
    }
    return false
}

function rewriteRules(originalscopeName, deleteableRules, rule, newEnding) {
    if (rule.include) {
        if (_.includes(deleteableRules, rule.include.slice(1))) {
            rule.include = `${originalscopeName}${rule.include}`
        }
    }
    if (rule.end) {
        rule.end = `${rule.end}|(?=${newEnding})`
    }
    if (rule.while) {
        rule.while = `${rule.while}|(?:^\\s+(?!${newEnding}))`
    }
    if (rule.patterns) {
        rule.patterns.map(r => rewriteRules(originalscopeName, deleteableRules, r, newEnding))
    }
    // rule.repository is apparently allowed, at least in vscode-textmate, its not documented however
    if (rule.repository) {
        rule.repository = _.omit(rule.repository, deleteableRules)
        Object.keys(rule.repository).map(key => rewriteRules(originalscopeName, deleteableRules, rule.repository[key], newEnding))
    }
    if (rule.captures) {
        Object.keys(rule.captures).map(key => {
            rewriteRules(originalscopeName, deleteableRules, rule.captures[key], newEnding)
        })
    }
    if (rule.beginCaptures) {
        Object.keys(rule.beginCaptures).map(key => {
            rewriteRules(originalscopeName, deleteableRules, rule.beginCaptures[key], newEnding)
        })
    }
    if (rule.endCaptures) {
        Object.keys(rule.endCaptures).map(key => {
            rewriteRules(originalscopeName, deleteableRules, rule.endCaptures[key], newEnding)
        })
    }
    if (rule.whileCaptures) {
        Object.keys(rule.whileCaptures).map(key => {
            rewriteRules(originalscopeName, deleteableRules, rule.whileCaptures[key], newEnding)
        })
    }
}
