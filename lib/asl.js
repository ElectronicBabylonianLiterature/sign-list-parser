const {grammar, semantics} = require('./aslGrammar')

describe('Sign ID', () => {
  test.each([
    ['@sign A\n@end sign', {_id: 'A'}],
    ['@sign |A.A|\n@end sign', {_id: '|A.A|'}],
    ['@sign |DUG×GIR₂@g|\n@end sign', {_id: '|DUG×GIR₂@g|'}],
    ['@sign |DUG×(LUH.GIŠ)|\n@end sign', {_id: '|DUG×(LUH.GIŠ)|'}]
  ])('Evaluates %s to %s', (sign, parsed) => {
    const match = grammar.match(sign)
    expect(semantics(match).eval()).toEqual(parsed)
  })
})
