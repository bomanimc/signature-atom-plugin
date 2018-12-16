'use babel';

import CodeSignature from '../lib/code-signature';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('CodeSignature', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('code-signature');
  });

  describe('when the code-signature:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.code-signature')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'code-signature:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.code-signature')).toExist();

        let codeSignatureElement = workspaceElement.querySelector('.code-signature');
        expect(codeSignatureElement).toExist();

        let codeSignaturePanel = atom.workspace.panelForItem(codeSignatureElement);
        expect(codeSignaturePanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'code-signature:toggle');
        expect(codeSignaturePanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.code-signature')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'code-signature:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let codeSignatureElement = workspaceElement.querySelector('.code-signature');
        expect(codeSignatureElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'code-signature:toggle');
        expect(codeSignatureElement).not.toBeVisible();
      });
    });
  });
});
