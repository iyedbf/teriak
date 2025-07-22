import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PoinconDetail.css";

const DetailPoincon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poincon, setPoincon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const fetchPoincon = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErreur("Token introuvable. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/poincons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setPoincon(res.data);
      } catch (err) {
        console.error("Erreur API :", err);
        setErreur(err.response?.data?.message || "Erreur de chargement du poinçon.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoincon();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Chargement en cours...</p>;
  if (erreur) return <p style={{ color: "red", textAlign: "center" }}>{erreur}</p>;
  if (!poincon) return <p style={{ textAlign: "center" }}>Aucun poinçon trouvé.</p>;

  return (
    <div className="poincon-container">
      <h2>Détail du Poinçon</h2>

      <button onClick={() => navigate(-1)} className="back-btn">
        ← Retour
      </button>

      <table className="detail-table">
        <tbody>
          <tr>
            <th>Code Format :</th>
            <td>{poincon.codeFormat}</td>
          </tr>
          <tr>
            <th>Forme :</th>
            <td>{poincon.forme?.designation || "—"}</td>
          </tr>
          <tr>
            <th>Fournisseur :</th>
            <td>{poincon.fournisseur?.designation || "—"}</td>
          </tr>
          <tr>
            <th>Marque :</th>
            <td>{poincon.marque?.designation || "—"}</td>
          </tr>
          <tr>
            <th>État :</th>
            <td>{poincon.etat?.designation || "—"}</td>
          </tr>
          <tr>
            <th>Nombre de Composants :</th>
            <td>{poincon.nbrComposants}</td>
          </tr>
          <tr>
            <th>Statut :</th>
            <td className={poincon.statut?.toLowerCase() === "actif" ? "status-actif" : "status-endommage"}>
              {poincon.statut}
            </td>
          </tr>
          <tr>
            <th>Fiche Technique :</th>
            <td>
              {poincon.ficheTechnique ? (
                <a href={poincon.ficheTechnique} target="_blank" rel="noopener noreferrer">
                  Voir la fiche
                </a>
              ) : (
                "—"
              )}
            </td>
          </tr>
          {/* Ajoutez d'autres champs si nécessaire */}
        </tbody>
      </table>
    </div>
  );
};

export default DetailPoincon;
