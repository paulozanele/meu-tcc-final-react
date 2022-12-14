import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";


export default function ListingDev() {
  
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db,"listingsDev", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
    <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-red lg:space-x-5 ">
      <div >
        <p className="text-2xl font-bold mb-3 text-blue-900">
        {listing.tituloNarrativa}
        </p>
        <div className="flex justify-start items-center space-x-4 w-[75%]"></div>
        <p className="mt-3 mb-3">
          <span className="font-semibold">Narrativa - </span>
         {listing.narrativa}
        </p>
        <p className="mt-3 mb-3">
          <span className="font-semibold">Cenários - </span>
         {listing.cenarios}
        </p>
        <p className="mt-3 mb-3">
          <span className="font-semibold">Observações importantes - </span>
          {listing.obsDoc}
        </p>
        <p className="mt-3 mb-3">
          <span className="font-semibold"> Responsável - </span>
          {listing.userEmail}
        </p>  
        <p className="mt-3 mb-3">
          <span className="font-semibold">Links dos Arquivos - </span>
        </p>   
        {listing.imgUrls.map((url, index) => (
        <div className="relative w-full overflow-hidden h-[75px]">
        {listing.imgUrls[index]}
        </div>
        ))}
      </div>
    </div>
  </main>
  )
}