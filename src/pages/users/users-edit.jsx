import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Select,
  Stack,
  Text,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './user-edit.css'; // En haut du fichier

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    login: '',
    motDePasse: '',
    email: '',
    role: 'Agent',
    statut: 'actif',
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setFormData(res.data);
      } catch (err) {
        toast({
          title: 'Erreur',
          description: 'Utilisateur introuvable',
          status: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, toast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast({
        title: "Utilisateur mis à jour",
        status: "success",
      });
      navigate('/users');
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Erreur lors de la mise à jour",
        status: "error",
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
    <Box p={6} maxW="500px" mx="auto" bg="white" boxShadow="md" borderRadius="lg">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Modifier l’utilisateur</Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Input placeholder="Nom" name="nom" value={formData.nom} onChange={handleChange} isRequired />
          <Input placeholder="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} isRequired />
          <Input placeholder="Login" name="login" value={formData.login} onChange={handleChange} isRequired />
          <Input placeholder="Mot de passe (laisser vide si inchangé)" name="motDePasse" type="password" value={formData.motDePasse || ""} onChange={handleChange} />
          <Input placeholder="Email" name="email" value={formData.email} onChange={handleChange} isRequired />

          <Select name="role" value={formData.role} onChange={handleChange}>
            <option>Administrateur</option>
            <option>Superviseur</option>
            <option>Agent</option>
          </Select>

          <Select name="statut" value={formData.statut} onChange={handleChange}>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </Select>

          <Button colorScheme="teal" type="submit" isLoading={updating} loadingText="Mise à jour...">
            Mettre à jour
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default UserEdit;
