'use babel';

import Highlights from 'highlights';

export default class SignatureEmitter {
  constructor(workspace) {
    this.workspace = workspace;
  }

  handleTextEditorChanges() {
    const textEditor = atom.workspace.getActiveTextEditor();
    textEditor.onDidChange(e => {
      const html = this.getPreparedHTML(textEditor.getText());
      console.log(html);
    });
  }

  getPreparedHTML(text) {
    const highlighter = new Highlights();
    return highlighter.highlightSync({
      fileContents: text,
    });
  }
}
