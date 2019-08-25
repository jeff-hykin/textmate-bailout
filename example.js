let duplicateForEmbedding = require('./index')
// 1.from a url (will download the source every time)
duplicateForEmbedding({ 
    url: 'https://raw.githubusercontent.com/jeff-hykin/cpp-textmate-grammar/master/syntaxes/cpp.tmLanguage.json', 
    appendScope: "latex",
    bailoutPattern: "\\\\end\\{minted\\}",
    newFileLocation: "cpp-latex.tmLanguage.json"
})