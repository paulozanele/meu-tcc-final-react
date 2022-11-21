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
import ListingItemTest from "../../components/ListingItemTest";

export default function ProfileTest() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listingsTest, setListingsTest] = useState(null);
  const [hasRelaStatusTestListing, setHasRelaStatusTestListing] = useState(false);
  const [hasLogTestListing, setHasLogTestListing] = useState(false);
  const [hasRelaInciTestListing, setHasRelaInciTestListing] = useState(false);
  const [hasRelaSumaTestListing, setHasRelaSumaTestListing] = useState(false);

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
      const listingRef = collection(db, "listingsTest");
      const q = query(
        listingRef,
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
    fetchUserListings();
  }, [auth.currentUser.uid]);


  async function onDelete(listingID) {
    if (window.confirm("Tem certeza que deseja deletar?")) {
      await deleteDoc(doc(db, "listingsTest", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Deletado com sucesso");
    }
  }
  function onEdit(listingID) {
    navigate(`/edit-listing-test/${listingID}`);
  }


  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">Perfil Testador</h1>
        <h2 className="text-2xl text-center mt-6 font-bold">Documentos a serem definido:</h2>
        {(hasRelaStatusTestListing || hasLogTestListing || hasRelaInciTestListing || hasRelaSumaTestListing ) && <div className="w-full md:w-[50%] mt-6 px-3">
          <button type="submit" 
          className="mt-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
            <Link to ="/create-listing-test">
              Criar novos documentos referente ao teste
            </Link>
          </button>
        </div>}
        {(!hasRelaStatusTestListing && !hasLogTestListing && !hasRelaInciTestListing && !hasRelaSumaTestListing) && <div className="w-full md:w-[50%] mt-6 px-3">
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
                <><ListingItemTest
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