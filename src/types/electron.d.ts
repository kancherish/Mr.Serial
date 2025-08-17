export interface ElectronAPI {
  getAvailablePorts: () => Promise<fetchedPorts[]>
  connectToPort: (port: string, baud: number) => Promise<{ status: boolean, message: string }>
  sendCommand:(command:string,streamMode?:boolean)=>Promise<{status:boolean,message:string}>
  liveDataStream:(cb:(event:unknown,data:string)=>void)=>void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}