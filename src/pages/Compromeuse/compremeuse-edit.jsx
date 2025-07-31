import React, { useEffect, useState } from "react";
import "./compremeuses-edit.css";

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

const CompremeuseEdit = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    code: "",
    designation: "",
    statut: "actif"
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompremeuse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/compromeuses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setForm(res.data);
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Compremeuse introuvable",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCompremeuse();
  }, [id, toast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/compromeuses/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast({
        title: "Compremeuse mise à jour",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/compremeuses");
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
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Modifier la compremeuse</Text>
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

export default CompremeuseEdit;
