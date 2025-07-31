import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UtilisationAdd = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [produits, setProduits] = useState([]);
  const [loadingProduits, setLoadingProduits] = useState(true);
  const [errorProduits, setErrorProduits] = useState(null);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/produits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduits(res.data);
      } catch (error) {
        setErrorProduits("Erreur lors du chargement des produits");
      } finally {
        setLoadingProduits(false);
      }
    };

    fetchProduits();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      reference: "",
      produit: "",
      codeFormat: "",
      nbr_lots: 0,
      num_lots: "",
      nbr_coup_par_poincon: 0,
      etat_livraison: "",
      etat_retour: "",
      commentaire: "",
    },
    validationSchema: Yup.object({
      reference: Yup.string().required("Champ requis"),
      produit: Yup.string().required("Veuillez sélectionner un produit"),
      codeFormat: Yup.string().required("Champ requis"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/utilisations",
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("✅ Utilisation ajoutée avec succès !");
        resetForm();
        navigate("/utilisation-list");
      } catch (error) {
        if (error.response) {
          alert("❌ Erreur: " + error.response.data.message);
          console.error("Erreur serveur:", error.response.data);
        } else {
          alert("❌ Erreur réseau ou inconnue");
          console.error("Erreur:", error.message);
        }
      }
    },
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ajouter une Utilisation</h2>
      <form onSubmit={formik.handleSubmit} style={styles.form}>
        {renderInput("Référence", "reference")}

        {/* Select produit */}
        <div style={styles.field}>
          <label htmlFor="produit">Produit</label>
          {loadingProduits ? (
            <p>Chargement des produits...</p>
          ) : errorProduits ? (
            <p style={{ color: "red" }}>{errorProduits}</p>
          ) : (
            <select
              id="produit"
              name="produit"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.produit || ""}
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

        {renderInput("Code Format", "codeFormat")}
        {renderInput("Nombre de lots", "nbr_lots", "number")}
        {renderInput("Numéros de lots", "num_lots")}
        {renderInput("Nb Coup / Poinçon", "nbr_coup_par_poincon", "number")}
        {renderInput("État Livraison", "etat_livraison")}
        {renderInput("État Retour", "etat_retour")}

        <div style={styles.field}>
          <label htmlFor="commentaire">Commentaire</label>
          <textarea
            id="commentaire"
            name="commentaire"
            rows="3"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.commentaire || ""}
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
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type={type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name] ?? ""}
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
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1.5rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "8px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "8px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    padding: "10px 16px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  error: {
    color: "red",
    fontSize: "0.875rem",
  },
};

export default UtilisationAdd;
