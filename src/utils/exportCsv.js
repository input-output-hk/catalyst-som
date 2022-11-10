import FileSaver from 'file-saver'
import slugify from 'slugify';
import papa from 'papaparse'

function errorHandling(err, file, inputElem, reason) {
  console.log("CSV: error exporting");
  console.log("reason:");
  console.log(reason);
  console.log("err:");
  console.log(err);
  console.log("inputElem:");
  console.log(inputElem);
}

function onComplete(results) {
  console.log("onComplete parsing CSV results:");
  console.log(results);
}

function downloadCsv(data) {
  const date = new Date().toLocaleString().replace(',', '').replaceAll('/', '-').replaceAll(':', '-')
  const filename = date + '-milestone-export.csv'
  const csv = papa.unparse(data, {
    complete: onComplete,
    error: errorHandling,
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
  })
  const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
  FileSaver.saveAs(blob, slugify(filename));
}

export default downloadCsv
