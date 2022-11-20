import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import ListingItemDoc from "../../components/ListingItemDoc";

export default function ProfileDoc() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const [listings, setListings] = useState(null);
  const [listingsDocs, setListingsDocs] = useState(null);
  const [hasDocListing, setHasDocListing] = useState(false);
  const [loading, setLoading] = useState(true);

  function onChange(e) {
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
    
  }
  
  function onLogout() {
    auth.signOut();
    navigate("/sign-in");
  }

  async function onSubmit() {
    try {
      if(auth.currentUser.displayName !== name){
        //atualizando o nome no display name no firebase auth
        await updateProfile(auth.currentUser,{
          displayName: name,
        });
      } 
        //atualizando o nome no firestore

        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef,{
          name: name
        });
        toast.success("Atualizado com sucesso")

    } catch (error){
      toast.error("Não foi possível atualizar")
    }
    
  }

  useEffect(() => {
    async function fetchUserListings1() {
      const listingRef2 = collection(db, "listingsDoc");
      const q = query(
        listingRef2,
        where("userRef", "==", auth.currentUser.uid),
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings1();

    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
      );
      const querySnap = await getDocs(q);
      let listingsDocs = [];
      querySnap.forEach((doc) => {
        return listingsDocs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setHasDocListing(listingsDocs.find((doc) => !!doc.documentacao))
      listingsDocs(listingsDocs);
    }
    fetchUserListings();

  }, [auth.currentUser.uid]);


  async function onDelete(listingID) {
    if (window.confirm("Tem certeza que deseja deletar?")) {
      await deleteDoc(doc(db, "listingsDoc", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Deletado com sucesso");
    }
  }
  function onEdit(listingID) {
    navigate(`/edit-listing-doc/${listingID}`);
  }


  //PEGAR A COLLECTION LISTING (PROJETO) VERIFICAR O DOCUMENTAÇÃO SE FOR TRUE MOSTRA O BOTÃO
  //SE FOR FALSO MOSTRAR QUE NENHUM DOCUMENTO FOI SELECIONADO NA CRIAÇAO DO PROJETO



  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">Perfil Documentador</h1>
        <h2 className="text-2xl text-center mt-6 font-bold">Documento a ser definido:</h2>
        {hasDocListing && <div className="w-full md:w-[50%] mt-6 px-3">
          <button type="submit" 
          className="mt-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
            <Link to ="/create-listing-doc">
              Iniciar um novo documento
            </Link>
          </button>
        </div>}
        {!hasDocListing && <div className="w-full md:w-[50%] mt-6 px-3">
          <h2 className="text-2xl text-center mt-6 font-bold">Nenhum documento com responsabilidade do documentador foi definido durante a criação do projeto</h2>
        </div>}
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              Meus Dados
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 ">
              {listings.map((listing) => (
                <><ListingItemDoc
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)} />
                  </>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}