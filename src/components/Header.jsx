import React from 'react'
import {useLocation, useNavigate} from "react-router-dom"

export default function Header() {

  const location = useLocation()
  
  console.log(location.pathname);
  
  function pathMatchRoute(route){
    if(route === location.pathname){
      return true
    }
  }

  const navigate = useNavigate ();

  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center
      px-3 max-w-6xl mx-auto'>
        <div>
        <img src="/images/logoHeader.png" alt="logoHeader" 
        className='cursor-pointer' />
        </div>
        <div>
          <ul className='flex space-x-20'>
          <li
            className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
            ${pathMatchRoute("/") && "text-black border-b-blue-500"}`}
            onClick={()=>navigate("/")}>
              Inicio
          </li>
          <li
            className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
            ${pathMatchRoute("/sign-in") && "text-black border-b-blue-500"}`}
            onClick={()=>navigate("/sign-in")}>
              Entrar
          </li>
          <li
            className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
            ${pathMatchRoute("/sign-up") && "text-black border-b-blue-500"}`}
            onClick={()=>navigate("/sign-up")}>
              Cadastre-se
          </li>
          </ul>
        </div>
      </header>
    </div>
  )
}
