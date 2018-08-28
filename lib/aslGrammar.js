const fs = require('fs')
const ohm = require('ohm-js')

const aslOhm = fs.readFileSync('lib/asl.ohm')
const aslGrammar = ohm.grammar(aslOhm)
const aslSemantics = aslGrammar.createSemantics().addOperation('eval', {
  Sign: function (open, signName, close) {
    return {
      _id: signName.eval()
    }
  },
  signName: function (name) {
    return this.sourceString
  }
})

module.exports = {
  grammar: aslGrammar,
  semantics: aslSemantics
}
