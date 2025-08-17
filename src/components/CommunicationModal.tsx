import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { fetchedPorts } from "../types/interfaces";
import { useDispatch } from "react-redux";
import { addConfig } from "../store/configSlice";

const CommunicationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [ports, setPorts] = useState<fetchedPorts[]>([])

  const dispatch = useDispatch()
  

  const commonBaudRates = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600]

  function saveSettings(formData: FormData) {
    const port = formData.get("port") as string
    const baud = Number(formData.get("baud")) as number

    if (!port) {
      alert("Please select a port")
      return
    }

    dispatch(addConfig({port,baud}))
   
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      
      
      window.electronAPI?.getAvailablePorts().then((portsList: fetchedPorts[]) => {
        setPorts(portsList)
      }).catch((error) => {
        console.error('Failed to fetch ports:', error)
      })
    }
  }, [isOpen])

  // Don't render if modal is closed
  if (!isOpen) return null

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full mx-4 relative border border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-semibold">
            Serial Port Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form action={saveSettings} className="p-6">
          
          {/* Port selection */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Serial Port
            </label>
            <select 
              name="port" 
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a port...</option>
              {ports.map((port) => (
                <option key={port.path} value={port.path}>
                  {`${port.path}${port.name ? ` - ${port.name}` : ''}`}
                </option>
              ))}
            </select>
            {ports.length === 0 && (
              <p className="text-gray-500 text-xs mt-1">No serial ports detected</p>
            )}
          </div>

          {/* Baud Rate selection */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Baud Rate
            </label>
            <select 
              name="baud"
              defaultValue={151300}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {commonBaudRates.map((rate) => (
                <option key={rate} value={rate}>
                  {rate.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Save Settings
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default CommunicationModal