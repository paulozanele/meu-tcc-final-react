import React from 'react'
import { useState } from 'react'

export default function CreateListing() {

  const [formData, setFormData] = useState ({
    nomeProjeto: "",
    descricaoProjeto:"",
    planoDeTestes: false,
    especDoProjetoDeTeste: false,
    especDosCasosDeTeste: false,
    especDeProcedimentoDeTeste: false,
    relatoStatusDeTeste: false,
    logDeTeste: false,
    relatoIncidenteDeTestes: false,
    relatoSumarioDeTestes: false,
    historiaCenarios: false,
    documentacao: false,
    

  });

  const {nomeProjeto, descricaoProjeto, planoDeTestes, especDoProjetoDeTeste, especDosCasosDeTeste, especDeProcedimentoDeTeste,
  relatoStatusDeTeste, logDeTeste, relatoIncidenteDeTestes, relatoSumarioDeTestes, historiaCenarios, documentacao} = formData;
  
  function onChange(){
  };
  
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6
      font-bold'> Novo Projeto </h1>
      <form>


        <p className='text-lg mt-6 font-semibold'>Nome do Projeto</p>
        <div className=''>
          <input type='text' id="name" value={nomeProjeto} onChange={onChange}
          placeholder="Nome do Projeto" maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
        </div>


        <p className="text-lg font-semibold">Descrição</p>
        <textarea
          type="text"
          id="descricao"
          value={descricaoProjeto}
          onChange={onChange}
          placeholder="Descrição"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />


        <p className="text-lg mt-6 font-semibold">Plano de testes - Responsabilidade do criador do projeto</p>
        <div className="flex">
          <button
            type="button"
            id="planoDeTestes"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !planoDeTestes ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="planoDeTestes"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              planoDeTestes ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Especificação do projeto de teste - Responsabilidade testador </p>   
        <div className="flex">
          <button
            type="button"
            id="especDoProjetoDeTeste"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !especDoProjetoDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="especDoProjetoDeTeste"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              especDoProjetoDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Especificação dos casos de teste - Responsabilidade testador </p>   
        <div className="flex">
          <button
            type="button"
            id="especDosCasosDeTeste"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !especDosCasosDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="specDosCasosDeTeste"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              especDosCasosDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>


        <p className="text-lg mt-6 font-semibold">Especificação de procedimento de teste - Responsabilidade testador </p>   
        <div className="flex">
          <button
            type="button"
            id="especDeProcedimentoDeTeste"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !especDeProcedimentoDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="specDosCasosDeTeste"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              especDeProcedimentoDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        
        <p className="text-lg mt-6 font-semibold">Relátorio do status de teste - Responsabilidade testador </p>   
        <div className="flex">
          <button
            type="button"
            id="relatoStatusDeTeste"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !relatoStatusDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="relatoStatusDeTeste"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              relatoStatusDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>


        <p className="text-lg mt-6 font-semibold">Log de teste - Responsabilidade testador </p>   
        <div className="flex">
          <button
            type="button"
            id="logDeTeste"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !logDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="logDeTeste"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              logDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Relátorio de incidente de testes - Responsabilidade testador </p>   
        <div className="flex">
          <button
            type="button"
            id="relatoIncidenteDeTestes"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !relatoIncidenteDeTestes ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="relatoIncidenteDeTestes"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              relatoIncidenteDeTestes ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Relátorio sumário testes - Responsabilidade testador</p>   
        <div className="flex">
          <button
            type="button"
            id="relatoIncidenteDeTestes"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !relatoSumarioDeTestes ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="relatoIncidenteDeTestes"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              relatoSumarioDeTestes ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">História e Cenários - Responsabilidade desenvolvedor</p>   
        <div className="flex">
          <button
            type="button"
            id="historiaCenarios"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !historiaCenarios ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="historiaCenarios"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              historiaCenarios ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Documentação - Responsabilidade documentador</p>   
        <div className="flex">
          <button
            type="button"
            id="documentacao"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !documentacao ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            id="relatoIncidenteDeTestes"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              documentacao ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>
      </form>

      <div className="mb-6">
          <p className="text-lg font-semibold">Images e arquivos referentes ao projeto</p>
          <p className="text-gray-600">
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg,.pdf"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button type="submit" className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Criar Projeto</button>


    </main>
  )
}
