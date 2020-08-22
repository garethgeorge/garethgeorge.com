import { term, localEcho } from "./terminal";
import { fig, writeLowBaud } from "./formathelpers";
import AsciiTable from "ascii-table";
import WebShell from "./webshell";
import catMe from "cat-me";

const webshell = new WebShell(term);

(async () => {
  await writeLowBaud(await fig('welcome to\ngarethgeorge.com!', "Thin"));
  term.write("\r\n\n");

  await writeLowBaud(catMe().replace(/\n/g, "\r\n") + "\r\n");

  const table = new AsciiTable()
  table.addRow("LinkedIn", "GitHub")
  table.addRow('https://www.linkedin.com/in/garethgeorge97/', "https://github.com/garethgeorge/");
  term.write(table.toString().replace(/\n/g, "\r\n") + "\r\n");

term.write(`
EXPLORE: try typing common bash commands to look around.
 - 'ls' to see available files, scripts, and directories 
 - 'cd' to navigate 
 - 'pwd' to view your current path 
 - 'cat' to view the contents of a file
 - 'open' intelligently open the content (runs scripts, cats plain text files or opens HTML in a new tab)
`.replace(/\n/g, "\r\n"))

  while (true) {
    const line = await localEcho.read("~$ ");
    await webshell.evalShellLine(line, term);
  }
})();