import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import {
  getDocs,
  where,
  query,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";


export default function ListingTest() {
  const [listingsTest, setListingsTest] = useState(null);
  const [hasRelaStatusTestListing, setHasRelaStatusTestListing] = useState(false);
  const [hasLogTestListing, setHasLogTestListing] = useState(false);
  const [hasRelaInciTestListing, setHasRelaInciTestListing] = useState(false);
  const [hasRelaSumaTestListing, setHasRelaSumaTestListing] = useState(false);
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db,"listingsTest", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
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
  }, [params.listingId]);


  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-red lg:space-x-5 ">
        <div >
          <p className="text-2xl font-bold mb-3 text-blue-900">
          {listing.tituloDocTestes}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Descrição - </span>
           {listing.docTestes}
          </p>

          {hasRelaStatusTestListing && <div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Relatório status do teste - </span>
            {listing.relatoStatusDeTeste}
          </p>
          </div>}

          {hasLogTestListing && <div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Log do teste - </span>
            {listing.logDeTeste}
          </p>
          </div>}

          {hasRelaInciTestListing && <div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Relatório de incidente do teste - </span>
            {listing.relatoIncidenteDeTestes}
          </p>
          </div>}

          {hasRelaSumaTestListing && <div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Relatório sumário do teste - </span>
            {listing.relatoSumarioDeTestes}
          </p>
          </div>}

          <p className="mt-3 mb-3">
            <span className="font-semibold"> Responsável - </span>
            {listing.userEmail}
          </p>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Observações importantes - </span>
            {listing.obsDoc}
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
  );
}