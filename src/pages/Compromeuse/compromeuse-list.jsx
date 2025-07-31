import React, { useEffect, useState } from "react";
import "./compremeuses-list.css";
import {
  Box, Button, Flex, Input, Table, Tbody, Td, Th, Thead, Tr, useToast, Spinner
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios from "axios";

const CompremeusesList = () => {
  const [compremeuses, setCompremeuses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/compromeuses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setCompremeuses(res.data);
      } catch (err) {
        toast({ title: "Erreur", status: "error", description: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette compremeuse ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/compromeuses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCompremeuses(compremeuses.filter(c => c._id !== id));
      toast({ title: "Supprimée", status: "success" });
    } catch (err) {
      toast({ title: "Erreur", description: err.message, status: "error" });
    }
  };

  // 🔍 Filtrage dynamique
  const filteredCompremeuses = compremeuses.filter(c =>
    (`${c.code} ${c.designation} ${c.statut}`).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="page-container" p={6} mt="100px">
      <Flex justify="space-between" mb={4}>
        <Input
          placeholder="🔍 Rechercher une compremeuse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="300px"
        />
      </Flex>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Box className="compremeuses-table">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Code</Th>
                  <Th>Désignation</Th>
                  <Th>Statut</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredCompremeuses.map((c) => (
                  <Tr key={c._id}>
                    <Td>{c.code}</Td>
                    <Td>{c.designation}</Td>
                    <Td>{c.statut}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Link to={`/compremeuses/${c._id}`}>
                          <Button size="sm">Voir</Button>
                        </Link>
                        <Link to={`/compremeuses/edit/${c._id}`}>
                          <Button size="sm" colorScheme="teal">Modifier</Button>
                        </Link>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(c._id)}
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

          <Box className="compremeuse-add-button" mt={6}>
            <Link to="/compremeuses/add">
              <Button colorScheme="teal" size="md">
                + Ajouter une compremeuse
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CompremeusesList;
