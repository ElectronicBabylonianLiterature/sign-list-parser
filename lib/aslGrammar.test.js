const {grammar, semantics} = require('./aslGrammar')

describe('Sign ID', () => {
  test.each([
    ['@sign A\n@end sign', {_id: 'A'}],
    ['@sign |A.A|\n@end sign', {_id: '|A.A|'}],
    ['@sign |DUG×GIR₂@g|\n@end sign', {_id: '|DUG×GIR₂@g|'}],
    ['@sign |DUG×(LUH.GIŠ)|\n@end sign', {_id: '|DUG×(LUH.GIŠ)|'}]
  ])('Evaluates %s to %s', (sign, parsed) => {
    const match = grammar.match(sign)
    expect(semantics(match).eval())
      .toEqual(expect.objectContaining(
        parsed
      ))
  })
})

describe('List', () => {
  test.each([
    ['@sign A\n@end sign', {lists: []}],
    ['@sign A\n@list LAK797\n@end sign', {lists: ['LAK797']}],
    ['@sign A\n@list LAK797\n@list KWU901\n@end sign', {lists: ['LAK797', 'KWU901']}]
  ])('Evaluates %s to %s', (sign, parsed) => {
    const match = grammar.match(sign)
    expect(semantics(match).eval())
      .toEqual(expect.objectContaining(
        parsed
      ))
  })
})
