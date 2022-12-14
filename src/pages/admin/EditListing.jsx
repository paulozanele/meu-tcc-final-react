import { useState, useEffect} from "react";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
  } from "firebase/firestore";


export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const params = useParams();
  const [checked, setChecked] = useState(false);
  const [listing, setListing] = useState(null);
  console.log('checked', checked)
  const handleChange = (e) => {
    setChecked({...checked,[e.target.name] : e.target.checked});
  }

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState ({
    nivelDeAcesso: "admin",
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
    
    useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing");
      navigate("/");
    }
    }, [auth.currentUser.uid, listing, navigate]);

    useEffect(() => {
        setLoading(true);
        async function fetchListing() {
          const docRef = doc(db, "listings", params.listingId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setListing(docSnap.data());
            setFormData({ ...docSnap.data() });
            setLoading(false);
          } else {
            navigate("/");
            toast.error("Listing does not exist");
          }
        }
        fetchListing();
      }, [navigate, params.listingId]);

  
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
    
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
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
      [...images].map((image) => storeImage(image))
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
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = doc(db, "listings", params.listingId);

    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Editado com sucesso");
    navigate("/profile-admin");
    //navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6
      font-bold'> Editar o projeto </h1>

      <form onSubmit={onSubmit} >


        <p className='text-lg mt-6 font-semibold'>Nome do Projeto</p>
        <div className=''>
          <input type='text' id="nomeProjeto" value={nomeProjeto} onChange={onChange}
          placeholder="Nome do Projeto" maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
        </div>


        <p className="text-lg font-semibold">Descri????o</p>
        <textarea
          type="text"
          id="descricaoProjeto"
          value={descricaoProjeto}
          onChange={onChange}
          placeholder="Descri????o"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />


        <p className='text-2xl mt-6 font-semibold'>Documentos que ser??o definidos para este projeto:</p>

        {/*se????o um checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "planoDeTestes"
              name = "planoDeTestes"
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, planoDeTestes: target.checked })}
              //${planoDeTestes ? checked : !checked}
              //checked ={`${formData.planoDeTestes ? checked : !checked}`}
              checked={formData.planoDeTestes}
              value={formData.planoDeTestes}

              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Plano de testes - Responsabilidade do criador do projeto</label>
          </div>
        </div>

         {/*se????o dois checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "especDoProjetoDeTeste"
              name = "especDoProjetoDeTeste" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, especDoProjetoDeTeste: target.checked })}
              checked={formData.especDoProjetoDeTeste}
              value={formData.especDoProjetoDeTeste}

              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Especifica????o do projeto de teste -  Responsabilidade do criador do projeto</label>
          </div>
        </div>

         {/*se????o tres checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "especDosCasosDeTeste"
              name = "especDosCasosDeTestes" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, especDosCasosDeTeste: target.checked })}
              checked={formData.especDosCasosDeTeste}
              value={formData.especDosCasosDeTeste}
              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Especifica????o dos casos de testes -  Responsabilidade do criador do projeto</label>
          </div>
        </div>


         {/*se????o quatro checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "especDeProcedimentoDeTeste"
              name = "especDeProcedimentoDeTeste" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, especDeProcedimentoDeTeste: target.checked })}
              checked={formData.especDeProcedimentoDeTeste}
              value={formData.especDeProcedimentoDeTeste}
              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Especifica????o de procedimento de testes -  Responsabilidade do criador do projeto</label>
          </div>
        </div>

         {/*se????o cinco checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "relatoStatusDeTeste"
              name = "relatoStatusDeTeste" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, relatoStatusDeTeste: target.checked })}
              checked={formData.relatoStatusDeTeste}
              value={formData.relatoStatusDeTeste}
              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Rel??torios dos status dos testes - Responsabilidade testador</label>
          </div>
        </div>


         {/*se????o seis checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "logDeTeste"
              name = "logDeTeste" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, logDeTeste: target.checked })}
              checked={formData.logDeTeste}
              value={formData.logDeTeste}
              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Logs dos testes - Responsabilidade testador</label>
          </div>
        </div>

         {/*se????o sete checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "relatoIncidenteDeTestes"
              name = "relatoIncidenteDeTestes" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, relatoIncidenteDeTestes: target.checked })}
              checked={formData.relatoIncidenteDeTestes}
              value={formData.relatoIncidenteDeTestes}
              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Rel??torios dos incidentes dos testes - Responsabilidade testador</label>
          </div>
        </div>

         {/*se????o oito checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "relatoSumarioDeTestes"
              name = "relatoSumarioDeTestes" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, relatoSumarioDeTestes: target.checked })}
              checked={formData.relatoSumarioDeTestes}
              value={formData.relatoSumarioDeTestes}
              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Rel??torios sum??rios dos testes - Responsabilidade testador</label>
          </div>
        </div>


         {/*se????o nove checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
              type = "checkbox"
              id = "historiaCenarios"
              name = "historiaCenarios" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, historiaCenarios: target.checked })}
              checked={formData.historiaCenarios}
              value={formData.historiaCenarios}
              aria-describedby="helper-checkbox-text" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Narrativas e Cen??rios - Responsabilidade desenvolvedor</label>
          </div>
        </div>


         {/*se????o dez checkbox*/}
        <div class="flex mt-6"> 
          <div class="flex items-center h-5">
            <input
            
              type = "checkbox"
              id = "documentacao"
              name = "documentacao" 
              onChange={handleChange}
              onClick={({ target }) => setFormData({ ...formData, documentacao: target.checked })}
              checked={formData.documentacao}
              value={formData.documentacao}
              aria-describedby="helper-checkbox-text" 
              
              class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
          </div>
          <div class="ml-2 text-sm">
            <label for="checkbox1" class=" text-gray-900 dark:text-gray-300 text-lg font-semibold">Documenta????es - Responsabilidade documentador</label>
          </div>
        </div>

        <div className="mb-6 mt-6">
          <p className="text-lg font-semibold">Arquivos referentes ao projeto</p>
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
        <button type="submit" className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Salvar
        </button>
        
        
        </form>
    </main>
  )
}