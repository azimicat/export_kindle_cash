# export_kindle_cash

- 最初にすること: `pnpm i`

- `KindleSyncMetadataCache.xml`を`origin.xml`にrenameしておいておくこと
  - Kindle for Macを起動して"設定 > コンテンツフォルダ"のpath下にあるはず (`/Users/{user_name}/Library/Application Support/Kindle/Cache/KindleSyncMetadataCache.xml`)

- `pnpm run convert`: ファイルを出力する
  - origin_result.json: xmlそのまま
  - result.json: フォーマットしたjson
  - result.csv: フォーマットしたcsv


フォーマット後はこんな感じ

```js
type Book = {
  ASIN: string;
  title: string;
  authors: string[];
  publisher: string;
};
type BookList = Book[]
```
