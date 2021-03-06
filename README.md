# sign-list-parser

[![Build Status](https://travis-ci.com/ElectronicBabylonianLiterature/sign-list-parser.svg?branch=master)](https://travis-ci.com/ElectronicBabylonianLiterature/sign-list-parser)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ec4866b077a383114d36/test_coverage)](https://codeclimate.com/github/ElectronicBabylonianLiterature/sign-list-parser/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/ec4866b077a383114d36/maintainability)](https://codeclimate.com/github/ElectronicBabylonianLiterature/sign-list-parser/maintainability)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A script to parse ASL files to JSON

## Usage

```
node index.js <path to the asl file>
```

## Input

The scripts expects a sign list file in the asl format. See: [SL: Sign Lists](http://build-oracc.museum.upenn.edu/ns/sl/1.0/). The script parses all `@sign` entities from the file and ignores `@nosign` entities signs with `@fake 1`, and lines beginning with `#` are ignored. For the signs following tags are ignored: `@uname`, `@uphase`, `@inst`, and `@pname`. `v@` with invalid value will be ignored, e.g. a sole question mark or a value containing slashes, capital letters, lacuna, and numbers.

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

## Caveats

- Since all the values containing a number are removed, values for specific numbers (1, 2, 10, 20, 30) have to be added manually if needed.
- The special number signs (e.g `9(AŠ)`) should be ignored. The eBL application handles numbers differently.
- Values with `@` (e.g. `sig₁₅@v`) are parsed by the script, but they are incorrect and should be ignored.

