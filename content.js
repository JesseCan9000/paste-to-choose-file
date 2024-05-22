document.addEventListener('contextmenu', (event) => {
  if (event.target.type === 'file') {
    event.target.focus();
  }
});
