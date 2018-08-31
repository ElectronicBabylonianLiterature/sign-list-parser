const fs = require('fs')
const {grammar, semantics} = require('./aslGrammar')

module.exports = function main (aslFileName) {
  const asl = fs.readFileSync(aslFileName, 'utf8')
  const match = grammar.match(asl)
  const signList = semantics(match).eval()
  const json = JSON.stringify(signList, null, '\t')
  fs.writeFileSync('signList.json', json)
}
