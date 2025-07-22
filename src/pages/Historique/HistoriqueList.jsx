import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  Input,
  Flex,
  useToast,
  IconButton
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

const HistoriqueList = () => {
  const [historique, setHistorique] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/historique", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHistorique(res.data);
      } catch (err) {
        toast({
          title: "Erreur",
          description: err.response?.data?.message || "Erreur inconnue",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette entrée ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/historique/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setHistorique((prev) => prev.filter((h) => h._id !== id));
      toast({ title: "Supprimé", status: "success" });
    } catch (err) {
      toast({
        title: "Erreur de suppression",
        description: err.message,
        status: "error",
      });
    }
  };

  const filtered = historique
    .filter((entry) => {
      const fullText = `${entry.login} ${entry.nom} ${entry.prenom}`.toLowerCase();
      return fullText.includes(search.toLowerCase());
    })
    .filter((entry) => {
      const date = new Date(entry.dateConnexion);
      const afterStart = !startDate || date >= new Date(startDate);
      const beforeEnd = !endDate || date <= new Date(endDate);
      return afterStart && beforeEnd;
    })
    .sort((a, b) => {
      const da = new Date(a.dateConnexion);
      const db = new Date(b.dateConnexion);
      return sortAsc ? da - db : db - da;
    });

  return (
    <Box p={6} bg="#f9f9f9" minH="100vh">
      <Flex justify="space-between" alignItems="center" mb={6} wrap="wrap" gap={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Historique des connexions
        </Text>
        <Input
          placeholder="🔍 Rechercher par login, nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="300px"
          bg="white"
        />
      </Flex>

      <Flex gap={4} mb={4} wrap="wrap">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          bg="white"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          bg="white"
        />
        <Input
          type="button"
          value={sortAsc ? "🔼 Trier par date croissante" : "🔽 Trier par date décroissante"}
          onClick={() => setSortAsc(!sortAsc)}
          cursor="pointer"
          bg="teal"
          color="white"
        />
      </Flex>

      {loading ? (
        <Box textAlign="center">
          <Spinner size="xl" />
        </Box>
      ) : (
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Login</Th>
              <Th>Nom</Th>
              <Th>Prénom</Th>
              <Th>Date de connexion</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((entry) => (
              <Tr key={entry._id}>
                <Td>{entry.login}</Td>
                <Td>{entry.nom}</Td>
                <Td>{entry.prenom}</Td>
                <Td>
                  {entry.dateConnexion
                    ? new Date(entry.dateConnexion).toLocaleString()
                    : "N/A"}
                </Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(entry._id)}
                    aria-label="Supprimer"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default HistoriqueList;
