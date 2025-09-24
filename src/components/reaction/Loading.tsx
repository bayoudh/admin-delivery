interface LoadingProps {
  name: string;
 
}


export default function Loading({name}: LoadingProps) {


  return (
      <div className="absolute inset-0 flex justify-center items-center bg-white/50 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 text-2xl">Loading {name}...</span>
        </div>
      </div>
  );
}
