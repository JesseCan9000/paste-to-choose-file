chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pasteToFileInput",
    title: "Paste to Choose File",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "pasteToFileInput") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: handlePasteToFileInputWithDependencies
    });
  }
});

function handlePasteToFileInputWithDependencies() {
  async function handlePasteToFileInput() {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (let item of clipboardItems) {
        if (item.types.includes('image/png')) {
          const blob = await item.getType('image/png');
          const file = new File([blob], 'clipboard_image.png', { type: 'image/png' });
          injectFileToInput(file);
          return;
        }
        // Handle other file types similarly
      }
      showUnsupportedFileTypeMessage();
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
    }
  }

  function injectFileToInput(file) {
    const inputElement = document.querySelector(':focus');
    if (inputElement && inputElement.type === 'file') {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputElement.files = dataTransfer.files;

      // Manually trigger the change event
      const event = new Event('change', { bubbles: true });
      inputElement.dispatchEvent(event);
    } else {
      showUnsupportedFileTypeMessage();
    }
  }

  function showUnsupportedFileTypeMessage() {
    alert("Unsupported File Type. Please paste an image file from your clipboard.");
  }

  handlePasteToFileInput();
}
