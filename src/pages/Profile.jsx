import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
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

export default function Profile() {
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
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
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
    fetchUserListings();
  }, [auth.currentUser.uid]);


  async function onDelete(listingID) {
    if (window.confirm("Tem certeza que deseja deletar?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Deletado com sucesso");
    }
  }
  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
  }


  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">Meu Perfil</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name Input */}

            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />

            {/* Email Input */}

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center ">
                
                <span 
                onClick = {() => {
                  changeDetail && onSubmit();
                 setChangeDetail((prevState) => !prevState)
                }}
                className={"text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"}>
                  {changeDetail ? "Aplicar" : "Editar nome"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer">
                Sair
              </p>
            </div>
          </form>
          <button type="submit" 
          className="mt-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
            <Link to ="/profile-admin">
              Entrar como Administrador
            </Link>
          </button>
          <button type="submit" 
          className="mt-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
            <Link to ="/profile-doc">
              Entre como Documentador
            </Link>
          </button>
          <button type="submit" 
          className="mt-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
            <Link to ="/profile-test">
              Entre como Testador
            </Link>
          </button>
          <button type="submit" 
          className="mt-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
            <Link to ="/profile-dev">
              Iniciar uma nova narrativa e suas histórias - Somente Desenvolvedores
            </Link>
          </button>
        </div>
      </section>
    </>
  );
}