import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

const PoinconAdd = () => {
  const [poincon, setPoincon] = useState({
    codeFormat: "",
    forme: "",
    fournisseur: "",
    marque: "",
    nbrComposants: 0,
    ficheTechnique: "",
    statut: "actif",
    etat: "",
  });

  // Liste fixe des états
  const etatsDisponibles = ["En service", "En maintenance", "Hors service"];

  const [fournisseurs, setFournisseurs] = useState([]);
  const [formes, setFormes] = useState([]);
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const { pushNotification } = useNotification();

  const navigate = useNavigate();

  const getId = (objOrId) => {
    if (!objOrId) return "";
    return typeof objOrId === "string" ? objOrId : objOrId._id || "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErreur("Token manquant, veuillez vous connecter.");
          setLoading(false);
          return;
        }

        const [fournisseursRes, marquesRes, formesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/fournisseurs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/marques", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/formes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFournisseurs(fournisseursRes.data);
        setMarques(marquesRes.data);
        setFormes(formesRes.data);
      } catch (error) {
        console.error("Erreur API:", error);
        setErreur("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoincon((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token manquant, veuillez vous connecter.");
      return;
    }

    // Prépare les données à envoyer (avec uniquement les _id des objets)
    const dataToSend = {
      codeFormat: poincon.codeFormat,
      forme: poincon.forme,
      fournisseur: getId(poincon.fournisseur),
      marque: getId(poincon.marque),
      nbrComposants: poincon.nbrComposants,
      statut: poincon.statut,
      etat: poincon.etat,
    };

    // Crée un FormData et ajoute chaque champ un par un
    const formData = new FormData();
    for (const key in dataToSend) {
      formData.append(key, dataToSend[key]);
    }

    // Ajoute le fichier si présent
    if (poincon.ficheTechnique) {
      formData.append("ficheTechnique", poincon.ficheTechnique);
    }

    // Envoie la requête POST avec axios
    await axios.post("http://localhost:5000/api/poincons", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // axios peut le gérer automatiquement mais c'est OK de le préciser
      },
    });

    pushNotification("Succès", `Poinçon ajouté avec succès.`);
    navigate("/poincon-list");

  } catch (err) {
    console.error("Erreur lors de l'ajout :", err);
    alert(err.response?.data?.message || "Erreur serveur.");
  }
};


  if (loading) return <p>Chargement...</p>;
  if (erreur) return <p style={{ color: "red" }}>{erreur}</p>;

  return (
    <div className="poincon-container">
      <h2>Ajouter un Poinçon</h2>

      <form onSubmit={handleSubmit} className="edit-form-grid">
        <div className="form-group">
          <label>Code Format</label>
          <input
            type="text"
            name="codeFormat"
            value={poincon.codeFormat}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre de Composants</label>
          <input
            type="number"
            name="nbrComposants"
            value={poincon.nbrComposants}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Statut</label>
          <select
            name="statut"
            value={poincon.statut}
            onChange={handleChange}
            required
          >
            <option value="actif">Actif</option>
            <option value="endommagé">Endommagé</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        <div className="form-group">
          <label>Forme</label>
          <select
            name="forme"
            value={poincon.forme}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner une forme --</option>
            {formes.map((f) => (
              <option key={f._id} value={f.designation || f.code || f._id}>
                {f.designation || f.code}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fournisseur</label>
          <select
            name="fournisseur"
            value={getId(poincon.fournisseur)}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner un fournisseur --</option>
            {fournisseurs.map((f) => (
              <option key={f._id} value={f._id}>
                {f.designation}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Marque</label>
          <select
            name="marque"
            value={getId(poincon.marque)}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner une marque --</option>
            {marques.map((m) => (
              <option key={m._id} value={m._id}>
                {m.designation}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>État</label>
          <select
            name="etat"
            value={poincon.etat}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner un état --</option>
            {etatsDisponibles.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group full-width">
  <label>Fiche Technique (PDF ou autre)</label>
  <input
    type="file"
    accept=".pdf,.doc,.docx,.jpg,.png"
    name="ficheTechnique"
    onChange={(e) =>
      setPoincon((prev) => ({
        ...prev,
        ficheTechnique: e.target.files[0],
      }))
    }
  />
</div>


            
        <div className="form-group full-width">
          <button type="submit" className="actions-btn edit">
            💾 Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default PoinconAdd;
