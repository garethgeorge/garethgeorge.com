import { term, localEcho } from "./terminal";
import { fig, writeLowBaud } from "./formathelpers";
import AsciiTable from "ascii-table";
import WebShell from "./webshell";
// import catMe from "cat-me";
import { say } from 'cowsay-browser';
import quotes from "./quotes";

import "xterm/css/xterm.css"
import "./main.css"

const webshell = new WebShell(term);

(async () => {
  await writeLowBaud(await fig('welcome to\ngarethgeorge.com!', "Thin"));
  term.write("\r\n\n");

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  await writeLowBaud(say({text: quote}).replace(/\n/g, "\r\n") + "\r\n");
  // term.write(asciiBanner);

  const table = new AsciiTable()
  table.addRow("LinkedIn", "GitHub")
  table.addRow('https://www.linkedin.com/in/garethgeorge97/', "https://github.com/garethgeorge/");
  term.write(table.toString().replace(/\n/g, "\r\n") + "\r\n");

  term.write(webshell.helpText());

  while (true) {
    const line = await localEcho.read("~$ ");
    await webshell.evalShellLine(line, term);
  }
})();