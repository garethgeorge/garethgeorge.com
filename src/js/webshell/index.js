import fs from "memfs";
import util from "util";
import path from "path";
import {writeLowBaud} from "../formathelpers";

// setup the filesystem 
fs.mkdirSync("/home");
fs.mkdirSync("/home/user");

fs.writeFileSync("/home/user/about.txt", `
This site serves as a repository for sharing my fun projects and tools I've built over the years. 

I'm a hobby programmer and software engineer at Google. A few of my projects include
 - harmonytv -- a service for watching videos synchronized with your friends 
 - gauchocal -- a chrome extension for automatically copying your course schedule from UCSB's course catelog to your Google Calendar

I've published two papers with a third publication pending:
 - 'CSPOT: portable, multi-scale functions-as-a-service for IoT' by Rich Wolski, Chandra Krintz, Fatih Bakir, Gareth George, Wei-Tsung Lin
 - 'Analyzing AWS spot instance pricing' by Gareth George, Rich Wolski, Chandra Krintz, John Brevik
`.replace(/\n/g, "\r\n"));

const defaultCommands = {
  pwd: async function() {
    return this.state.cwd;
  },

  cd: async function(cmd, args) {
    if (args.length == 0) {
      return ;
    }
    const newPath = path.join(this.state.cwd, args[0]);
    try {
      fs.statSync(newPath)
      this.state.cwd = newPath;
    } catch (e) {
      return `cd: no such file or directory: ${newPath}`
    }
  },

  ls: async function(command, args, ostream) {
    let dir = this.state.cwd;
    if (args.length > 0) {
      dir = path.join(dir, args[0]);
    }

    let entries = null;
    try {
      entries = fs.readdirSync(dir, {
        withFileTypes: true
      });
    } catch (e) {
      return `ls: ${args[0]}: No such file or directory`
    }

    const printEntry = (ent) => {
      let name = ent.isDirectory() ? ent.name + "/" : ent.name; 
      ostream.write(ent.name + "\r\n");
    }

    ostream.write("./\r\n../\r\n");
    entries.sort((a, b) => a.name > b.name ? -1 : 1);

    for (const ent of entries) {
      printEntry(ent);
    }
  },

  cat: async function(command, args, ostream) {
    try {
      await writeLowBaud(fs.readFileSync(path.join(this.state.cwd, args[0].toLowerCase()), "utf8"));
      ostream.write("\r\n");
    } catch (e) {
      // return e.toString();
      return `cat: ${args[0]}: No such file or directory`
    }
  },
}

export default class WebShell {
  constructor(term) {
    this.commands = Object.assign({}, defaultCommands);
    this.state = {
      cwd: "/home/user",
    };
    this.term = term;
  }

  async evalShellLine(line, ostream) {
    let firstSpace = line.indexOf(" ");
    if (firstSpace === -1)
      firstSpace = line.length;
    const command = line.substr(0, firstSpace).trim();

    await this.runCommand(command, this.parseArgs(line.substr(firstSpace)), ostream);
  }

  parseArgs(str) {
    // https://stackoverflow.com/questions/16261635/javascript-split-string-by-space-but-ignore-space-in-quotes-notice-not-to-spli?noredirect=1&lq=1
    return str.split(" ").filter(s => s != "");
  }

  async runCommand(command, args, ostream) {
    if (!this.commands[command]) {
      return ostream.write(`bash: ${command}: command not found\r\n`);
    }
    const retVal = await this.commands[command].apply(this, [command, args, ostream]);
    if (retVal) 
      ostream.write(retVal.replace(/\n/g, "\r\n") + "\r\n");
  }
}

