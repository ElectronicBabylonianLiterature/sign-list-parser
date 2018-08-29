const {grammar, semantics} = require('./aslGrammar')

describe('Sign ID', () => {
  testEach(
    [createSign([], 'A'), {_id: 'A'}],
    [createSign([], '|A.A|'), {_id: '|A.A|'}],
    [createSign([], '|DUG×GIR₂@g|'), {_id: '|DUG×GIR₂@g|'}],
    [createSign([], '|DUG×(LUH.GIŠ)|'), {_id: '|DUG×(LUH.GIŠ)|'}]
  )
})

describe('List', () => {
  testEach(
    [createSign(), {lists: []}],
    [createSign(['@list LAK797']), {lists: ['LAK797']}],
    [createSign(['@list LAK797', '@list KWU901']), {lists: ['LAK797', 'KWU901']}]
  )
})

describe('Unicode', () => {
  testEach(
    ['@sign A\n@end sign', {unicode: []}],
    [createSign(['@ucode x12000']), {unicode: [73728]}],
    [createSign(['@ucode x12000.x12001']), {unicode: [73728, 73729]}]
  )
})

describe.each([
  ['@note', 'notes'],
  ['@inote', 'internalNotes']
])('Tag "%s" evaluated to property "%s"', (tag, property) => {
  const longNote = 'Des basd scho i iabaroi gfreit mi Engelgwand SLOB 136 no.27, a! Aba und sei ILDAG₀, anbandeln hoid i hab an (Obazda) kimmt gwiss resch a fescha Bua?'
  testEach(
    [createSign(), {notes: []}],
    [createSign([`${tag} a note`]), {[property]: ['a note']}],
    [createSign([`${tag} first note`, `${tag} second note`]), {[property]: ['first note', 'second note']}],
    [createSign([`${tag} |A×GAN₂@g|`]), {[property]: ['|A×GAN₂@g|']}],
    [createSign([`${tag} ${longNote}`]), {[property]: [longNote]}]
  )
})

function testEach (...cases) {
  test.each(cases)('Evaluates %s to %s', evaluates)
}

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
