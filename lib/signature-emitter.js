'use babel';

import Highlights from 'highlights';
import io from 'socket.io-client';

export default class SignatureEmitter {
  constructor(workspace) {
    this.workspace = workspace;
    this.textEditor = workspace.getActiveTextEditor();
    this.socket = io('http://localhost:3000');
    this.highlighter = new Highlights({scopePrefix: 'syntax--'});
    this._lastDisposable = null;

    // Handle live updates to the the code
    this.subscribeToChanges();

    // Readjust when the active text editor changes
    this.workspace.onDidChangeActiveTextEditor(pane => {
      if (!atom.workspace.isTextEditor(pane)) {
        return;
      }
      this.textEditor = pane;
      this.subscribeToChanges();
    });

    // Subscribe to socket sendCode events for easier debugging
    this.socket.on('sendCode', function (data) {
      console.log(data);
    });
  }

  subscribeToChanges() {
    this.handleTextEditorChanges();
    if (this._lastDisposable !== null) {
      this._lastDisposable.dispose();
    }
    this._lastDisposable = this.textEditor.onDidChange(_ => {
      this.handleTextEditorChanges();
    });
  }

  handleTextEditorChanges() {
    const html = this.getPreparedHTML(this.textEditor.getText());
    this.socket.emit('getCode', {
      html: html,
    });
  }

  getPreparedHTML(text) {
    return this.highlighter.highlightSync({
      fileContents: text,
      filePath: this.textEditor.getPath(),
    });
  }
}
