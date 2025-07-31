import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  Stack,
  Button,
  Link as ChakraLink
} from "@chakra-ui/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./PoinconDetail.css"; // tu peux la supprimer si tu veux tout passer en Chakra

const DetailPoincon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poincon, setPoincon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const fetchPoincon = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErreur("Token introuvable. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/poincons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setPoincon(res.data);
      } catch (err) {
        console.error("Erreur API :", err);
        setErreur(err.response?.data?.message || "Erreur de chargement du poinçon.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoincon();
  }, [id]);

  if (loading) {
    return <Box textAlign="center" mt={10}><Spinner /></Box>;
  }

  if (erreur) {
    return <Box p={6}><Text color="red.500">{erreur}</Text></Box>;
  }

  if (!poincon) {
    return <Box p={6}><Text>Aucun poinçon trouvé.</Text></Box>;
  }

  return (
    <Box className="poincon-detail-wrapper">
      <Box className="poincon-detail-card" borderWidth="1px" borderRadius="lg" p={6} maxW="600px" mx="auto">
        <Stack spacing={3}>
          <Text fontSize="2xl" fontWeight="bold">Détail du Poinçon</Text>
          <Text><strong>Code Format :</strong> {poincon.codeFormat}</Text>
          <Text><strong>Forme :</strong> {poincon.forme?.designation || "—"}</Text>
          <Text><strong>Fournisseur :</strong> {poincon.fournisseur?.designation || "—"}</Text>
          <Text><strong>Marque :</strong> {poincon.marque?.designation || "—"}</Text>
          <Text><strong>État :</strong> {poincon.etat?.designation || "—"}</Text>
          <Text><strong>Nombre de Composants :</strong> {poincon.nbrComposants}</Text>
          <Text>
            <strong>Statut :</strong>{" "}
            <Text as="span" color={poincon.statut?.toLowerCase() === "actif" ? "green.500" : "red.500"}>
              {poincon.statut}
            </Text>
          </Text>
          <Text>
            <strong>Fiche Technique :</strong>{" "}
            {poincon.ficheTechnique ? (
              <ChakraLink
                href={poincon.ficheTechnique}
                isExternal
                color="blue.500"
                textDecoration="underline"
              >
                Voir la fiche
              </ChakraLink>
            ) : (
              "—"
            )}
          </Text>

          <Box mt={4}>
            <Button colorScheme="teal" onClick={() => navigate(-1)}>
              ← Retour
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default DetailPoincon;
