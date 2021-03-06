const fs = require('fs')
const ohm = require('ohm-js')
const _ = require('lodash')

function mapFields (evaluetedFields, properties) {
  const fieldValues = properties.map(property => _(evaluetedFields).flatMap(property).compact().value())
  return _(properties).zip(fieldValues).fromPairs().value()
}

function isIgnorable (value) {
  const ignore = /Attinger|\.\.\.|^\?$|\/.+\/|[A-Z]|^[0-9]/
  const ignoreMark = /⁻|⁺/
  return ignore.test(value.value) || ignoreMark.test(value.mark)
}

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
    return _(evaluetedFields).flatMap('fake').some()
      ? null
      : {
        _id: signName.sourceString,
        ...(mapFields(evaluetedFields, properties))
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
  Value: function (tag, language, key, proofExample, fields) {
    const evaluatedLanguage = _.head(language.eval())
    const evaluatedProofExample = _.head(proofExample.eval())
    const evaluetedFields = fields.eval()
    const properties = ['notes', 'internalNotes']
    const value = key.eval()

    return isIgnorable(value)
      ? {}
      : {
        values: {
          ...(_.omit(value, 'mark')),
          questionable: tag.sourceString.endsWith('?'),
          deprecated: tag.sourceString.endsWith('-'),
          ...(evaluatedLanguage ? {languageRestriction: evaluatedLanguage} : {}),
          ...(evaluatedProofExample ? {proofExample: evaluatedProofExample} : {}),
          ...(mapFields(evaluetedFields, properties))
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
  ProofExample: function (openingBracket, proofExample, closingBracket) {
    return proofExample.eval()
  },
  badValue: function (head, dash, tail) {
    return {
      value: '?',
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
    return {
      forms: {
        variant: _.trimStart(variant.sourceString, '~'),
        sign: signName.sourceString,
        ...(mapFields(evaluetedFields, properties))
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
