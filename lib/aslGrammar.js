const fs = require('fs')
const ohm = require('ohm-js')
const _ = require('lodash')

const aslOhm = fs.readFileSync('lib/asl.ohm')
const aslGrammar = ohm.grammar(aslOhm)
const aslSemantics = aslGrammar.createSemantics().addOperation('eval', {
  Sign: function (open, signName, fields, close) {
    const evaluetedFields = fields.eval()
    const properties = ['lists', 'unicode', 'notes', 'internalNotes', 'literature', 'values']
    const values = properties.map(property => _(evaluetedFields).flatMap(property).compact().value())
    return {
      _id: signName.sourceString,
      ..._(properties).zip(values).fromPairs().value()
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
  Value: function (tag, language, lacuna, key, openingBracket, proofExample, closingBracket) {
    const evaluatedLanguage = _.head(language.eval())
    const evaluatedProofExample = _.head(proofExample.eval())
    return lacuna.sourceString
      ? {}
      : {
        values: {
          value: key.sourceString,
          ...(evaluatedLanguage ? {languageRestriction: evaluatedLanguage} : {}),
          ...(evaluatedProofExample ? {proofExample: evaluatedProofExample} : {})
        }
      }
  },
  language: function (percent, language) {
    return language.sourceString
  },
  Instance: function (instance) {
    return this.sourceString
  },
  NonemptyListOf: function (x, sep, xs) {
    return [x.eval()].concat(xs.eval())
  }
})

module.exports = {
  grammar: aslGrammar,
  semantics: aslSemantics
}
