import React from 'react'
import { useState } from 'react';
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import {Link} from "react-router-dom"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password:"",
  })
  const {name, email, password} = formData;

  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold m'>Sistema de Cadastro</h1>
      <div className='flex flex-wrap items-center px-6 py-12 max-w-6xl mx-auto justify-center'>
        
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 items-center'>
          <form>
            <div>
              <input type="name" id='name'  
              value={name} 
              onChange={onChange}
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              placeholder="Informe seu nome"
              />
            </div>
            <div>
              <input type="email" id='email'  
              value={email} 
              onChange={onChange}
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              placeholder="Informe seu email"
              />
            </div>
            <div className='relative mb-6'>
              <input type={showPassword ? "text" : "password"} id='password'  
              value={password} 
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              placeholder="Informe sua senha"
              />
              {showPassword ? 
                (
                  <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' 
                  onClick={()=>setShowPassword((prevState)=> !prevState)}/> 
                ): 
                (<AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer'
                onClick={()=>setShowPassword((prevState)=> !prevState)}/>
                )
              } 
            </div>
            <div className='flex justify-between white-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>
                Já possui conta?
                <Link to = "/sign-in" className='text-red-600 hover:text-red-700 transition duration-200'> Entrar agora</Link>
              </p>
              <p>
                <Link to = "/forgot-password" className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"> Esqueceu a senha?</Link>
              </p>
            </div>
          </form>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Entrar
            </button>
        </div>
      </div>
    </section>
  )
}
