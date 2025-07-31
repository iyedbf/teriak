import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Select, useToast } from "@chakra-ui/react";

const ProduitAdd = () => {
  const [produit, setProduit] = useState({
    code: "",
    designation: "",
    statut: "actif",
    codeFormatParDefaut: "",
  });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [marques, setMarques] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resFournisseurs = await axios.get("http://localhost:5000/api/fournisseurs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const resMarques = await axios.get("http://localhost:5000/api/marques", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setFournisseurs(resFournisseurs.data);
        setMarques(resMarques.data);
      } catch (err) {
        toast({ title: "Erreur", status: "error", description: err.message });
      }
    };

    fetchData();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduit({ ...produit, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation avant envoi
    if (!produit.code || !produit.designation || !produit.codeFormatParDefaut) {
      toast({ title: "Erreur", status: "error", description: "Tous les champs sont obligatoires." });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/produits", produit, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast({ title: "Produit ajouté avec succès", status: "success" });
      navigate("/produits-list");
    } catch (err) {
      toast({ title: "Erreur", status: "error", description: err.response?.data?.message || err.message });
    }
  };

  return (
    <Box p={6}>
      <h2>Ajouter un produit</h2>
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
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
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
          Ajouter le produit
        </Button>
      </form>
    </Box>
  );
};

export default ProduitAdd;
