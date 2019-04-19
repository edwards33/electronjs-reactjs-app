const electron = require("electron");
const DataStore = require('./store');

const { app, BrowserWindow, Menu, ipcMain } = electron;
let startUrl =
  process.env.ELECTRON_START_URL || `file://${__dirname}/build/index.html`;
startUrl = startUrl.trim();

let mainWindow;
let addTodoWindow;

const todosData = new DataStore();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    height: 600,
    width: 700,
    resizable: false
  });
  const url = startUrl + "?window=main";
  mainWindow.loadURL(url);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  if (process.platform === "darwin") {
    Menu.setApplicationMenu(mainMenu);
  } else {
    mainWindow.setMenu(mainMenu);
  }
};

const createAddTodoWindow = () => {
  addTodoWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    height: 200,
    width: 400,
    resizable: false
  });

  const url = startUrl + "?window=new_todo";
  addTodoWindow.loadURL(url);

  addTodoWindow.on("closed", () => {
    addTodoWindow = null;
  });

  addTodoWindow.setMenu(null);
};

app.on("ready", createWindow);

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
        click() {
          createAddTodoWindow();
        }
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "toggledevtools" }]
  }
];

ipcMain.on("todo:list", event => {
  mainWindow.webContents.send(
    "todo:list", 
    todosData.todos
  );
});

ipcMain.on("todo:delete", (event, data) => {
  mainWindow.webContents.send(
    "todo:list", 
    todosData.deleteTodo(data)
  );
});

ipcMain.on("todo:add", (event, data) => {
  mainWindow.webContents.send(
    "todo:list", 
    todosData.addTodo(data)
  );
  addTodoWindow.close();
});
