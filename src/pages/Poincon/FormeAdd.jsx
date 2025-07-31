import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";

const FormeAdd = () => {
  const [forme, setForme] = useState({
    code: "",
    designation: "",
    statut: "actif",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { pushNotification } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForme((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token manquant, veuillez vous connecter.");
        setLoading(false);
        return;
      }

      await axios.post(
        "http://localhost:5000/api/formes",
        forme,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      pushNotification("Succès", `Forme ${forme.designation} ajoutée avec succès.`);
      navigate("/poincon-list"); // Redirection vers la liste des poinçons
    } catch (err) {
      setError(err.response?.data?.message || "Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="480px" mx="auto" mt="8" p="6" boxShadow="md" borderRadius="md" bg="white">
      <Heading mb="6" size="lg" textAlign="center">
        Ajouter une Forme
      </Heading>

      {error && (
        <Alert status="error" mb="6" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing="4" align="stretch">
          <FormControl isRequired>
            <FormLabel>Code</FormLabel>
            <Input
              name="code"
              value={forme.code}
              onChange={handleChange}
              placeholder="Code unique"
              autoFocus
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Désignation</FormLabel>
            <Input
              name="designation"
              value={forme.designation}
              onChange={handleChange}
              placeholder="Nom de la forme"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Statut</FormLabel>
            <Select name="statut" value={forme.statut} onChange={handleChange}>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </Select>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size="md"
            isLoading={loading}
            loadingText="Envoi..."
            mt="4"
          >
            Ajouter
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default FormeAdd;
