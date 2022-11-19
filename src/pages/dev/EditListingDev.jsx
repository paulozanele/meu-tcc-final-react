import { useState, useEffect} from "react";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
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


export default function CreateListingDoc() {
  const navigate = useNavigate();
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);

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
    
    useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing");
      navigate("/");
    }
    }, [auth.currentUser.uid, listing, navigate]);

    useEffect(() => {
        setLoading(true);
        async function fetchListing() {
          const docRef = doc(db, "listingsDev", params.listingId);
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
    const docRef = doc(db, "listingsDev", params.listingId);

    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Editado com sucesso");
    navigate("/profile-dev");
    //navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6
      font-bold'> Nova narrativa </h1>

      <form onSubmit={onSubmit} >

        <p className='text-lg mt-6 font-semibold'>Título nova narrativa</p>
        <div className=''>
          <input type='text' id="tituloNarrativa" value={tituloNarrativa} onChange={onChange}
          placeholder="Título do cenário" maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
        </div>


        <p className="text-lg font-semibold">Narrativa</p>
        <textarea
          type="text"
          id="narrativa"
          value={narrativa}
          onChange={onChange}
          placeholder="Como, Quero, Para que"
          //required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        
        <p className="text-lg font-semibold">Cenários</p>
        <textarea
          type="text"
          id="cenarios"
          value={cenarios}
          onChange={onChange}
          placeholder="Dado, Quando, Então"
          //required
          className="w-full px-4 py-7 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
    
        <p className="text-lg font-semibold">Observações importantes</p>
        <textarea
          type="text"
          id="obsDoc"
          value={obsDoc}
          onChange={onChange}
          placeholder="Observações importantes sobre as narrativas e cenários"
          //required
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