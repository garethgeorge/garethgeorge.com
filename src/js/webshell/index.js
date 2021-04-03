import fs from "memfs";
import path from "path";
import { writeLowBaud } from "../formathelpers";
import c from "ansi-colors";

// load the filesystem
import("../../files/files").then(() => {
  console.log("LOADED FILESYSTEM");
});

const viewFile = async function (command, args, ostream, interactive = false) {
  const filepath = path.join(this.state.cwd, args[0]);
  let contents;
  try {
    contents = fs.readFileSync(filepath, "utf8");
  } catch (e) {
    // return e.toString();
    return `cat: ${args[0]}: No such file or directory`;
  }

  if (interactive && filepath.endsWith(".href")) {
    window.open(contents.trim(), "_blank");
  } else {
    await writeLowBaud(contents.replace(/\r?\n/g, "\r\n"));
    ostream.write("\r\n");
  }
};

const defaultCommands = {
  pwd: async function () {
    return this.state.cwd;
  },

  cd: async function (cmd, args) {
    if (args.length == 0) {
      return;
    }
    const newPath = path.join(this.state.cwd, args[0]);
    try {
      fs.statSync(newPath);
      this.state.cwd = newPath;
    } catch (e) {
      return `cd: no such file or directory: ${newPath}`;
    }
  },

  ls: async function (command, args, ostream) {
    let dir = this.state.cwd;
    if (args.length > 0) {
      dir = path.join(dir, args[0]);
    }

    let entries = null;
    try {
      entries = fs.readdirSync(dir, {
        withFileTypes: true,
      });
    } catch (e) {
      return `ls: ${args[0]}: No such file or directory`;
    }

    const printEntry = (ent) => {
      const name = ent.isDirectory() ? ent.name + "/" : ent.name;
      ostream.write(name + "\r\n");
    };

    ostream.write("./\r\n../\r\n");
    entries.sort((a, b) => (a.name > b.name ? -1 : 1));

    for (const ent of entries) {
      printEntry(ent);
    }
  },

  cat: function(command, args, ostream) {
    return viewFile.bind(this)(command, args, ostream, false);
  },

  open: function(command, args, ostream) {
    return viewFile.bind(this)(command, args, ostream, true);
  },
};

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
    if (firstSpace === -1) firstSpace = line.length;
    const command = line.substr(0, firstSpace).trim();

    await this.runCommand(command, this.parseArgs(line.substr(firstSpace)), ostream);
  }

  parseArgs(str) {
    // https://stackoverflow.com/questions/16261635/javascript-split-string-by-space-but-ignore-space-in-quotes-notice-not-to-spli?noredirect=1&lq=1
    return str.split(" ").filter((s) => s != "");
  }

  async runCommand(command, args, ostream) {
    if (!this.commands[command]) {
      return ostream.write(`bash: ${command}: command not found\r\n`);
    }
    const retVal = await this.commands[command].apply(this, [command, args, ostream]);
    if (retVal) ostream.write(retVal.replace(/\n/g, "\r\n") + "\r\n");
  }

  helpText() {
    return `
${c.bold("EXPLORE: try typing common bash commands to look around.")}
  - 'ls' to see available files, scripts, and directories 
  - 'cd' to navigate 
  - 'pwd' to view your current path 
  - 'open' to view a file or run a scriptnpm
  - 'cat' to view the contents of a file
`.replace(/\n/g, "\r\n");
  }
}
