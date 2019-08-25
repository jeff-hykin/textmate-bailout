### What is this?

This is a very specific tool that is used when you have a TextMate grammar that wants to include/contain another Textmate grammar. For example a Markdown grammar wanting to include a C++ grammar.

### How do I use it?

Here's an example of two differen LaTeX including an embedded C++ file:
```javascript
let duplicateForEmbedding = require("textmate-bailout")

// 1.from a url (will download the source every time)
duplicateForEmbedding({ 
    url: 'https://raw.githubusercontent.com/jeff-hykin/cpp-textmate-grammar/master/syntaxes/cpp.tmLanguage.json', 
    appendScope: "latex",
    bailoutPattern: "\\\\end\\{minted\\}",
    newFileLocation: "cpp-latex.tmLanguage.json"
})
// 2.from a local file
duplicateForEmbedding({
    grammarFilePath: "./someGrammer.tmLanguage.json",
    appendScope: "latex",
    bailoutPattern: "\\\\end\\{minted\\}",
    newFileLocation: "cpp-latex.tmLanguage.json"
})
```