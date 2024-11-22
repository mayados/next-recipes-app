"use client";

import AdminNav from "@/components/AdminNav";

const Admin = () =>{


  return (

    <>
    <div className="flex">
      {/* Navigation menu for admin */}
      <AdminNav />
      <section className="border-2 border-green-800 w-[100%]">
        <h1 className="text-3xl text-white text-center">Administration</h1>   
      </section>     
    </div>
    </>

  )
}

export default Admin

