import React, { Suspense } from "react";

import  ShowVehicles from "./table"

const LoadingAnimation = () => (
    <div className="p-4 max-w-md mx-auto h-full flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center space-y-4">
      <div className="rounded-full bg-gray-200 h-20 w-20"></div>
      <div className="h-6 bg-gray-200 rounded"> </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-6 bg-gray-200 rounded col-span-3"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded"></div>
    </div>
  </div>
  
  
  );
  
export default async function DashboardPage() {

    // Render content specific to Next-Auth user only
    return (
      <div className="flex flex-col">
          <Suspense fallback={<LoadingAnimation/>}>
  <ShowVehicles/></Suspense>        
  

    
       </div>
    );
  }