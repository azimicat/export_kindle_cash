const fs = require('fs');
const xml2js = require('xml2js');


var parser = new xml2js.Parser();
fs.readFile(__dirname + '/origin.xml', function (err, data) {
  if (err) {
    console.error('ファイル読み込みエラー:', err);
    return;
  }

  parser.parseString(data, function (err, parsed) {
    if (err) {
      console.error('XML解析エラー:', err);
      return;
    }

    const meta_data = parsed.response.add_update_list[0]['meta_data'];
    var formatted_book_list = []
    for (var i = 0; i < meta_data.length; i++) {
      if (meta_data[i].title[0]["_"] === '---------------') {
        continue;
      }
      if (meta_data[i].cde_contenttype[0] === 'PDOC') {
        continue;
      }
      formatted_book_list.push({
        'ASIN': meta_data[i].ASIN[0],
        'title': meta_data[i].title[0]["_"].replaceAll('\n', '').replaceAll(' ', '').replace(/\([^)]*\)$/, ''),
        'authors': meta_data[i].authors[0]["author"].map(item => item._),
        'publisher': meta_data[i].publishers[0]["publisher"] === undefined ? '' : meta_data[i].publishers[0]["publisher"][0],
      })
    };
    const result = formatted_book_list.sort((a, b) => a.title.localeCompare(b.title, 'ja'))
    console.log('Done');

    const output_file = __dirname + '/result.json';
    fs.writeFile(output_file, JSON.stringify(result, null, 2), function (err) {
      if (err) {
        console.error('ファイル書き込みエラー:', err);
        return;
      }
      console.log(`"${output_file}"に書き込みました`);
    });

    const output_file_origin = __dirname + '/origin_result.json';
    fs.writeFile(output_file_origin, JSON.stringify(meta_data, null, 2), function (err) {
      if (err) {
        console.error('ファイル書き込みエラー:', err);
        return;
      }
      console.log(`"${output_file_origin}"に書き込みました`);
    });

    function jsonToCsv(json) {
      // CSVのヘッダーを生成
      const headers = Object.keys(json[0]).join(',');
      // 各行のデータを生成
      const rows = json.map(obj => {
        return Object.values(obj).map(val =>
          Array.isArray(val) ? val.join('|') : val  // 配列の場合はパイプ(|)で結合
        ).join(',');
      });
      // ヘッダーと全ての行を結合
      return headers + '\n' + rows.join('\n');
    }
    const csv = jsonToCsv(result);
    const output_file_csv = __dirname + '/result.csv';
    fs.writeFile(output_file_csv, csv, function (err) {
      if (err) {
        console.error('ファイル書き込みエラー:', err);
        return;
      }
      console.log(`"${output_file_csv}"に書き込みました`);
    });
  });
});
