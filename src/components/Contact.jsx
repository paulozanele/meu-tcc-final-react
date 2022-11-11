import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    }
    getLandlord();
  }, [userRef]);
  return (
    <>
    <div>
      Contact {landlord.name} for the {listing.name.toLowerCase()}
    </div>
    </>
  );
}