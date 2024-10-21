// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();
  const sendBtn = document.querySelector('.send-wiki');
  const inputBox = document.querySelector('.input-box');
  // ctrl enter to save
  inputBox.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      submitInput();
    }
  });
  sendBtn.addEventListener('click', () => {
    submitInput();
  });
  function submitInput() {
    const inputNode = document.getElementById('inputField');
    vscode.postMessage({ type: 'sendWiki', data: { text: inputNode.value } });
    inputNode.value = '';
  }

  /**
   * @param {Array<{ value: string }>} colors
   */
  function updateColorList(colors) {
    const ul = document.querySelector('.color-list');
    ul.textContent = '';
    for (const color of colors) {
      const li = document.createElement('li');
      li.className = 'color-entry';

      const colorPreview = document.createElement('div');
      colorPreview.className = 'color-preview';
      colorPreview.style.backgroundColor = `#${color.value}`;
      colorPreview.addEventListener('click', () => {
        onColorClicked(color.value);
      });
      li.appendChild(colorPreview);

      const input = document.createElement('input');
      input.className = 'color-input';
      input.type = 'text';
      input.value = color.value;
      input.addEventListener('change', (e) => {
        const value = e.target.value;
        if (!value) {
          // Treat empty value as delete
          colors.splice(colors.indexOf(color), 1);
        } else {
          color.value = value;
        }
        updateColorList(colors);
      });
      li.appendChild(input);

      ul.appendChild(li);
    }

    // Update the saved state
    vscode.setState({ colors: colors });
  }

  /**
   * @param {string} color
   */
  function onColorClicked(color) {
    vscode.postMessage({ type: 'colorSelected', value: color });
  }

  /**
   * @returns string
   */
  function getNewCalicoColor() {
    const colors = ['020202', 'f1eeee', 'a85b20', 'daab70', 'efcb99'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function addColor() {
    colors.push({ value: getNewCalicoColor() });
    updateColorList(colors);
  }
})();
