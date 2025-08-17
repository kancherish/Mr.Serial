import { useState } from "react"
import type { navbarItems } from "../types/interfaces"
import CommunicationModal from "./CommunicationModal"


const Navbar = () => {

  const [isCommunicationModalOpen,setIsCommunicationModalOpen] = useState<boolean>(false)

  function toggleCommunicationModal(){
    setIsCommunicationModalOpen(!isCommunicationModalOpen)
  }

  const menuOptions:navbarItems[] = [
    {
        name:"File",
        cb:()=>{alert("In Progress")}
    },
    {
        name:"Communication",
        cb:toggleCommunicationModal
    }
  ]

  return (
    <div className="w-full bg-[#414868] p-2 min-h-[4vh]">
        <ul className="flex gap-2">
          {menuOptions.map((item,index)=>{
            return (
            <li key={index} className="p-0.5 text-[0.9rem] cursor-pointer" onClick={item.cb}>
                {item.name}
            </li>
            )
          })}
        </ul>
        <CommunicationModal isOpen={isCommunicationModalOpen} onClose={toggleCommunicationModal} />
    </div>
  )
}

export default Navbar