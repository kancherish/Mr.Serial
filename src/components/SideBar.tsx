import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { portConfigState } from "../store/store";
import type { modulesObj } from "../types/interfaces";


export const SideBar = () => {
  const [connectedDevice, setConnectedDevice] = useState<string | null>();
  const [deviceModules, setDeviceModules] = useState<modulesObj[]>([]);
  const [showModules, setShowModules] = useState<boolean>(false);
  const [isConnecting,setIsConnecting] = useState<boolean>(false);


  const portConfig = useSelector((state: portConfigState) => state?.configSlice)


  function moduleClick(modulName:string){
    window.electronAPI.sendCommand("enableStreaming\n",true)
    window.electronAPI.sendCommand(`setFilter: ${modulName}\n`)
  }

  function connectToDevice() {
    setIsConnecting(true)
    if (!portConfig.port) {
      setIsConnecting(false)
      alert("please set communication parameter")
      return
    }
    window.electronAPI.connectToPort(portConfig.port, portConfig.baud)
      .then((response) => {
        if (!response.status) {
          setIsConnecting(false)
          alert(response.message)
        }
        setTimeout(() => {
          window.electronAPI.sendCommand("listVariables\n")
            .then((data) => {
              const variables = data.message.split(",")
              const Modules = variables.map((variable)=>{
                const data = variable.split(":")
                return {
                  name:data[0],
                  type:data[1],
                  status:data[2]
                }
              })
              setConnectedDevice(portConfig.port)
              setDeviceModules(Modules)
            })
            .catch((err) => {
              console.log(err);
              alert("invalid data check baud rate")
            })
            .finally(()=>{
              setIsConnecting(false)
            })
        }, 3000)

      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    window.electronAPI.liveDataStream((event,data)=>{
      console.log(typeof event)
      console.log(data);
      
    })
  }, []);

  return (
    <div className="flex flex-col w-64 h-screen bg-[#1F2335] text-gray-200 p-4 font-sans">
      {connectedDevice ? (
        <>

          <div
            onClick={() => setShowModules(!showModules)}
            className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[#2A2F45] transition-colors duration-200"
          >

            <span className={`transition-transform duration-200 ${showModules ? "rotate-90" : ""}`}>
              <ChevronRight size={18} />
            </span>
            <span className="font-semibold text-white">{connectedDevice}</span>
          </div>


          {showModules && (
            <div className="flex flex-col pt-2 pl-6 space-y-1">
              {deviceModules.map((module: modulesObj, index: number) => (
                <div
                onClick={()=>moduleClick(module.name)}
                  key={index}
                  className="px-2 py-1 text-sm rounded-md cursor-pointer hover:bg-[#2A2F45] transition-colors duration-200"
                >
                  {`${module.name} (${module.type})`}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (

        <div className="flex items-center justify-center h-full">
          <button onClick={connectToDevice} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {isConnecting?"Connecting ...":"Connect To Device"}
          </button>
        </div>
      )}
    </div>
  );
};
