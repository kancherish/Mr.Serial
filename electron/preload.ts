import { contextBridge, ipcRenderer } from 'electron'

interface fetchedPorts {
    path:string;
    name:string;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
   getAvailablePorts: (): Promise<fetchedPorts[]> => ipcRenderer.invoke("get-ports"),
   connectToPort: (port: string, baud: number): Promise<{status: boolean, message: string}> => 
     ipcRenderer.invoke("connect-to-port", port, baud),
   sendCommand:(command:string,streamMode?:boolean|undefined): Promise<{status:boolean,message:string}> => ipcRenderer.invoke("serial:write",command,streamMode),
   liveDataStream:(cb:(event:unknown,data:string)=>void) => ipcRenderer.on("liveData",cb)
})