const _ = require('lodash')
const {grammar, semantics} = require('./aslGrammar')

describe('Sign ID', () => {
  testEach(
    [createSign([], 'A'), {_id: 'A'}],
    [createSign([], 'BU@g'), {_id: 'BU@g'}],
    [createSign([], 'DU@g@g'), {_id: 'DU@g@g'}],
    [createSign([], '|A.A|'), {_id: '|A.A|'}],
    [createSign([], '|DUG×GIR₂@g|'), {_id: '|DUG×GIR₂@g|'}],
    [createSign([], '|DUG×(LUH.GIŠ)|'), {_id: '|DUG×(LUH.GIŠ)|'}],
    [createSign([], '|LAGAB+LAGAB|'), {_id: '|LAGAB+LAGAB|'}],
    [createSign([], '|LU₂@LU₂|'), {_id: '|LU₂@LU₂|'}],
    [createSign([], '|DU&DU|'), {_id: '|DU&DU|'}],
    [createSign([], '|GI%GI|'), {_id: '|GI%GI|'}],
    [createSign([], '|4xLU2|'), {_id: '|4xLU2|'}],
    [createSign([], '|AN.3×AN|'), {_id: '|AN.3×AN|'}],
    [createSign([], '|4×(AN.NAGA)|'), {_id: '|4×(AN.NAGA)|'}],
    [createSign([], '|(AN.NAGA)@(AN.NAGA)|'), {_id: '|(AN.NAGA)@(AN.NAGA)|'}],
    [createSign([], '|AB@g.MUŠ₃.ZA|'), {_id: '|AB@g.MUŠ₃.ZA|'}],
    [createSign([], 'LIMMU~a'), {_id: 'LIMMU~a'}]
  )
})

test('Tab in @end sign', () => {
  evaluates('@sign A\n@end\tsign', {_id: 'A'})
})

describe('List', () => {
  testEach(
    [createSign(), {lists: []}],
    [createSign(['@list LAK797']), {lists: ['LAK797']}],
    [createSign(['@list SLLHA420_8']), {lists: ['SLLHA420_8']}],
    [createSign(['@list LAK779?']), {lists: ['LAK779?']}],
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
    [createSign(['@v one']), createValues({value: 'one'})],
    [createSign(['@v first', '@v second']), createValues({value: 'first'}, {value: 'second'})],
    [createSign(['@v mušda']), createValues({value: 'mušda'})],
    [createSign(['@v ge₁₈']), createValues({value: 'ge₁₈'})],
    [createSign(['@v /šitlam/']), createValues({value: '/šitlam/'})],
    [createSign(['@v din-tir']), createValues({value: 'din-tir'})],
    [createSign(['@v ʾu₄']), createValues({value: 'ʾu₄'})],
    [createSign(['@v 1(šarʾu)']), createValues({value: '1(šarʾu)'})],
    [createSign(['@v 1/2(iku)']), createValues({value: '1/2(iku)'})],
    [createSign(['@v 9(aš@v@c)']), createValues({value: '9(aš@v@c)'})],
    [createSign(['@v value@d']), createValues({value: 'value@d'})],
    [createSign(['@v a-gar3']), createValues({value: 'a-gar3'})],
    [createSign(['@v 4(diš)@v']), createValues({value: '4(diš)@v'})],
    [createSign(['@v 9(diš@c)@v~a']), createValues({value: '9(diš@c)@v~a'})],
    [createSign(['@v a₂⁻']), createValues({value: 'a₂⁻'})],
    [createSign(['@v {kaš}ulušin']), createValues({value: '{kaš}ulušin'})],
    [createSign(['@v uliₓ?']), createValues({value: 'uliₓ?'})],
    [createSign(['@v uₓ(DIŠ)-gun₃']), createValues({value: 'uₓ(DIŠ)-gun₃'})],
    [createSign(['@v du₅⁺']), createValues({value: 'du₅⁺'})],
    [createSign(['@v [...]ri']), {values: []}],
    [createSign(['@v [...]']), {values: []}],
    [createSign(['@v ...gi']), {values: []}],
    [createSign(['@v ?']), {values: []}],
    [createSign(['@v Attinger']), {values: []}]
  )
})

describe('Value language restriction', () => {
  testEach(
    [createSign(['@v %akk value']), createValues({value: 'value', languageRestriction: 'akk'})]
  )
})

describe('Value proof example', () => {
  testEach(
    [
      createSign(['@v qab₃ [ BT 1 rev. iv\' 3 qab3-[la2]-ni ]']),
      createValues({
        value: 'qab₃',
        proofExample: 'BT 1 rev. iv\' 3 qab3-[la2]-ni'
      })
    ]
  )
})

describe('Value fields', () => {
  testEach(
    [
      createSign(['@v a']),
      createValues({
        value: 'a',
        notes: []
      })
    ],
    [
      createSign(['@v a\n@note a note']),
      createValues({
        value: 'a',
        notes: ['a note']
      })
    ],
    [
      createSign(['@v a\n@inote an i note\n@note a note']),
      createValues({
        value: 'a',
        notes: ['a note'],
        internalNotes: ['an i note']
      })
    ]
  )
})

describe('Questionable value', () => {
  testEach(
    [createSign(['@v? a']), createValues({value: 'a', questionable: true})]
  )
})

describe('Deprecated value', () => {
  testEach(
    [createSign(['@v- a']), createValues({value: 'a', deprecated: true})]
  )
})

describe('Form', () => {
  testEach(
    [createSign(), {forms: []}],
    [createSign(['@form ~a LAK328', '@end form']), {
      forms: [
        createForm({variant: 'a', sign: 'LAK328'})
      ]
    }],
    [createSign(['@form ~a A', '@note a note', '@end form']), {
      forms: [
        createForm({variant: 'a', sign: 'A', notes: ['a note']})
      ]
    }],
    [createSign(['@form ~a ASAL₂~a', '@end form']), {
      forms: [
        createForm({variant: 'a', sign: 'ASAL₂~a'})
      ]
    }],
    [createSign(['@form ~a A', '@v d', '@end form']), {
      forms: [
        createForm({variant: 'a', sign: 'A', ...createValues({value: 'd'})})
      ]
    }],
    [createSign(['@form ~a A', '@v d', '@note a note', '@end form']), {
      forms: [
        createForm({variant: 'a', sign: 'A', ...createValues({value: 'd', notes: ['a note']})})
      ]
    }],
    [createSign(['@v a', '@form ~a A', '@v d', '@end form']), {
      ...createValues({value: 'a'}),
      forms: [
        createForm({variant: 'a', sign: 'A', ...createValues({value: 'd'})})
      ]
    }],
    [createSign(['@form ~a A', '@form ~b B']), {
      forms: [
        createForm({variant: 'a', sign: 'A'}),
        createForm({variant: 'b', sign: 'B'})
      ]
    }]
  )
})

describe('Multiple signs', () => {
  testEach(
    [
      [createSign([], 'A'), createSign([], 'B')],
      [{_id: 'A'}, {_id: 'B'}]
    ]
  )
})

describe.each([
  '@uname X',
  '@uphase 1',
  '@inst instance',
  '@pname A',
  '#comment'
])('Tag "%s" is ignored', tag => {
  testEach(
    [createSign([tag]), {}]
  )
})

test('@nosign is ignored', () => {
  const match = grammar.match('@nosign A\n@end sign')
  const result = semantics(match).eval()
  expect(result).toEqual([])
})

function testEach (...cases) {
  test.each(cases)('Evaluates %s to %s', evaluates)
}

function createSign (lines = [], name = 'A') {
  const linesString = lines.map(line => `${line}\n`).join('')
  return `@sign ${name}\n${linesString}@end sign`
}

function evaluates (sign, parsed) {
  const match = grammar.match(_.isArray(sign)
    ? sign.join('\n\n')
    : sign
  )
  const result = semantics(match).eval()
  expect(result).toEqual((_.isArray(parsed)
    ? parsed
    : [parsed]
  ).map(parsedSign => expect.objectContaining(parsedSign)))
}

function createValues (...properties) {
  return {
    values: properties.map(createValue)
  }
}

function createValue (properties) {
  return {
    questionable: false,
    deprecated: false,
    notes: [],
    internalNotes: [],
    ...properties
  }
}

function createForm (properties) {
  return {
    internalNotes: [],
    notes: [],
    lists: [],
    literature: [],
    unicode: [],
    values: [],
    ...properties
  }
}
