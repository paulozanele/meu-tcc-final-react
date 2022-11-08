import React from 'react'
import { useState } from 'react';
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import {Link, useNavigate} from "react-router-dom"
import {signInWithEmailAndPassword, getAuth} from "firebase/auth"
import {toast} from "react-toastify"


export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password:"",
  })
  const {email, password} = formData;

  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const navigate=useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {

      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        toast.success("Entrar realizado com sucesso");
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Email ou senha errada");
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold m'>Sistema de Login</h1>
      <div className='flex flex-wrap items-center px-6 py-12 max-w-6xl mx-auto justify-center'>
        
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20 items-center'>
          <form onSubmit={onSubmit}>
            <div>
              <input type="email" id='email'  
              value={email} 
              onChange={onChange}
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              placeholder="Email"
              />
            </div>
            <div className='relative mb-6'>
              <input type={showPassword ? "text" : "password"} id='password'  
              value={password} 
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              placeholder="Senha"
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
                Não tem conta?
                <Link to = "/sign-up" className='text-red-600 hover:text-red-700 transition duration-200'> Cadastre-se</Link>
              </p>
              <p>
                <Link to = "/forgot-password" className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"> Esqueceu a senha?</Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Entrar
            </button>
          </form>
           
        </div>
      </div>
    </section>
  )
}
