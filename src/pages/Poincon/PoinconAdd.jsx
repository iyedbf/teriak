import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const [formes, setFormes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [marques, setMarques] = useState([]);
  const [etats, setEtats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

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

        const [formesRes, fournisseursRes, marquesRes, etatsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/formes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/fournisseurs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/marques", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/etatpoincons", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFormes(formesRes.data);
        setFournisseurs(fournisseursRes.data);
        setMarques(marquesRes.data);
        setEtats(etatsRes.data);
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

      const dataToSend = {
        ...poincon,
        forme: getId(poincon.forme),
        fournisseur: getId(poincon.fournisseur),
        marque: getId(poincon.marque),
        etat: getId(poincon.etat),
      };

      await axios.post("http://localhost:5000/api/poincons", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Poinçon ajouté avec succès !");
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
          <select name="statut" value={poincon.statut} onChange={handleChange} required>
            <option value="actif">Actif</option>
            <option value="endommagé">Endommagé</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        <div className="form-group">
          <label>Forme</label>
          <select name="forme" value={getId(poincon.forme)} onChange={handleChange} required>
            <option value="">-- Sélectionner une forme --</option>
            {formes.map((f) => (
              <option key={f._id} value={f._id}>
                {f.designation}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fournisseur</label>
          <select name="fournisseur" value={getId(poincon.fournisseur)} onChange={handleChange} required>
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
          <select name="marque" value={getId(poincon.marque)} onChange={handleChange} required>
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
          <select name="etat" value={getId(poincon.etat)} onChange={handleChange} required>
            <option value="">-- Sélectionner un état --</option>
            {etats.map((e) => (
              <option key={e._id} value={e._id}>
                {e.designation}
              </option>
            ))}
          </select>
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
