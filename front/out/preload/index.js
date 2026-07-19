"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  sendMessage: (data) => electron.ipcRenderer.invoke("message:create", data),
  getMessages: (chatId) => electron.ipcRenderer.invoke("message:get", chatId),
  saveFile: (payload) => electron.ipcRenderer.invoke("file:save", payload)
});
