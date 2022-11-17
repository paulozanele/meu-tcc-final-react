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


export default function CreateListingDoc() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState ({
    nivelDeAcesso: "documentador",
    tituloDocTestes: "",
    docTestes:"",
    obsDoc:"",
    images: {},
  });
  const { 
    nivelDeAcesso,
    tituloDocTestes,
    docTestes, 
    obsDoc,
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
      toast.error("Sem arquivos para subir");
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
    const docRef = await addDoc(collection(db, "listingsDoc"), formDataCopy);
    setLoading(false);
    toast.success("Criado com sucesso");
    navigate("/profile-doc");
    //navigate(`/category/${formDataCopy.nivelDeAcesso}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

    //criar uma query 
    //se o campo documentação da collection listings for true, liberar o formulário abaixo
    //senão não mostrar nenhum campo

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6
      font-bold'> Nova documentação referente ao teste </h1>

      <form onSubmit={onSubmit} >

        <p className='text-lg mt-6 font-semibold'>Título referente a documentação</p>
        <div className=''>
          <input type='text' id="tituloDocTestes" value={tituloDocTestes} onChange={onChange}
          placeholder="Título" maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
        </div>


        <p className="text-lg font-semibold">Descrição</p>
        <textarea
          type="text"
          id="docTestes"
          value={docTestes}
          onChange={onChange}
          placeholder="Aqui a linguagem mais técnica dos testadores, recebidas por meio dos testes das narrativas e cenários. São transcritas de formas mais clara de entender, para fazer parte da documentação final referente aos testes"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
    
        <p className="text-lg font-semibold">Observações importantes</p>
        <textarea
          type="text"
          id="obsDoc"
          value={obsDoc}
          onChange={onChange}
          placeholder="Observações importantes sobre a realização da documentação"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
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
        <button type="submit" className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Criar
        </button>
        
        </form>
    </main>
  )
}