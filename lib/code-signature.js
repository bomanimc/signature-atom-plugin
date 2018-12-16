'use babel';

import CodeSignatureView from './code-signature-view';
import { CompositeDisposable } from 'atom';

export default {

  codeSignatureView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.codeSignatureView = new CodeSignatureView(state.codeSignatureViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.codeSignatureView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-signature:toggle': () => this.toggle()
    }));

    this.handleTextEditorChanges();
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.codeSignatureView.destroy();
  },

  serialize() {
    return {
      codeSignatureViewState: this.codeSignatureView.serialize()
    };
  },

  toggle() {
    console.log('CodeSignature was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  handleTextEditorChanges() {
    const textEditor = atom.workspace.getActiveTextEditor();
    textEditor.onDidChange(e => console.log(textEditor.getText()));
  }
};
