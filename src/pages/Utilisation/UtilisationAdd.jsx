import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UtilisationAdd = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [produits, setProduits] = useState([]);
  const [poincons, setPoincons] = useState([]);
  const [composants, setComposants] = useState([]);
  const [loadingProduits, setLoadingProduits] = useState(true);
  const [loadingPoincons, setLoadingPoincons] = useState(true);

  // Charger produits
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/produits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduits(res.data);
      } catch (error) {
        console.error("Erreur produits:", error);
      } finally {
        setLoadingProduits(false);
      }
    };
    fetchProduits();
  }, [token]);

  // Charger poinçons
  useEffect(() => {
    const fetchPoincons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/poincons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPoincons(res.data);
      } catch (error) {
        console.error("Erreur poinçons:", error);
      } finally {
        setLoadingPoincons(false);
      }
    };
    fetchPoincons();
  }, [token]);

  // Quand un poinçon est choisi → récupérer composants depuis "detailPoincon"
  const handlePoinconChange = async (e) => {
    formik.handleChange(e);
    const poinconId = e.target.value;

    if (!poinconId) {
      setComposants([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/detailPoincon/${poinconId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComposants(res.data|| []);
    } catch (error) {
      console.error("Erreur chargement composants:", error);
      setComposants([]);
    }
  };

  // Formulaire
  const formik = useFormik({
    initialValues: {
      produit: "",
      poincon: "",
      composant: "",
      nbr_lots: 0,
      num_lots: "",
      nbr_coup_par_poincon: 0,
      etat_livraison: "",
      etat_retour: "",
      commentaire: "",
    },
    validationSchema: Yup.object({
      produit: Yup.string().required("Veuillez sélectionner un produit"),
      poincon: Yup.string().required("Veuillez sélectionner un poinçon"),
      composant: Yup.string().required("Veuillez sélectionner un composant"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post("http://localhost:5000/api/utilisations", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Utilisation ajoutée avec succès !");
        resetForm();
        navigate("/utilisation-list");
      } catch (error) {
        alert("❌ Erreur lors de l'ajout");
        console.error(error);
      }
    },
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ajouter une Utilisation</h2>
      <form onSubmit={formik.handleSubmit} style={styles.form}>

        {/* Produit */}
        <div style={styles.field}>
          <label>Produit</label>
          {loadingProduits ? (
            <p>Chargement...</p>
          ) : (
            <select
              name="produit"
              onChange={formik.handleChange}
              value={formik.values.produit}
              style={styles.input}
            >
              <option value="">-- Sélectionnez un produit --</option>
              {produits.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.designation}
                </option>
              ))}
            </select>
          )}
          {formik.errors.produit && formik.touched.produit && (
            <div style={styles.error}>{formik.errors.produit}</div>
          )}
        </div>

        {/* Poinçon */}
        <div style={styles.field}>
          <label>Poinçon</label>
          {loadingPoincons ? (
            <p>Chargement...</p>
          ) : (
            <select
              name="poincon"
              onChange={handlePoinconChange}
              value={formik.values.poincon}
              style={styles.input}
            >
              <option value="">-- Sélectionnez un poinçon --</option>
              {poincons.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.codeFormat}
                </option>
              ))}
            </select>
          )}
          {formik.errors.poincon && formik.touched.poincon && (
            <div style={styles.error}>{formik.errors.poincon}</div>
          )}
        </div>

        {/* Composants */}
        {composants.length > 0 && (
          <div style={styles.field}>
            <label>Composant</label>
            <select
              name="composant"
              onChange={formik.handleChange}
              value={formik.values.composant}
              style={styles.input}
            >
              <option value="">-- Sélectionnez un composant --</option>
              {composants.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.reference}
                </option>
              ))}
            </select>
            {formik.errors.composant && formik.touched.composant && (
              <div style={styles.error}>{formik.errors.composant}</div>
            )}
          </div>
        )}

        {renderInput("Nombre de lots", "nbr_lots", "number")}
        {renderInput("Numéros de lots", "num_lots")}
        {renderInput("Nb Coup / Poinçon", "nbr_coup_par_poincon", "number")}
        {renderInput("État Livraison", "etat_livraison")}
        {renderInput("État Retour", "etat_retour")}

        <div style={styles.field}>
          <label>Commentaire</label>
          <textarea
            name="commentaire"
            onChange={formik.handleChange}
            value={formik.values.commentaire}
            style={styles.textarea}
          />
        </div>

        <button type="submit" style={styles.button}>
          Ajouter
        </button>
      </form>
    </div>
  );

  function renderInput(label, name, type = "text") {
    return (
      <div style={styles.field}>
        <label>{label}</label>
        <input
          name={name}
          type={type}
          onChange={formik.handleChange}
          value={formik.values[name]}
          style={styles.input}
        />
        {formik.errors[name] && formik.touched[name] && (
          <div style={styles.error}>{formik.errors[name]}</div>
        )}
      </div>
    );
  }
};

const styles = {
  container: { maxWidth: "600px", margin: "2rem auto", padding: "1.5rem", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" },
  title: { textAlign: "center", marginBottom: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column" },
  input: { padding: "8px", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" },
  textarea: { padding: "8px", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" },
  button: { padding: "10px 16px", fontSize: "1rem", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  error: { color: "red", fontSize: "0.875rem" },
};

export default UtilisationAdd;
