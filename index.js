const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;


ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: path.join(__dirname, 'assets/pig.png'),
  })
});


const enableMode = (name) => win.webContents.send('mode', name);

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/icon.icns'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  await win.loadFile('index.html');
  // await win.loadURL('https://www.facebook.com/');
  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  const menu = Menu.buildFromTemplate([
    {label: app.getName()},
    {label: 'Foo', submenu: [{label : 'first menu item'}, {label : 'second menu item'}]},
    {label: 'Bar', submenu: [{label : 'third menu item'}, {label : 'fourth menu item'}]},
  ]);
  // Menu.setApplicationMenu(menu);
  const dockMenu = Menu.buildFromTemplate([ {
      label: 'Modes',
      submenu: [
        { label: 'Light', click: () => enableMode('light') },
        { label: 'Dark', click: () => enableMode('dark') }
      ]
    }
  ]);

  app.dock.setMenu(dockMenu)
  win.webContents.toggleDevTools();
  // win.webContents.setZoomFactor(2);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    await createWindow();
  }
});


