const fs = require('fs')
const ohm = require('ohm-js')
const _ = require('lodash')

const aslOhm = fs.readFileSync('lib/asl.ohm')
const aslGrammar = ohm.grammar(aslOhm)
const aslSemantics = aslGrammar.createSemantics().addOperation('eval', {
  Sign: function (open, signName, fields, close) {
    fields = fields.eval()
    return {
      _id: signName.eval(),
      lists: _(fields).flatMap('lists').compact().value(),
      unicode: _(fields).flatMap('unicode').compact().value(),
      notes: _(fields).flatMap('notes').compact().value()
    }
  },
  signName: function (name) {
    return this.sourceString
  },
  List: function (tag, list) {
    return { lists: list.sourceString }
  },
  Unicode: function (tag, codepoints) {
    return { unicode: codepoints.eval() }
  },
  codepoint: function (x, digits) {
    return parseInt(digits.sourceString, 16)
  },
  note: function (tag, space, note) {
    return { notes: note.sourceString }
  },
  NonemptyListOf: function (x, sep, xs) {
    return [x.eval()].concat(xs.eval())
  }
})

module.exports = {
  grammar: aslGrammar,
  semantics: aslSemantics
}
