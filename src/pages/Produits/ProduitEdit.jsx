import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Input, Select, useToast, Spinner } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

const ProduitEdit = () => {
  const { id } = useParams(); // Récupère l'ID du produit à éditer
  const [produit, setProduit] = useState({
    code: "",
    designation: "",
    statut: "actif",
    codeFormatParDefaut: "",
  });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Liste des statuts disponibles
  const statutsDisponibles = ["actif", "inactif", "endommagé"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le produit par ID
        const produitRes = await axios.get(`http://localhost:5000/api/produits/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProduit(produitRes.data);

        // Récupérer les fournisseurs et marques
        const [fournisseursRes, marquesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/fournisseurs", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get("http://localhost:5000/api/marques", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        setFournisseurs(fournisseursRes.data);
        setMarques(marquesRes.data);
      } catch (err) {
        toast({ title: "Erreur", status: "error", description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduit({ ...produit, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoi de la requête PUT pour mettre à jour le produit
      await axios.put(`http://localhost:5000/api/produits/${id}`, produit, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Affichage du message de succès
      toast({ title: "Produit mis à jour avec succès", status: "success" });

      // Redirection vers la page de la liste des produits après la mise à jour
      navigate("/produits-list");
    } catch (err) {
      // Gestion des erreurs en cas de problème lors de la mise à jour
      toast({ title: "Erreur", status: "error", description: err.message });
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6}>
      <h2>Modifier le produit</h2>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Code"
          value={produit.code}
          name="code"
          onChange={handleChange}
          required
          mb={4}
        />
        <Input
          placeholder="Désignation"
          value={produit.designation}
          name="designation"
          onChange={handleChange}
          required
          mb={4}
        />
        <Select
          value={produit.statut}
          name="statut"
          onChange={handleChange}
          mb={4}
        >
          {statutsDisponibles.map((statut) => (
            <option key={statut} value={statut}>
              {statut}
            </option>
          ))}
        </Select>
        <Select
          name="codeFormatParDefaut"
          value={produit.codeFormatParDefaut}
          onChange={handleChange}
          mb={4}
        >
          <option value="">Sélectionner un poinçon par défaut</option>
          {fournisseurs.map((fournisseur) => (
            <option key={fournisseur._id} value={fournisseur._id}>
              {fournisseur.designation}
            </option>
          ))}
        </Select>
        <Button colorScheme="teal" type="submit">
          Mettre à jour le produit
        </Button>
      </form>
    </Box>
  );
};

export default ProduitEdit;
