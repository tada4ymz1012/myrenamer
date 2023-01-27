const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myApi", {
    openSlctDirDialog: () => {
        ipcRenderer.send("select-dir");
    },
    execRename: () => {
        ipcRenderer.send("exec-rename");
    },
    handleSlctDir: (callback) => {
        ipcRenderer.on("update-dirpath", callback);
    },
    handleFileList: (callback) => {
        ipcRenderer.on("update-oldlist", callback);
    },
    handleNewList: (callback) => {
        ipcRenderer.on("update-newlist", callback);
    },
    handleRenameDone: (callback) => {
        ipcRenderer.on("update-renamedone", callback);
    },
    handleRenameFail: (callback) => {
        ipcRenderer.on("update-renamefail", callback);
    }
});