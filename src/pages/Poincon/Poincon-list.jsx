import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Spinner,
  Text,
  HStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PoinconList = () => {
  const [poincons, setPoincons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/poincons", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPoincons(res.data);
      } catch (err) {
        toast({ title: "Erreur", status: "error", description: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce poinçon ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/poincons/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPoincons(poincons.filter((p) => p._id !== id));
      toast({ title: "Supprimé", status: "success" });
    } catch (err) {
      toast({ title: "Erreur", description: err.message, status: "error" });
    }
  };

  const filteredPoincons = poincons.filter((p) =>
    (`${p.codeFormat} ${p.forme} ${p.fournisseur?.designation || ""} ${p.marque?.designation || ""} ${p.etat} ${p.statut}`)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Box className="page-container" p={6} mt="100px">
      <Flex justify="space-between" mb={4} wrap="wrap" gap={2}>
        <Input
          placeholder="🔍 Rechercher un poinçon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="300px"
        />
        <HStack spacing={3}>
          <Link to="/forme/add">
            <Button colorScheme="purple">+ Ajouter une forme</Button>
          </Link>
          <Link to="/poincons/add">
            <Button colorScheme="teal">+ Ajouter un poinçon</Button>
          </Link>
        </HStack>
      </Flex>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Code Format</Th>
                  <Th>Forme</Th>
                  <Th>Fournisseur</Th>
                  <Th>Marque</Th>
                  <Th>État</Th>
                  <Th>Composants</Th>
                  <Th>Statut</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPoincons.map((p) => (
                  <Tr key={p._id}>
                    <Td>{p.codeFormat}</Td>
                    <Td>{p.forme || "—"}</Td>
                    <Td>{p.fournisseur?.designation || "—"}</Td>
                    <Td>{p.marque?.designation || "—"}</Td>
                    <Td>{p.etat || "—"}</Td>
                    <Td>{p.nbrComposants || 0}</Td>
                    <Td color={p.statut?.toLowerCase() === "actif" ? "green.500" : "red.500"}>
                      {p.statut || "—"}
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        <Button size="sm" onClick={() => navigate(`/poincons/detail/${p._id}`)}>Voir</Button>
                        <Button size="sm" colorScheme="teal" onClick={() => navigate(`/poincons/edit/${p._id}`)}>Modifier</Button>
                        <Button size="sm" colorScheme="red" onClick={() => handleDelete(p._id)}>Supprimer</Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {filteredPoincons.length === 0 && (
            <Text mt={4} textAlign="center">Aucun poinçon trouvé.</Text>
          )}
        </>
      )}
    </Box>
  );
};

export default PoinconList;
