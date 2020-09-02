import fs from "memfs";
import path from "path";
import {writeLowBaud} from "../formathelpers";
import c from "ansi-colors";

// setup the filesystem 
fs.mkdirSync("/home");
fs.mkdirSync("/home/user");

fs.writeFileSync("/home/user/about.txt", `
This site serves as a repository for showcasing my fun projects and tools I've built over the years. 

In my spare time I'm a hardware tinkerer, hobby programmer, and rock climber. A few projects I've worked on over the years include
 - harmonytv -- a service for watching videos synchronized with your friends 
 - gauchocal -- a chrome extension for automatically copying your course schedule from UCSB's course catelog to your Google Calendar. 
 - earth3 -- an implementation of a minecraft like block based building game in Garry's Mod. https://github.com/thelastpenguin/earth3 
 - vp9-chunked-encoder -- a service for encoding files with Google's VP9 codec using chunks to fully take advantage of available cores. https://github.com/garethgeorge/vp9-chunked-encoder
 - harmonyshrae -- a service for streamed sharing of files, intended to allow the recipiant to start downloading the file while its uploading. Useful for watching a locally available video file with friends. https://github.com/garethgeorge/harmonyshare
 - common-cloud-storage -- a library for easily storing objects on common cloud providers (currently supporting S3 with an easy wrapper for encryption) https://github.com/garethgeorge/common-cloud-storage
 - MyPy -- an implementatation of a subset of the Python3 interpreter in modern C++17 https://github.com/garethgeorge/Gareth-John-MyPy.
 - GmodZ -- a gamemode for Garry's Mod inspired by the popular DayZ game https://github.com/thelastpenguin/GmodZ.
 - Chess-AI -- a simple MinMax based AI for playing chess with friends https://github.com/garethgeorge/Chess-AI-2.
 - TicTacToe-AI -- a simple API for the solved game tic tac toe https://github.com/garethgeorge/TicTacToe-AI.
 - Euler-Problems -- a huge collectino of solutions to euler problems written in C++ and Haskell https://github.com/garethgeorge/euler-problems
 - LazerBounce -- a simple game made for a hackathon. the player bounces a lazer through a maze of mirrors to reach a target https://github.com/garethgeorge/LaserBounce. 


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

  helpText() {
    return `
${c.bold("EXPLORE: try typing common bash commands to look around.")}
  - 'ls' to see available files, scripts, and directories 
  - 'cd' to navigate 
  - 'pwd' to view your current path 
  - 'open' to view a file or run a scriptnpm
  - 'cat' to view the contents of a file
`.replace(/\n/g, "\r\n")
  }
}

