import React from 'react'
import { useState } from 'react';
import {useLocation, useNavigate} from "react-router-dom"
import {getAuth, onAuthStateChanged} from "firebase/auth"
import { useEffect } from 'react';

export default function Header() {
  
  const[pageState1, setPageState1] = useState("Cadastre-se");
  const[pageState, setPageState] = useState("Entrar");
  const[pageState2, setPageState2] = useState("Sair");
  const[pageState3, setPageState3] = useState("Visualizar Projeto");
  const navigate = useNavigate ();
  const location = useLocation();
  const auth = getAuth();

  function onLogout() {
    auth.signOut();
    navigate("/sign-in");
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user)=>{
      if (user){
        setPageState("Perfis");
        setPageState1("");
        setPageState2("Sair");
        setPageState3("Vizualizar Projeto")
      } else {
        setPageState("Entrar");
        setPageState1("Cadastre-se");
        setPageState2("");
        setPageState3("");
      }

    });
  }, [auth]);

  function pathMatchRoute(route){
    if(route === location.pathname){
      return true
    }
  }



  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center
      px-3 max-w-6xl mx-auto'>
        <div>
        <img src="/images/logoHeaderTeste.png" alt="logoHeaderTeste" 
        className='cursor-pointer' />
        </div>
        <div>
          <ul className='flex space-x-20'>
          <li
            className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
            ${ pathMatchRoute("/view") && "text-black border-b-blue-500"}`}
            onClick={()=>navigate("/view")}>
              {pageState3}
          </li>

          <li
            className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
            ${
              (pathMatchRoute("/") || pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) 
              && "text-black border-b-blue-500"}`}
            onClick={()=>navigate("/profile")}>
              {pageState}
          </li>
          <li
            className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
            ${
              (pathMatchRoute("/sign-up") )
               && "text-black border-b-blue-500"}`}
            onClick={()=>navigate("/sign-up")}>
              {pageState1}
          </li>
          <li
            className={`cursor-pointer py-3 text-sm font-semibold text-red-400 border-b-[3px] border-b-transparent 
            ${
              (pathMatchRoute("/view") || pathMatchRoute("/") || pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) }`}
              onClick={onLogout}>
              {pageState2}
          </li>

          </ul>
        </div>
      </header>
    </div>
  )
}