const _ = require('lodash')
const {grammar, semantics} = require('./aslGrammar')

describe('Sign ID', () => {
  test.each([
    [createSign([], 'A'), {_id: 'A'}],
    [createSign([], '|A.A|'), {_id: '|A.A|'}],
    [createSign([], '|DUG×GIR₂@g|'), {_id: '|DUG×GIR₂@g|'}],
    [createSign([], '|DUG×(LUH.GIŠ)|'), {_id: '|DUG×(LUH.GIŠ)|'}]
  ])('Evaluates %s to %s', evaluates)
})

describe('List', () => {
  test.each([
    [createSign(), {lists: []}],
    [createSign(['@list LAK797']), {lists: ['LAK797']}],
    [createSign(['@list LAK797', '@list KWU901']), {lists: ['LAK797', 'KWU901']}]
  ])('Evaluates %s to %s', evaluates)
})

describe('Unicode', () => {
  test.each([
    ['@sign A\n@end sign', {unicode: []}],
    [createSign(['@ucode x12000']), {unicode: [73728]}],
    [createSign(['@ucode x12000.x12001']), {unicode: [73728, 73729]}]
  ])('Evaluates %s to %s', evaluates)
})

describe('Note', () => {
  const longNote = 'Des basd scho i iabaroi gfreit mi Engelgwand SLOB 136 no.27, a! Aba und sei ILDAG₀, anbandeln hoid i hab an (Obazda) kimmt gwiss resch a fescha Bua?'
  test.each([
    [createSign(), {notes: []}],
    [createSign(['@note a note']), {notes: ['a note']}],
    [createSign(['@note first note', '@note second note']), {notes: ['first note', 'second note']}],
    [createSign(['@note |A×GAN₂@g|']), {notes: ['|A×GAN₂@g|']}],
    [createSign([`@note ${longNote}`]), {notes: [longNote]}]
  ])('Evaluates %s to %s', evaluates)
})

function createSign (lines = [], name = 'A') {
  const linesString = lines.map(line => `${line}\n`).join('')
  return `@sign ${name}\n${linesString}@end sign`
}

function evaluates (sign, parsed) {
  const match = grammar.match(sign)
  expect(semantics(match).eval())
    .toEqual(expect.objectContaining(
      parsed
    ))
}
