const fs = require('fs')
const ohm = require('ohm-js')
const _ = require('lodash')

const aslOhm = fs.readFileSync('lib/asl.ohm')
const aslGrammar = ohm.grammar(aslOhm)
const aslSemantics = aslGrammar.createSemantics().addOperation('eval', {
  Sign: function (open, signName, fields, close) {
    fields = fields.eval()
    return {
      _id: signName.sourceString,
      lists: _(fields).flatMap('lists').compact().value(),
      unicode: _(fields).flatMap('unicode').compact().value(),
      notes: _(fields).flatMap('notes').compact().value(),
      internalNotes: _(fields).flatMap('internalNotes').compact().value(),
      literature: _(fields).flatMap('literature').compact().value()
    }
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
  FreeTextField: function (tag, text) {
    const properties = {
      '@note': 'notes',
      '@inote': 'internalNotes',
      '@lit': 'literature'
    }
    return {
      [properties[tag.sourceString]]: text.sourceString
    }
  },
  NonemptyListOf: function (x, sep, xs) {
    return [x.eval()].concat(xs.eval())
  }
})

module.exports = {
  grammar: aslGrammar,
  semantics: aslSemantics
}
