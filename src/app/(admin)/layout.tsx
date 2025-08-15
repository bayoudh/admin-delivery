import { Sidebar } from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
         <div className="min-h-screen bg-gray-50 flex">
      <Sidebar/>
      <div className="flex-1 ml-64">
        {children}
         <ToastContainer position="top-right" autoClose={3000} />
        </div>

        </div>
    
  );
}
