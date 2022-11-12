import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";


export default function Listing() {
  
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
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
            {listing.nomeProjeto}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Descrição - </span>
            {listing.descricaoProjeto}
          </p>
          <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold">Plano de testes - </span>
                {listing.planoDeTestes ? "Sim" : "Não"}
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold">Especificação do projeto - </span>
                {listing.especDoProjetoDeTeste ? "Sim" : "Nao"}
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold">Especificação dos casos de testes - </span>
                {listing.especCasosDeTeste ? "Sim" : "Nao"}
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold">Especificação de procedimentos de testes - </span>
                {listing.especDeProcedimentoDeTeste ? "Sim" : "Nao"}
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold">Relatórios do status de testes - </span>
                {listing.relatoStatusDeTeste ? "Sim" : "Nao"}
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold">Logs de testes - </span>
                {listing.logDeTeste ? "Sim" : "Nao"}
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold">Relatórios incidentes de testes - </span>
                {listing.relatoIncidenteDeTestes ? "Sim" : "Nao"}
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold">Relatórios súmarios de testes - </span>
                {listing.relatoSumarioDeTestes ? "Sim" : "Nao"}  
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold"> Narrativas e cenários - </span>
                {listing.historiaCenarios  ? "Sim" : "Nao"}
            </li>
            <li className="flex items-center whitespace-nowrap">
                <span className="font-semibold"> Documentações- </span>
                {listing.documentacao  ? "Sim" : "Nao"}
            </li>      
        </div>
      </div>
    </main>
  );
}