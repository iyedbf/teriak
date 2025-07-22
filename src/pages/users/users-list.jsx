import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Spinner,
  useToast,
  Input,
  Flex,
  Text
} from "@chakra-ui/react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUsers(res.data);
    } catch (error) {
      toast({
        title: "Erreur de chargement",
        description: error.response?.data?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast({
        title: "Utilisateur supprimé",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression",
        description: error.response?.data?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true
      });
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.nom} ${user.prenom} ${user.email} ${user.login} ${user.role} ${user.statut}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6} bg="#f9f9f9" minHeight="100vh" mt="100px">
      {/* Barre titre + recherche */}
      <Box mb={6}>
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Liste des utilisateurs
          </Text>
          <Input
            placeholder="🔍 Rechercher..."
            width="300px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
            border="1px solid #ccc"
            _placeholder={{ color: "gray.500" }}
          />
        </Flex>
      </Box>

      {/* Tableau des utilisateurs */}
      <Box overflowX="auto">
        <Table striped hover responsive className="mb-4">
          <thead className="table-light">
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Login</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.login}</td>
                  <td>{user.role}</td>
                  <td>{user.statut}</td>
                  <td>
                    <Flex gap={2} flexWrap="wrap">
                      <Link to={`/users/${user._id}`}>
                        <Button size="sm">Voir</Button>
                      </Link>
                      <Link to={`/users/edit/${user._id}`}>
                        <Button size="sm" colorScheme="teal">Modifier</Button>
                      </Link>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => deleteUser(user._id)}
                      >
                        Supprimer
                      </Button>
                    </Flex>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-3">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Box>

      {/* Bouton d'ajout centré */}
      <Box textAlign="center" mt={6}>
        <Link to="/users/create">
          <Button colorScheme="teal" size="md">+ Ajouter un utilisateur</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default UsersList;
