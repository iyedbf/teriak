import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./UtilisationList.css";

const UtilisationList = () => {
  const [utilisations, setUtilisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pour la modification
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUtil, setCurrentUtil] = useState(null);

  useEffect(() => {
    fetchUtilisations();
  }, []);

  const fetchUtilisations = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/api/utilisations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUtilisations(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors du chargement des utilisations.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (numeroUtilisation) => {
    if (!window.confirm("Supprimer cette utilisation ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/utilisations/${numeroUtilisation}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUtilisations(utilisations.filter((u) => u.numeroUtilisation !== numeroUtilisation));
      alert("Utilisation supprimée");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const openEditModal = (util) => {
    setCurrentUtil(util);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentUtil(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUtil((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/utilisations/${currentUtil.numeroUtilisation}`, currentUtil, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUtilisations((prev) =>
        prev.map((u) => (u._id === currentUtil._id ? currentUtil : u))
      );
      alert("Utilisation modifiée avec succès");
      closeModal();
    } catch (err) {
      alert("Erreur lors de la modification : " + err.message);
    }
  };

  // Export PDF global avec jsPDF et jspdf-autotable
  const exportPDF = () => {
    if (utilisations.length === 0) {
      alert("Aucune donnée à exporter");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Suivi des Utilisations des Poinçons", 14, 22);

    const headers = [
      "Référence",
      "Date",
      "Produit",
      "Utilisateurs",
      "Nb Lots",
      "Num Lots",
      "Nb Coup / Poinçon",
      "État Livraison",
      "État Retour",
      "Commentaire",
    ];

    const data = utilisations.map((util) => [
      util.numeroUtilisation || util.reference || "",
      util.date_utilisation
        ? new Date(util.date_utilisation).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "",
      util.produit && typeof util.produit === "object"
        ? util.produit.designation || util.produit.nom || ""
        : util.produit || "",
      Array.isArray(util.utilisateurs)
        ? util.utilisateurs
            .map((u) =>
              typeof u === "object" ? u.nom || u.login || "Utilisateur" : u
            )
            .join(", ")
        : util.utilisateurs || "",
      util.nbr_lots ?? "",
      util.num_lots || "",
      util.nbr_coup_par_poincon ?? "",
      util.etat_livraison || "",
      util.etat_retour || "",
      util.commentaire || "",
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 30 },
      theme: "striped",
    });

    doc.save("utilisations.pdf");
  };

  if (loading) return <p className="loading">Chargement des utilisations...</p>;
  if (error) return <p className="error">{error}</p>;
  if (utilisations.length === 0) return <p className="no-data">Aucune utilisation trouvée.</p>;

  return (
    <div className="utilisation-table-container">
      <h2>Suivi des Utilisations des Poinçons</h2>

      {/* Bouton export global */}
      <div style={{ width: "100%", marginBottom: "1rem", textAlign: "left" }}>

      <button
  onClick={exportPDF}
  className="btn-export-global"
  disabled={utilisations.length === 0}
  title="Exporter toute la table en PDF"
>
  Exporter PDF
</button>
</div>

      <div className="utilisation-table-wrapper">
        <table className="utilisation-table" aria-label="Liste des utilisations">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Date</th>
              <th>Produit</th>
              <th>Utilisateurs</th>
              <th>Nb Lots</th>
              <th>Num Lots</th>
              <th>Nb Coup / Poinçon</th>
              <th>État Livraison</th>
              <th>État Retour</th>
              <th>Commentaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisations.map((util) => (
              <tr key={util._id}>
                <td>{util.numeroUtilisation || util.reference || "-"}</td>
                <td>
                  {util.date_utilisation
                    ? new Date(util.date_utilisation).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Date inconnue"}
                </td>
                <td>
                  {util.produit && typeof util.produit === "object"
                    ? util.produit.designation || util.produit.nom || "-"
                    : util.produit || "-"}
                </td>
                <td>
                  {Array.isArray(util.utilisateurs)
                    ? util.utilisateurs
                        .map((u) =>
                          typeof u === "object" ? u.nom || u.login || "Utilisateur" : u
                        )
                        .join(", ")
                    : util.utilisateurs || "-"}
                </td>
                <td>{util.nbr_lots ?? 0}</td>
                <td>{util.num_lots || "-"}</td>
                <td>{util.nbr_coup_par_poincon ?? 0}</td>
                <td>{util.etat_livraison || "-"}</td>
                <td>{util.etat_retour || "-"}</td>
                <td>{util.commentaire || "-"}</td>
                <td className="actions-cell">
                  <button
                    className="btn btn-edit"
                    onClick={() => openEditModal(util)}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(util.numeroUtilisation)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                  {/* Suppression du bouton export par ligne */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content"style={{ backgroundColor: "white" }}>
            <h3>Modifier Utilisation</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="edit-form"
            >
              <div className="form-group">
                <label htmlFor="commentaire">Commentaire</label>
                <input
                  id="commentaire"
                  type="text"
                  name="commentaire"
                  value={currentUtil.commentaire || ""}
                  onChange={handleChange}
                  placeholder="Ajouter un commentaire"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nbr_lots">Nombre de Lots</label>
                <input
                  id="nbr_lots"
                  type="number"
                  name="nbr_lots"
                  value={currentUtil.nbr_lots ?? 0}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              <div className="form-group">
                <label htmlFor="etat_livraison">État Livraison</label>
                <input
                  id="etat_livraison"
                  type="text"
                  name="etat_livraison"
                  value={currentUtil.etat_livraison || ""}
                  onChange={handleChange}
                  placeholder="Ex: Livré / En attente"
                />
              </div>

              <div className="form-group">
                <label htmlFor="etat_retour">État Retour</label>
                <input
                  id="etat_retour"
                  type="text"
                  name="etat_retour"
                  value={currentUtil.etat_retour || ""}
                  onChange={handleChange}
                  placeholder="Ex: Retour OK / Non retourné"
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-save">
                   Sauvegarder
                </button>
                <button type="button" className="btn btn-cancel" onClick={closeModal}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilisationList;
