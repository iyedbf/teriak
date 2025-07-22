import React, { useEffect, useState } from "react";
import "./fournisseurs-list.css";
import {
  Box, Button, Flex, Input, Table, Tbody, Td, Th, Thead, Tr, useToast, Spinner
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios from "axios";

const FournisseursList = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/fournisseurs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setFournisseurs(res.data);
      } catch (err) {
        toast({ title: "Erreur", status: "error", description: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce fournisseur ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/fournisseurs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setFournisseurs(fournisseurs.filter(f => f._id !== id));
      toast({ title: "Supprimé", status: "success" });
    } catch (err) {
      toast({ title: "Erreur", description: err.message, status: "error" });
    }
  };

  // 🔍 Filtrage dynamique
  const filteredFournisseurs = fournisseurs.filter(f =>
    (`${f.code} ${f.designation} ${f.pays}`).toLowerCase().includes(search.toLowerCase())
  );

  return (
<Box className="page-container" p={6} mt="100px">
      <Flex justify="space-between" mb={4}>
        <Input
          placeholder="🔍 Rechercher un fournisseur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="300px"
        />
      </Flex>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Box className="fournisseurs-table">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Code</Th>
                  <Th>Désignation</Th>
                  <Th>Pays</Th>
                  <Th>Statut</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFournisseurs.map((f) => (
                  <Tr key={f._id}>
                    <Td>{f.code}</Td>
                    <Td>{f.designation}</Td>
                    <Td>{f.pays}</Td>
                    <Td>{f.statut}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Link to={`/fournisseurs/${f._id}`}>
                          <Button size="sm">Voir</Button>
                        </Link>
                        <Link to={`/fournisseurs/edit/${f._id}`}>
                          <Button size="sm" colorScheme="teal">Modifier</Button>
                        </Link>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(f._id)}
                        >
                          Supprimer
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box className="fournisseur-add-button" mt={6}>
            <Link to="/fournisseurs/create">
              <Button colorScheme="teal" size="md">
                + Ajouter un fournisseur
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FournisseursList;
