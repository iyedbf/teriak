import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Stack,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import './compremeuses-create.css';

const CompremeuseCreate = () => {
  const [form, setForm] = useState({
    code: "",
    designation: "",
    statut: "actif",
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { pushNotification } = useNotification();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/compromeuses", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      pushNotification(
        "Compremeuse ajoutée",
        `La compremeuse "${form.designation}" a été ajoutée avec succès.`
      );

      toast({
        title: "Ajoutée avec succès",
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
      });
    }
  };

  return (
    <Box className="create-page-container">
      <Box className="create-form-box" maxW="500px" mx="auto">
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Ajouter une compremeuse
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

export default CompremeuseCreate;
