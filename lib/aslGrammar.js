const fs = require('fs')
const ohm = require('ohm-js')
const _ = require('lodash')

const aslOhm = fs.readFileSync('lib/asl.ohm')
const aslGrammar = ohm.grammar(aslOhm)
const aslSemantics = aslGrammar.createSemantics().addOperation('eval', {
  Sign: function (open, signName, fields, close) {
    const evaluetedFields = fields.eval()
    const properties = ['lists', 'unicode', 'notes', 'internalNotes', 'literature', 'values', 'forms']
    const fieldValues = properties.map(property => _(evaluetedFields).flatMap(property).compact().value())
    const fieldObject = _(properties).zip(fieldValues).fromPairs().value()
    return {
      _id: signName.sourceString,
      ...fieldObject
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
  Comment: function (hash, comment) {
    return {}
  },
  Value: function (tag, language, unknown, key, openingBracket, proofExample, closingBracket, fields) {
    const evaluatedLanguage = _.head(language.eval())
    const evaluatedProofExample = _.head(proofExample.eval())
    const evaluetedFields = fields.eval()
    const properties = ['notes', 'internalNotes']
    const fieldValues = properties.map(property => _(evaluetedFields).flatMap(property).compact().value())
    const fieldObject = _(properties).zip(fieldValues).fromPairs().value()
    return unknown.sourceString
      ? {}
      : {
        values: {
          value: key.sourceString,
          questionable: tag.sourceString.endsWith('?'),
          deprecated: tag.sourceString.endsWith('-'),
          ...(evaluatedLanguage ? {languageRestriction: evaluatedLanguage} : {}),
          ...(evaluatedProofExample ? {proofExample: evaluatedProofExample} : {}),
          ...fieldObject
        }
      }
  },
  language: function (percent, language) {
    return language.sourceString
  },
  Instance: function (instance) {
    return this.sourceString
  },
  Form: function (open, variant, signName, fields, close) {
    const evaluetedFields = fields.eval()
    const properties = ['lists', 'unicode', 'notes', 'internalNotes', 'literature', 'values', 'values']
    const fieldValues = properties.map(property => _(evaluetedFields).flatMap(property).compact().value())
    const fieldObject = _(properties).zip(fieldValues).fromPairs().value()
    return {
      forms: {
        variant: _.trimStart(variant.sourceString, '~'),
        sign: signName.sourceString,
        ...fieldObject
      }
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
