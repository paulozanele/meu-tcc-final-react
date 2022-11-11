import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import ListingItem from "../components/ListingItem";

import { db } from "../firebase";
export default function Home() {
  //Admin
  const [adminListings, setAdminListings] = useState(null)
  useEffect(()=>{
    async function fetchListings(){
      try {
        const listingsRef = collection(db, "listings")
        const q = query(listingsRef, where ("nivelDeAcesso", "==", "admin"))
        const querySnap = await getDocs(q);
        const listings = [];
          querySnap.forEach((doc)=>{
            return listings.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setAdminListings(listings)
          console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);


  return (
    <div>
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {adminListings && adminListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Administrador - Projeto</h2>
            <ul>
            {adminListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

  );
}
