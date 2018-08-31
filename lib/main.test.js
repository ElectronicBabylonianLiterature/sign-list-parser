const _ = require('lodash')
const fs = require('fs')
const main = require('./main')

const alsFilename = 'export.csv'
const als = '@sign A\n@end sign'
const jsonFileName = 'signList.json'
const expectedJson = JSON.stringify([{
  _id: 'A',
  lists: [],
  unicode: [],
  notes: [],
  internalNotes: [],
  literature: [],
  values: [],
  forms: []
}], null, '\t')

beforeEach(() => {
  jest.spyOn(fs, 'readFileSync').mockReturnValue(als)
  jest.spyOn(fs, 'writeFileSync').mockImplementation(_.noop)
  main(alsFilename)
})

it('Reads the given file', async () => {
  expect(fs.readFileSync).toHaveBeenCalledWith(alsFilename, 'utf8')
})

it('Writes output to signList.json', async () => {
  expect(fs.writeFileSync).toHaveBeenCalledWith(jsonFileName, expectedJson)
})
