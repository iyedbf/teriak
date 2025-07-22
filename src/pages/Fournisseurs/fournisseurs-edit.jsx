import React, { useEffect, useState } from "react";
import "./fournisseurs-edit.css";

import {
  Box,
  Button,
  Input,
  Select,
  Stack,
  Spinner,
  useToast,
  Text
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FournisseursEdit = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    code: "",
    designation: "",
    pays: "",
    statut: "actif"
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/fournisseurs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setForm(res.data);
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Fournisseur introuvable",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFournisseur();
  }, [id, toast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/fournisseurs/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast({
        title: "Fournisseur mis à jour",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/fournisseurs");
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
  <Box className="edit-form-wrapper">
    <Box className="edit-form-container">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Modifier le fournisseur</Text>
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
          <Input
            placeholder="Pays"
            name="pays"
            value={form.pays}
            onChange={handleChange}
            isRequired
          />
          <Select name="statut" value={form.statut} onChange={handleChange}>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </Select>
          <Button
            colorScheme="teal"
            type="submit"
            isLoading={updating}
            loadingText="Mise à jour..."
          >
            Mettre à jour
          </Button>
        </Stack>
      </form>
    </Box>
  </Box>
);
};

export default FournisseursEdit;
