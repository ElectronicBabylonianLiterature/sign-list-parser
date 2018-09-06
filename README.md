# sign-list-parser

[![Codeship Status for ElectronicBabylonianLiterature/sign-list-parser](https://app.codeship.com/projects/87135f00-8ced-0136-a3ab-620930fa43d6/status?branch=master)](https://app.codeship.com/projects/303555)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ec4866b077a383114d36/test_coverage)](https://codeclimate.com/github/ElectronicBabylonianLiterature/sign-list-parser/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/ec4866b077a383114d36/maintainability)](https://codeclimate.com/github/ElectronicBabylonianLiterature/sign-list-parser/maintainability)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A script to parse ASL files to JSON

## Usage

```
node index.js <path to the asl file>
```

## Input

The scripts expects a sign list file in the asl format. See: [SL: Sign Lists](http://build-oracc.museum.upenn.edu/ns/sl/1.0/). The script parses all `@sign` entities from the file and ignores `@nosign` entities and lines beginning with `#`.For the signs following tags are ignored: `@uname`, `@uphase`, `@inst`, and `@pname`. `v@` with invalid value will be ignored, e.g. a sole question mark or a value containing slashes, capital letters, lacuna, and numbers.

For the script to work properly the sign list might have to be cleaned up:

- All `@ucode` values should be valid codepoints in hexadecimal with x prepended.
    - The missing xs should be added,
    - and latin unicode characters should be converted to codepoints.
- Invalid values should be removed or amended.
    - There should be no dashes in values.
    - No value should end with `+`.
- Invalid tags should be amended or removed.
    - `@unote` should be changed to `@inote`.
    - `#` comment in `@v` should be converted to `@inote`.
    - Spurious characters are removed.
    - Proof example in `@form` should be moved to corresponding `@v`.

## Output

The scripts writes `signList.json` with an array of signs in the following format:

 ```
{
    "_id": "<@sign>",
    "notes": ["<@note before @vs>", ...],
    "internalNotes": ["<@inote before @vs>", ...],
    "literature": ["@lit", ...]
    "lists": ["<@list>",  ...],
    "unicode": [<@ucode splitted by '.' and mapped to decimal>],
    "values": [
        {
            "value": "<@v without sub index>",
            "subIndex": <sub index from @v, 1 if not defined, no field if ₓ>
            "questionable": <trueif @v?, false otherwise>,
            "deprecated": <true if @v-, false otherwise>,
            "languageRestriction": "<language code after @v with % stripped, undefined otherwise>"
            "proofExample": "<proof example after the value, undefined otherwise>"
            "notes": ["<@note after @v>", ...],
            "internalNotes": ["<@inote after @v>", ...],
        }
    ],
    "forms": [
        {
            "variant": "<~X from @form>,
            "sign": "<sign from @form>,
            <... parsed from @form like @sign>
        },
        ...
    ]
}
```
