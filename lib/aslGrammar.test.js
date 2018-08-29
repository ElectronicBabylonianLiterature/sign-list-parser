const {grammar, semantics} = require('./aslGrammar')

describe('Sign ID', () => {
  testEach(
    [createSign([], 'A'), {_id: 'A'}],
    [createSign([], 'BU@g'), {_id: 'BU@g'}],
    [createSign([], '|A.A|'), {_id: '|A.A|'}],
    [createSign([], '|DUG×GIR₂@g|'), {_id: '|DUG×GIR₂@g|'}],
    [createSign([], '|DUG×(LUH.GIŠ)|'), {_id: '|DUG×(LUH.GIŠ)|'}],
    [createSign([], '|LAGAB+LAGAB|'), {_id: '|LAGAB+LAGAB|'}],
    [createSign([], '|LU₂@LU₂|'), {_id: '|LU₂@LU₂|'}],
    [createSign([], '|DU&DU|'), {_id: '|DU&DU|'}],
    [createSign([], '|GI%GI|'), {_id: '|GI%GI|'}],
    [createSign([], '|4xLU2|'), {_id: '|4xLU2|'}],
    [createSign([], '|(AN.NAGA)@(AN.NAGA)|'), {_id: '|(AN.NAGA)@(AN.NAGA)|'}],
    [createSign([], '|AB@g.MUŠ₃.ZA|'), {_id: '|AB@g.MUŠ₃.ZA|'}]
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
    [createSign(), {unicode: []}],
    [createSign(['@ucode x12000']), {unicode: [73728]}],
    [createSign(['@ucode x12000.x12001']), {unicode: [73728, 73729]}]
  )
})

describe.each([
  ['@note', 'notes'],
  ['@inote', 'internalNotes'],
  ['@lit', 'literature']
])('Tag "%s" evaluated to property "%s"', (tag, property) => {
  const longText = 'Des basd scho i iabaroi gfreit mi Engelgwand SLOB 136 no.27, a! Aba und sei ILDAG₀, anbandeln hoid i hab an (Obazda) kimmt gwiss resch a fescha Bua?'
  testEach(
    [createSign(), {notes: []}],
    [createSign([`${tag} some text`]), {[property]: ['some text']}],
    [createSign([`${tag} first text`, `${tag} second text`]), {[property]: ['first text', 'second text']}],
    [createSign([`${tag} |A×GAN₂@g|`]), {[property]: ['|A×GAN₂@g|']}],
    [createSign([`${tag} ${longText}`]), {[property]: [longText]}]
  )
})

describe('Values', () => {
  testEach(
    [createSign(), {values: []}],
    [createSign(['@v one']), {values: [{value: 'one'}]}],
    [createSign(['@v first', '@v second']), {values: [{value: 'first'}, {value: 'second'}]}],
    [createSign(['@v mušda']), {values: [{value: 'mušda'}]}],
    [createSign(['@v ge₁₈']), {values: [{value: 'ge₁₈'}]}],
    [createSign(['@v /šitlam/']), {values: [{value: '/šitlam/'}]}],
    [createSign(['@v din-tir']), {values: [{value: 'din-tir'}]}],
    [createSign(['@v value@d']), {values: [{value: 'value@d'}]}],
    [createSign(['@v [...]ri']), {values: []}],
    [createSign(['@v [...]']), {values: []}],
    [createSign(['@v ...gi']), {values: []}]
  )
})

describe('Value language restriction', () => {
  testEach(
    [createSign(['@v %akk value']), {values: [{value: 'value', languageRestriction: 'akk'}]}]
  )
})

describe('Value proof example', () => {
  testEach(
    [
      createSign(['@v nanna₂ [SpTu 2 36 = cams:P348641 o 18, i-nanna₂-ma]']),
      {
        values: [{
          value: 'nanna₂',
          proofExample: {
            citation: 'SpTu 2 36',
            cdlLabel: 'cams:P348641 o 18',
            word: 'i-nanna₂-ma'
          }
        }]
      }
    ]
    // @v	agam [VAT 10259 = dcclt/signlists:P283541 o 3]
    // @v sissigₓ [P478860 ii 4, kug-|ZI%ZI|]
    // @v	ki₉ [CUSAS 12 1.1.2 = dcclt/signlits:P342645 o i 56]
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
