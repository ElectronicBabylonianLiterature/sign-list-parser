const fs = require('fs')
const ohm = require('ohm-js')
const _ = require('lodash')

const aslOhm = fs.readFileSync('lib/asl.ohm')
const aslGrammar = ohm.grammar(aslOhm)
const aslSemantics = aslGrammar.createSemantics().addOperation('eval', {
  SignList: function (signs) {
    return _.compact(signs.eval())
  },
  NoSign: function (open, signName, fields, close) {
    return null
  },
  Sign: function (open, signName, fields, close) {
    const evaluetedFields = fields.eval()
    const properties = ['lists', 'unicode', 'notes', 'internalNotes', 'literature', 'values', 'forms']
    const fieldValues = properties.map(property => _(evaluetedFields).flatMap(property).compact().value())
    const fieldObject = _(properties).zip(fieldValues).fromPairs().value()
    return _(evaluetedFields).flatMap('fake').some()
      ? null
      : {
        _id: signName.sourceString,
        ...fieldObject
      }
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
      '@lit': 'literature',
      '@list': 'lists'
    }
    return {
      [properties[tag.sourceString]]: text.sourceString
    }
  },
  Comment: function (hash, comment) {
    return {}
  },
  Fake: function (tag, one) {
    return {fake: true}
  },
  Value: function (tag, language, key, openingBracket, proofExample, closingBracket, fields) {
    const ignore = /Attinger|\.\.\.|^\?$|\/.+\/|[A-Z]/
    const ignoreMark = /⁻|⁺/
    const evaluatedLanguage = _.head(language.eval())
    const evaluatedProofExample = _.head(proofExample.eval())
    const evaluetedFields = fields.eval()
    const properties = ['notes', 'internalNotes']
    const fieldValues = properties.map(property => _(evaluetedFields).flatMap(property).compact().value())
    const fieldObject = _(properties).zip(fieldValues).fromPairs().value()
    const value = key.eval()
    return ignore.test(value.value) || ignoreMark.test(value.mark)
      ? {}
      : {
        values: {
          ...(_.omit(key.eval(), 'mark')),
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
  reading: function (reading, subIndex, mark, modifier) {
    return {
      value: `${reading.sourceString}${modifier.sourceString}`,
      ...(_.head(subIndex.eval()) || {subIndex: 1}),
      mark: mark.sourceString
    }
  },
  number: function (fraction, reading) {
    return {
      value: fraction.sourceString,
      subIndex: 1,
      mark: ''
    }
  },
  subIndex: function (index) {
    return this.sourceString === 'ₓ'
      ? {}
      : {subIndex: parseInt(this.sourceString.normalize('NFKC'))}
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
