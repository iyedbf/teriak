import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Text
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const AuditTrailPage = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/audit-trail", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAuditLogs(res.data);
      } catch (err) {
        toast({ title: "Erreur", status: "error", description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [toast]);

  const filteredAuditLogs = auditLogs.filter((log) =>
    (`${log.actionType} ${log.description} ${log.user.nom || ""} ${log.user.prenom || ""}`)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Box className="page-container" p={6} mt="100px">
      <Flex justify="space-between" mb={4}>
        <Input
          placeholder="🔍 Rechercher une action, utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="300px"
        />
        <Link to="/audit-trail/create">
          <Button colorScheme="teal">+ Ajouter un log</Button>
        </Link>
      </Flex>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Action</Th>
                  <Th>Référence</Th>
                  <Th>Utilisateur</Th>
                  <Th>Description</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAuditLogs.map((log) => (
                  <Tr key={log._id}>
                    <Td>{new Date(log.actionDate).toLocaleString()}</Td>
                    <Td>{log.actionType}</Td>
                    <Td>{log.reference}</Td>
                    <Td>
                      {typeof log.user === "object"
                        ? `${log.user.prenom || ""} ${log.user.nom || ""}`
                        : log.user}
                    </Td>
                    <Td>{log.description}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {filteredAuditLogs.length === 0 && (
            <Text mt={4} textAlign="center">Aucun log trouvé.</Text>
          )}
        </>
      )}
    </Box>
  );
};

export default AuditTrailPage;
