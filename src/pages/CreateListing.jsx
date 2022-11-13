import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";


export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState ({
    nivelDeAcesso: "admin",
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
    images: {},
  });
  const {

    nivelDeAcesso,
    nomeProjeto, 
    descricaoProjeto, 
    planoDeTestes, 
    especDoProjetoDeTeste, 
    especDosCasosDeTeste, 
    especDeProcedimentoDeTeste,
    relatoStatusDeTeste, 
    logDeTeste, 
    relatoIncidenteDeTestes, 
    relatoSumarioDeTestes, 
    historiaCenarios, 
    documentacao, 
    images,} = formData;
  
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    async function storeImage(application) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${application.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, application);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((application) => storeImage(application))
      
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
    };
    delete formDataCopy.images;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Criado com sucesso");
    navigate("/profile-admin");
    
    //navigate(`/category/${formDataCopy.nivelDeAcesso}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6
      font-bold'> Novo Projeto </h1>

      <form onSubmit={onSubmit} >


        <p className='text-lg mt-6 font-semibold'>Nome do Projeto</p>
        <div className=''>
          <input type='text' id="nomeProjeto" value={nomeProjeto} onChange={onChange}
          placeholder="Nome do Projeto" maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
        </div>


        <p className="text-lg font-semibold">Descrição</p>
        <textarea
          type="text"
          id="descricaoProjeto"
          value={descricaoProjeto}
          onChange={onChange}
          placeholder="Descrição"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />


        <p className="text-lg mt-6 font-semibold">Plano dos testes - Responsabilidade do criador do projeto</p>
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

        <p className="text-lg mt-6 font-semibold">Especificação do projeto dos testes -  Responsabilidade do criador do projeto </p>   
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

        <p className="text-lg mt-6 font-semibold">Especificação dos casos de teste -  Responsabilidade do criador do projeto </p>   
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
            id="especDosCasosDeTeste"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              especDosCasosDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>


        <p className="text-lg mt-6 font-semibold">Especificação de procedimento dos testes -  Responsabilidade do criador do projeto </p>   
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
            id="especDeProcedimentoDeTeste"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              especDeProcedimentoDeTeste ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        
        <p className="text-lg mt-6 font-semibold">Relátorios dos status dos testes - Responsabilidade testador </p>   
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


        <p className="text-lg mt-6 font-semibold">Logs dos testes - Responsabilidade testador </p>   
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

        <p className="text-lg mt-6 font-semibold">Relátorios dos incidentes dos testes - Responsabilidade testador </p>   
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

        <p className="text-lg mt-6 font-semibold">Relátorios sumários dos testes - Responsabilidade testador</p>   
        <div className="flex">
          <button
            type="button"
            id="relatoSumarioDeTestes"
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
            id="relatoSumarioDeTestes"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              relatoSumarioDeTestes ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Histórias e Cenários - Responsabilidade desenvolvedor</p>   
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

        <p className="text-lg mt-6 font-semibold">Documentações - Responsabilidade documentador</p>   
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
            id="documentacao"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              documentacao ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Não
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold">Arquivos referentes ao projeto</p>
          <p className="text-gray-600">
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg,.pdf,"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button type="submit" className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Criar Projeto
        </button>
        
        </form>
    </main>
  )
}