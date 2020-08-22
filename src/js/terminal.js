import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import LocalEchoController from "local-echo";
import { WebLinksAddon } from 'xterm-addon-web-links';

export const term = new Terminal();
export const localEcho = new LocalEchoController();
export const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.loadAddon(localEcho);
term.loadAddon(new WebLinksAddon());
term.open(document.getElementById('terminal'));
fitAddon.fit();
