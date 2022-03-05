const { contextBridge, ipcRenderer } = require("electron");

/**
 * To make sure there is no other events are invoked
 * and expose you app or computer to some problem (Attacks)!
 */
const validChannels = [
  "get-videos",
  "create-video",
  "update-video",
  "get-playlists",
  "delete-video",
];

contextBridge.exposeInMainWorld("ipc", {
  invoke: (channel, args) => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, args);
    }
  },
  on: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
