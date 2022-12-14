import { useState, useEffect} from "react";
import Spinner from "../../components/Spinner";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
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
    getDocs,
    where,
    query,
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
  } from "firebase/firestore";

export default function CreateListing() {
  const [listingsTest, setListingsTest] = useState(null);
  const [hasRelaStatusTestListing, setHasRelaStatusTestListing] = useState(false);
  const [hasLogTestListing, setHasLogTestListing] = useState(false);
  const [hasRelaInciTestListing, setHasRelaInciTestListing] = useState(false);
  const [hasRelaSumaTestListing, setHasRelaSumaTestListing] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState ({
    nivelDeAcesso: "testador",
    tituloDocTestes: "",
    docTestes:"",
    obsDoc:"",

    relatoStatusDeTeste:"",
    logDeTeste:"",
    relatoIncidenteDeTestes:"",
    relatoSumarioDeTestes:"",
    images: {},
  });
  const { 
    nivelDeAcesso,
    obsDoc,
    tituloDocTestes,
    docTestes, 

    relatoStatusDeTeste,
    logDeTeste,
    relatoIncidenteDeTestes,
    relatoSumarioDeTestes,
    
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
          const docRef = doc(db, "listingsTest", params.listingId);
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
        async function fetchUserListings1() {
          const listingRef = collection(db, "listings");
          const q = query(
            listingRef,
            where("userRef", "==", auth.currentUser.uid),
          );
          const querySnap = await getDocs(q);
          let listingsTest = [];
          querySnap.forEach((doc) => {
            return listingsTest.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setHasRelaStatusTestListing(listingsTest.find((doc) => !!doc.relatoStatusDeTeste))
          setHasLogTestListing(listingsTest.find((doc) => !!doc.logDeTeste))
          setHasRelaInciTestListing(listingsTest.find((doc) => !!doc.relatoIncidenteDeTestes))
          setHasRelaSumaTestListing(listingsTest.find((doc) => !!doc.relatoSumarioDeTestes))
          listingsTest(listingsTest);
        }
        fetchUserListings1();
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
    const docRef = doc(db, "listingsTest", params.listingId);

    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Editado com sucesso");
    navigate("/profile-test");
    //navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6
      font-bold'> Novos dados referente ao teste </h1>

      <form onSubmit={onSubmit} >

        <p className='text-lg mt-6 font-semibold'>T??tulo referente ao teste</p>
        <div className=''>
          <input type='text' id="tituloDocTestes" value={tituloDocTestes} onChange={onChange}
          placeholder="T??tulo" maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
        </div>


        <p className="text-lg font-semibold">Descri????o</p>
        <textarea
          type="text"
          id="docTestes"
          value={docTestes}
          onChange={onChange}
          placeholder="Descri????o"
          //required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        {hasRelaStatusTestListing && <div>
        <p className="text-lg font-semibold">Relat??rio status do teste</p>
        <textarea
          type="text"
          id="relatoStatusDeTeste"
          value={relatoStatusDeTeste}
          onChange={onChange}
          placeholder="Resultado obtido a partir do teste do caso de uso e o respons??vel"
          //required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        </div>}

        {hasLogTestListing && <div>
        <p className="text-lg font-semibold">Log do teste</p>
        <textarea
          type="text"
          id="logDeTeste"
          value={logDeTeste}
          onChange={onChange}
          placeholder="Observa????es importantes sobre a realiza????o da documenta????o"
          //required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        </div>}

        {hasRelaInciTestListing && <div>
        <p className="text-lg font-semibold">Relat??rio de incidente do teste</p>
        <textarea
          type="text"
          id="relatoIncidenteDeTestes"
          value={relatoIncidenteDeTestes}
          onChange={onChange}
          placeholder="Eventos que ocorreram na execu????o do teste "
          //required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        </div>}


        {hasRelaSumaTestListing && <div>
        <p className="text-lg font-semibold">Relat??rio sum??rio do teste</p>
        <textarea
          type="text"
          id="relatoSumarioDeTestes"
          value={relatoSumarioDeTestes}
          onChange={onChange}
          placeholder="Todos resultados obtidos durante o teste"
          //required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        </div>}

        <p className="text-lg font-semibold">Observa????es importantes</p>
        <textarea
          type="text"
          id="obsDoc"
          value={obsDoc}
          onChange={onChange}
          placeholder="Observa????es importantes sobre a realiza????o da documenta????o"
          //required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

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