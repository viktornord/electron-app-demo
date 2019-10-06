const fs = require('fs');
const fsAsync = fs.promises;
const path = require('path');
const { ipcRenderer } = require('electron');

document.getElementById('electron-version').innerText = process.versions.electron;
document.getElementById('node-version').innerText = process.versions.node;
document.getElementById('chrome-version').innerText = process.versions.chrome;

document.getElementById('notify').addEventListener('click', event => {
  let myNotification = new Notification('Title', {
    icon: 'https://cdn2.vectorstock.com/i/1000x1000/10/31/flat-fire-icon-isolated-on-white-vector-21251031.jpg',
    body: 'Lorem Ipsum Dolor Sit Amet',
  });

  myNotification.onclick = () => alert('Notification clicked');
});

document.getElementById('drag').ondragstart = (event) => {
  event.preventDefault();
  ipcRenderer.send('ondragstart', path.join(__dirname, 'assets/x.ico'))
};
let mode = 'light';
ipcRenderer.on('mode', (event, newMode) => {
  newMode === mode && alert(`Already in ${newMode} mode`);
  mode = newMode;
  document.body.style.background = mode === 'dark' ? '#000' : '#fff';
  document.body.style.color = mode === 'dark' ? '#fff' : '#000';
});


const fileListEl = document.getElementById('file-list');
const backEl = document.getElementById('back-btn');
let openedDir = '/Users/vurbanas';
renderList(openedDir);
backEl.addEventListener('click', async event => {
  await openDir('..');
});
fileListEl.addEventListener('dblclick', async event => {
  const el = event.target;
  const { tagName, classList } = el;
  const fileName = el.innerText;
  const isDir = tagName.toLowerCase() === 'li' && classList.contains('dir');
  isDir && await openDir(fileName);
});

async function openDir(goToPath) {
  const newDir = path.resolve(openedDir, goToPath);
  await renderList(newDir);
  openedDir = newDir;
}


async function renderList(folder) {
  const files = await Promise.all((await fsAsync.readdir(folder)).sort().map(async name => ({
    name,
    isDir: (await fsAsync.lstat(path.join(folder, name))).isDirectory()
  })));
  fileListEl.innerHTML = files.map(({name, isDir}) => (
    `<li class="${isDir ? 'dir': 'file'}" title="${name}">${name}</li>`
  )).join('');
}
