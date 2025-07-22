import React, { useState } from "react";
import "./fournisseurs-create.css";
import {
  Box, Button, Input, Select, Stack, useToast, Heading
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactSelect from "react-select";
import countries from "../../data/countries"; // Chemin relatif correct si tu es dans pages/Fournisseurs

const FournisseursCreate = () => {
  const [form, setForm] = useState({
    code: "",
    designation: "",
    pays: "",
    statut: "actif"
  });

  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountryChange = selected => {
    setForm({ ...form, pays: selected.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/fournisseurs", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast({
        title: "Ajouté avec succès",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      navigate("/fournisseurs");
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Erreur inconnue",
        status: "error"
      });
    }
  };

  return (
    <Box className="create-page-container">
      <Box className="create-form-box" maxW="500px" mx="auto">
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Ajouter un fournisseur
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Input
              placeholder="Code"
              name="code"
              value={form.code}
              onChange={handleChange}
              isRequired
            />
            <Input
              placeholder="Désignation"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              isRequired
            />
            {/* Sélecteur de pays avec autocomplétion */}
            <ReactSelect
              options={countries}
              onChange={handleCountryChange}
              placeholder="Sélectionner un pays"
              isSearchable
            />
            <Select
              name="statut"
              value={form.statut}
              onChange={handleChange}
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </Select>
            <Button colorScheme="teal" type="submit">
              Créer
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default FournisseursCreate;
