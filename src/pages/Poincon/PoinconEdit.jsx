import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./edit.css";

const PoinconEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poincon, setPoincon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  const [fournisseurs, setFournisseurs] = useState([]);
  const [marques, setMarques] = useState([]);
  const [etats, setEtats] = useState([]);
  const [formes, setFormes] = useState([]); // ✅ ajout du state pour les formes

  const getId = (objOrId) => {
    if (!objOrId) return "";
    return typeof objOrId === "string" ? objOrId : objOrId._id || "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [poinconRes, fournisseursRes, marquesRes, etatsRes, formesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/poincons/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/fournisseurs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/marques`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/etatpoincons`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/formes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPoincon(poinconRes.data);
        setFournisseurs(fournisseursRes.data);
        setMarques(marquesRes.data);
        setEtats(etatsRes.data);
        setFormes(formesRes.data); // ✅ set formes
      } catch (err) {
        console.error("Erreur API :", err);
        setErreur("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoincon((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const dataToSend = {
        ...poincon,
        forme: getId(poincon.forme), // ✅ envoyer la forme
        fournisseur: getId(poincon.fournisseur),
        marque: getId(poincon.marque),
        etat: getId(poincon.etat),
      };

      await axios.put(`http://localhost:5000/api/poincons/${id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Poinçon mis à jour avec succès !");
      navigate("/poincon-list");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("Échec de la mise à jour.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (erreur) return <p style={{ color: "red" }}>{erreur}</p>;
  if (!poincon) return <p>Poinçon non trouvé.</p>;

  return (
    <div className="poincon-container">
      <h2>Modifier le Poinçon</h2>

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
          </select>
        </div>

        {/* ✅ === Forme === */}
        <div className="form-group">
          <label>Forme</label>
          <select
            name="forme"
            value={getId(poincon.forme)}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner une forme --</option>
            {formes.map((f) => (
              <option key={f._id} value={f._id}>
                {f.designation}
              </option>
            ))}
          </select>
        </div>

        {/* === Fournisseur === */}
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

        {/* === Marque === */}
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

        {/* === État === */}
        <div className="form-group">
          <label>État</label>
          <select
            name="etat"
            value={getId(poincon.etat)}
            onChange={handleChange}
            required
          >
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
            💾 Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default PoinconEdit;
