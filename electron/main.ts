import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { SerialPort } from 'serialport'
import { ReadlineParser } from 'serialport'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


let serialPort: SerialPort | null = null;

let mainWindow: BrowserWindow | null = null;

let parser: ReadlineParser | null = null

const isDev = process.env.NODE_ENV === 'development'




function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.setMenuBarVisibility(false)

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173') // Vite dev server
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

ipcMain.handle("get-ports", async () => {
  const ports = await SerialPort.list()

  return ports.map(p => ({ path: p.path, name: p.manufacturer }))
})

ipcMain.handle("connect-to-port", async (event, port, baud) => {
  if (serialPort) {
    return { status: true, message: "already Connected" }
  }

  if (!port || !baud) {
    return { status: false, message: "Invalid Parameters" }
  }
  try {
    serialPort = new SerialPort({ path: port, baudRate: baud })

    parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }))

    return new Promise((resolve) => {

      if (!serialPort || !parser) {
        return resolve({ status: false, message: "failed to connect" })
      }

      serialPort.on("open", () => {
        resolve({ status: true, message: "Connected Succesfully" })
      })

      const logData = (data:string)=>{
        parser?.off("data",logData)
        console.log(data)
      }

      parser?.on("data",logData)

      serialPort.on("error", (err) => {
        serialPort = null
        resolve({ status: false, message: err.message })
      })
    })


  } catch (error: unknown) {
    let message = ""
    if (error instanceof Error) {
      message = error.message
    } else {
      message = String(error)
    }
    return { status: false, message }
  }
})



ipcMain.handle("serial:write", async (event, command,enableStream=false,disableStream=false) => {

  if (!serialPort || !serialPort.isOpen) {
    return { status: false, message: "Please Connect To Device To Communicate" }
  }

  if (!command) {
    return { status: false, message: "Please Provide A Command To Send" }
  }


  return new Promise((resolve) => {
    const timeOut = setTimeout(() => {
      resolve({ status: false, message: "no response" })
    },6000)

    try {
      serialPort?.write(command)


      if (enableStream || disableStream) {
          const liveData = (data:string)=>{
              mainWindow?.webContents.send("liveData",data)
          }
          if (disableStream) {
            clearTimeout(timeOut)
            parser?.off("data",liveData)
          }else{
            clearTimeout(timeOut)
            parser?.on("data",liveData)
          }
      }
      else{
        const onData = (data:string)=>{
          clearTimeout(timeOut)
          parser?.off("data",onData)
          resolve({status:true,message:data})
        }
        
        parser?.on("data",onData)
      }

      
    } catch (error) {
      let message = ""
      if (error instanceof Error) {
        message = error.message
      } else {
        message = String(error)
      }
      resolve({ status: false, message })
    } finally {
      clearTimeout(timeOut)
    }

  })



})




app.whenReady().then(createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})