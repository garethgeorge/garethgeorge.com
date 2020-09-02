import figlet from "figlet";
import { term } from "./terminal";

export const fig = (text, font = null) => {
  return new Promise((accept, reject) => {
    figlet.text(text, {
      font: font,
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 100,
      whitespaceBreak: true
    }, function (err, data) {
      if (err) {
        reject(err);
        return;
      }
      accept(data.replace(/\n/g, "\r\n"));
    });
  });
}

export const writeLowBaud = (text, interval = 50, chunkSize = 50) => {
  return new Promise((accept, reject) => {
    const writerHelper = (idx) => {
      if (idx * chunkSize >= text.length)
        return accept();

      term.write(text.substr(idx * chunkSize, chunkSize));
      setTimeout(writerHelper.bind(null, idx + 1), interval);
    }
    writerHelper(0);
  });
}

const prettyPrint = (text) => {

}