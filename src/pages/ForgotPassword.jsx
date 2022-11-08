import React from 'react'
import { useState } from 'react';

import {Link} from "react-router-dom"

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e){
    setEmail(e.target.value);
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold m'>Sistema de Recuperação de Senha</h1>
      <div className='flex flex-wrap items-center px-6 py-12 max-w-6xl mx-auto justify-center'>
        
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 items-center'>
          <form>
            <div>
              <input type="email" id='email'  
              value={email} 
              onChange={onChange}
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              placeholder="Informe seu email"
              />
            </div>
            <div className='flex justify-between white-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>
                Não tem conta?
                <Link to = "/sign-up" className='text-red-600 hover:text-red-700 transition duration-200'> Cadastre-se</Link>
              </p>
              <p>
                <Link to = "/sign-in" className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"> Entrar agora</Link>
              </p>
            </div>
          </form>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Enviar nova senha
            </button>
        </div>
      </div>
    </section>
  )
}
