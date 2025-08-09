# Google Sheets Parser
## Purpose
GSP is a simple way to parse google sheets into 2D associative table.

## How to use it:
```js
const
  gsp = require('google-sheets-parser');

gsp(SHEET_ID, G_ID).then(table => console.log(table));
```

## Response:
```
{
  A: {
    '1': <VALUE OF A1 CELL>,
    ...
  },
  ...
}
```

## Notes:
- The module **only** reads existing sheets.
- The sheet must be **public** so parser can read it.
