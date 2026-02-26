import React from 'react';

export default function SplashScreen() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden bg-white">
      <div className="flex flex-col items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-[#6B52AD]/10 rounded-full blur-2xl"></div>
          <div className="relative flex items-center justify-center">
            <svg className="text-gray-900" fill="none" height="120" viewBox="0 0 120 120" width="120" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 110C60 110 20 74.4578 20 46.1205C20 23.9627 37.9086 6 60 6C82.0914 6 100 23.9627 100 46.1205C100 74.4578 60 110 60 110Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
              <path d="M60 70C60 70 42 53.75 42 41C42 31.0589 50.0589 23 60 23C69.9411 23 78 31.0589 78 41C78 53.75 60 70 60 70Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          BILAHUJAN
        </h1>
        <p className="mt-3 text-sm font-medium text-gray-500 tracking-wide uppercase">
          Flood Risk & Drainage Analysis
        </p>
      </div>
      <div className="absolute bottom-24 flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-[#6B52AD]/20 border-t-[#6B52AD] rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
