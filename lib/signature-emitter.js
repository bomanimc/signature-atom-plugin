'use babel';

import Highlights from 'highlights';
import io from 'socket.io-client';


export default class SignatureEmitter {
  constructor(workspace) {
    this.workspace = workspace;
    this.socket = io('http://localhost:3000');
    this.socket.on('sendCode', function (data) {
      console.log(data);
    });
  }

  handleTextEditorChanges() {
    const socket = this.socket;
    const textEditor = atom.workspace.getActiveTextEditor();

    textEditor.onDidChange(e => {
      const html = this.getPreparedHTML(textEditor.getText());
      socket.emit('getCode', {
        html: html,
      });
    });
  }

  getPreparedHTML(text) {
    const highlighter = new Highlights({scopePrefix: 'syntax--'});
    return highlighter.highlightSync({
      fileContents: text,
      filePath: 'signature-emitter.js',
    });
  }
}
