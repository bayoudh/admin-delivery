"use client"
import Image from "next/image";
import React from "react";
import Img404 from '@/assets/404.png'
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
     const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Image className=' object-cover' src={Img404} alt="404"/>
      <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
      <p className="text-2xl text-gray-600 mt-4">Oops! Page not found.</p>
      <p className="text-gray-500 mt-2">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => router.push('/')}
        className="mt-6 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;