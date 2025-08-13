import { Sidebar } from "@/components/Sidebar";


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
        </div>

        </div>
    
  );
}
