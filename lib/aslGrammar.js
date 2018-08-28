const fs = require('fs')
const ohm = require('ohm-js')

const aslOhm = fs.readFileSync('lib/asl.ohm')
const aslGrammar = ohm.grammar(aslOhm)
const aslSemantics = aslGrammar.createSemantics().addOperation('eval', {
  Sign: function (open, signName, fields, close) {
    return {
      _id: signName.eval(),
      lists: fields.eval()
    }
  },
  signName: function (name) {
    return this.sourceString
  },
  List: function (tag, listName) {
    return listName.eval()
  },
  listName: function (name) {
    return this.sourceString
  }
})

module.exports = {
  grammar: aslGrammar,
  semantics: aslSemantics
}
