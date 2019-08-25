let duplicateForEmbedding = require("./index")

let url = "https://raw.githubusercontent.com/jeff-hykin/cpp-textmate-grammar/246ebd2c655f4d53b924fcab5124f1d9710942b3/syntaxes/cpp.tmLanguage.json"
duplicateForEmbedding({ url, appendScope:"latex", bailoutPattern:"(?=\\\\end\\{minted\\})", newFileLocation:"cpp-latex.tmLanguage.json"})
