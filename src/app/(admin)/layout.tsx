import { Sidebar } from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
  <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-0 lg:ml-64 transition-all duration-300">
        {/* Page content */}
        <div className="p-4">{children}</div>

        {/* Toast notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}
