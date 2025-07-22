import React, { useEffect, useState } from "react";
import "./users-detail.css"; // ton fichier CSS avec .user-detail-container, etc.

import { Box, Spinner, useToast, Text } from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const UsersDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: error.response?.data?.message || "Utilisateur non trouvé",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={6} textAlign="center">
        <Text color="red.500">Utilisateur introuvable</Text>
      </Box>
    );
  }

  return (
    <div className="user-detail-container">
      <div className="user-card">
        <h2>Détails de l'utilisateur</h2>
        <div className="user-info-row">
          <div className="user-info-label">Nom</div>
          <div className="user-info-value">{user.nom}</div>
        </div>
        <div className="user-info-row">
          <div className="user-info-label">Prénom</div>
          <div className="user-info-value">{user.prenom}</div>
        </div>
        <div className="user-info-row">
          <div className="user-info-label">Email</div>
          <div className="user-info-value">{user.email}</div>
        </div>
        <div className="user-info-row">
          <div className="user-info-label">Login</div>
          <div className="user-info-value">{user.login}</div>
        </div>
        <div className="user-info-row">
          <div className="user-info-label">Rôle</div>
          <div className="user-info-value">{user.role}</div>
        </div>
        <div className="user-info-row">
          <div className="user-info-label">Statut</div>
          <div className="user-info-value">{user.statut}</div>
        </div>
        <div className="back-button">
          <Link to="/users">
            <button className="btn btn-primary">← Retour à la liste</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UsersDetail;
