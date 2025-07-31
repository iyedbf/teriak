import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, useToast, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ProduitsList = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/produits", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProduits(res.data);
      } catch (err) {
        toast({ title: "Erreur", status: "error", description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [toast]);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6}>
      <Link to="/produits/create">
        <Button colorScheme="teal" mb={4}>
          + Ajouter un produit
        </Button>
      </Link>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Code</Th>
            <Th>Désignation</Th>
            <Th>Statut</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {produits.map((produit) => (
            <Tr key={produit._id}>
              <Td>{produit.code}</Td>
              <Td>{produit.designation}</Td>
              <Td>{produit.statut}</Td>
              <Td>
               <Link to={`/produits-edit/${produit._id}`}>
  <Button size="sm" colorScheme="teal" mr={2}>
    Modifier
  </Button>
</Link>

                <Button size="sm" colorScheme="red" onClick={() => handleDelete(produit._id)}>
                  Supprimer
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );

  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/produits/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProduits(produits.filter((produit) => produit._id !== id));
      toast({ title: "Produit supprimé", status: "success" });
    } catch (err) {
      toast({ title: "Erreur", status: "error", description: err.message });
    }
  }
};

export default ProduitsList;
