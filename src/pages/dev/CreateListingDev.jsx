import { useState } from "react";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";
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
import { useNavigate } from "react-router-dom";


export default function CreateListingDoc() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState ({
    nivelDeAcesso: "desenvolvedor",
    tituloNarrativa:"",
    narrativa:"",
    cenarios:"",
    obsDoc:"",
    images: {},
  });
  const { 
    nivelDeAcesso,
    tituloNarrativa,
    narrativa,
    cenarios,
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
      userEmail: auth.currentUser.email,
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    const docRef = await addDoc(collection(db, "listingsDev"), formDataCopy);
    setLoading(false);
    toast.success("Criado com sucesso");
    //navigate("/");
    navigate("/profile-dev");
    //navigate(`/category/${formDataCopy.nivelDeAcesso}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

   //criar uma query 
    //se o campo historiaCenarios da collection listings for true, liberar o formul??rio abaixo
    //sen??o n??o mostrar nenhum campo

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6
      font-bold'> Nova narrativa </h1>

      <form onSubmit={onSubmit} >

        <p className='text-lg mt-6 font-semibold'>T??tulo (M??nimo 10 caracteres)</p>
        <div className=''>
          <input type='text' id="tituloNarrativa" value={tituloNarrativa} onChange={onChange}
          placeholder="T??tulo" maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
        </div>


        <p className="text-lg font-semibold">Narrativa</p>
        <textarea
          type="text"
          id="narrativa"
          value={narrativa}
          onChange={onChange}
          placeholder="Como, Quero, Para que"
         // required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        
        <p className="text-lg font-semibold">Cen??rios</p>
        <textarea
          type="text"
          id="cenarios"
          value={cenarios}
          onChange={onChange}
          placeholder="Dado, Quando, Ent??o"
          //required
          className="w-full px-4 py-7 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
    
        <p className="text-lg font-semibold">Observa????es importantes</p>
        <textarea
          type="text"
          id="obsDoc"
          value={obsDoc}
          onChange={onChange}
          placeholder="Observa????es importantes sobre a narrativa e os cen??rios"
          //required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <div className="mb-6">
          <p className="text-lg font-semibold">Arquivos referentes a narrativa</p>
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