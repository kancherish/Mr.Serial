import Navbar from "./components/Navbar";
import { SideBar } from "./components/SideBar";

const App = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#1A1B26] text-white overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        
        {/* This would be your main content area, now with its own scrollbar */}
        <main className="flex-1 p-8 overflow-y-auto">
          
        </main>
      </div>
    </div>
  );
};

export default App;
