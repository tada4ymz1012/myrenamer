const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs").promises;
const moment = require("moment");

let mainWindow;
let dirpath;
let dict;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
    });
    mainWindow.loadFile("index.html");
    //mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    ipcMain.on("select-dir", async (evt, arg) => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ["openDirectory"]
        });
        dirpath = result.filePaths[0];
        mainWindow.webContents.send("update-dirpath", dirpath);
        dict = {};
        fs.readdir(dirpath, {withFileTypes: true}).then((dirents) => {
            for (const dirent of dirents) {
                if (dirent.isDirectory()) continue;
                const ext = path.extname(dirent.name);
                if (ext === '.jpg' || ext === '.png' || ext === '.gif') {
                    dict[dirent.name] = {
                        ext: ext,
                        old: dirent.name,
                        new: ""
                    };
                }
            }
            mainWindow.webContents.send("update-oldlist", Object.keys(dict).map((k) => {
                return dict[k].old;
            }));
            const promises = Object.keys(dict).map((k, i) => {
                return new Promise((resolve, reject) => {
                    fs.stat(path.join(dirpath, dict[k].old)).then((val) => {
                        const dstr = moment(val.birthtime).format("YYYY-MM-DD_HH-mm-ss");
                        const num = ((x) => {
                            if (x > 99) {
                                return "" + x;
                            } else if (x > 9) {
                                return "0" + x;
                            } else {
                                return "00" + x;
                            }
                        })(i);
                        dict[k].new = dstr + "_" + num + dict[k].ext;
                        resolve(true);
                    }).catch((err) => {
                        reject(err);
                    });
                });
            });
            return Promise.all(promises);
        }).then((val) => {
            mainWindow.webContents.send("update-newlist", Object.keys(dict).map((k) => {
                return dict[k].new;
            }));
        }).catch((err) => {
            console.log(err);
        });
    });
    ipcMain.on("exec-rename", async (evt, arg) => {
        const promises = Object.keys(dict).map((k) => {
            return fs.rename(path.join(dirpath, dict[k].old), path.join(dirpath, dict[k].new));
        });
        Promise.all(promises).then(() => {
            mainWindow.webContents.send("update-renamedone");
        }).catch((err) => {
            console.lor(err);
            mainWindow.webContents.send("update-renamefail");
        });
    });
};

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});