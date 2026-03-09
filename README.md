### Формат json

```bash
$ gendiff --format json __fixtures__/file1-nested.json __fixtures__/file2-nested.json
[
  {
    "key": "common",
    "type": "nested",
    "children": [
      {
        "key": "follow",
        "type": "added",
        "value": false
      },
      {
        "key": "setting1",
        "type": "unchanged",
        "value": "Value 1"
      },
      ...
    ]
  },
  ...
]