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
import ListingItemDev from "../components/ListingItemDev";
import ListingItemDoc from "../components/ListingItemDoc";
import ListingItemTest from "../components/ListingItemTest";

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

  //Documentador
  const [documListings, setDocumListings] = useState(null)
  useEffect(()=>{
    async function fetchListings(){
      try {
        const listingsRef1 = collection(db, "listingsDoc")
        const q1 = query(listingsRef1, where ("nivelDeAcesso", "==", "documentador"))
        const querySnap = await getDocs(q1);
        const listingsDoc = [];
          querySnap.forEach((doc)=>{
            return listingsDoc.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setDocumListings(listingsDoc)
          console.log(listingsDoc);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

    //Testador
    const [testListings, setTestListings] = useState(null)
    useEffect(()=>{
      async function fetchListings(){
        try {
          const listingsRef2 = collection(db, "listingsTest")
          const q2 = query(listingsRef2, where ("nivelDeAcesso", "==", "testador"))
          const querySnap = await getDocs(q2);
          const listingsTest = [];
            querySnap.forEach((doc)=>{
              return listingsTest.push({
                id: doc.id,
                data: doc.data(),
              });
            });
            setTestListings(listingsTest)
            console.log(listingsTest);
        } catch (error) {
          console.log(error);
        }
      }
      fetchListings();
    }, []);


      //Admin
  const [devListings, setDevListings] = useState(null)
  useEffect(()=>{
    async function fetchListings(){
      try {
        const listingsRef3 = collection(db, "listingsDev")
        const q = query(listingsRef3, where ("nivelDeAcesso", "==", "desenvolvedor"))
        const querySnap = await getDocs(q);
        const listingsDev = [];
          querySnap.forEach((doc)=>{
            return listingsDev.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setDevListings(listingsDev)
          console.log(listingsDev);
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
            <h2 className="px-3 text-2xl mt-6 font-semibold">Projeto - Administrador</h2>
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
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {documListings && documListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Documentos - Documentadores</h2>
            <ul className="sm:grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
            {documListings.map((listingDoc) => (
                <ListingItemDoc
                  key={listingDoc.id}
                  id={listingDoc.id}
                  listing={listingDoc.data}
                />
              ))}
            </ul>
          </div>
          
        )}
      </div>
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {testListings && testListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Dados dos testes - Testadores</h2>
            <ul className="sm:grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
            {testListings.map((listingTest) => (
                <ListingItemTest
                  key={listingTest.id}
                  id={listingTest.id}
                  listing={listingTest.data}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {devListings && devListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Narrativas - Desenvolvedores</h2>
            <ul className="sm:grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
            {devListings.map((listingDev) => (
                <ListingItemDev
                  key={listingDev.id}
                  id={listingDev.id}
                  listing={listingDev.data}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

  );
}
