import React, { useEffect, useState } from "react";
import { Box, Text, Spinner, Stack, Button } from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./fournisseurs-detail.css";


const FournisseursDetail = () => {
  const { id } = useParams();
  const [fournisseur, setFournisseur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/fournisseurs/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setFournisseur(res.data))
      .catch(() => setFournisseur(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
  return <Box textAlign="center" mt={10}><Spinner /></Box>;
}

if (!fournisseur) {
  return <Box p={6}><Text>Fournisseur introuvable.</Text></Box>;
}

return (
  <Box className="fournisseur-detail-wrapper">
    <Box className="fournisseur-detail-card">
      <Stack spacing={3}>
        <Text fontSize="2xl" fontWeight="bold">Détails du fournisseur</Text>
        <Text><strong>Code :</strong> {fournisseur.code}</Text>
        <Text><strong>Désignation :</strong> {fournisseur.designation}</Text>
        <Text><strong>Pays :</strong> {fournisseur.pays}</Text>
        <Text><strong>Statut :</strong> {fournisseur.statut}</Text>

        <Box mt={4}>
          <Link to="/fournisseurs">
            <Button colorScheme="teal">← Retour à la liste</Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  </Box>
);

};

export default FournisseursDetail;
