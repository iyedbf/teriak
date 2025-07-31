import React, { useEffect, useState } from "react";
import { Table, Card, CardBody, Spinner } from "reactstrap";
import axios from "axios";
import { motion } from "framer-motion";
import { Box, Progress, Text } from "@chakra-ui/react";

const RecentFile = () => {
  const [users, setUsers] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [marques, setMarques] = useState([]);
  const [poincons, setPoincons] = useState([]);
  const [produits, setProduits] = useState([]); // Liste des produits
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [usersRes, loginRes, marquesRes, poinconsRes, produitsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/historique", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/marques", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/poincons", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/produits", { // Récupération des produits
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersRes.data);
        setMarques(marquesRes.data);
        setPoincons(poinconsRes.data);
        setProduits(produitsRes.data); // Assigner les produits à l'état

        const sortedLogins = loginRes.data
          .sort((a, b) => new Date(b.dateConnexion) - new Date(a.dateConnexion))
          .slice(0, 5);
        setRecentLogins(sortedLogins);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="mt-4">
        <CardBody>
          {/* 🔩 POINÇONS */}
          <h5 className="mb-2">🔩 Poinçons ({poincons.length})</h5>
          <Box mb={3}>
            <Progress value={poincons.length} max={200} size="sm" colorScheme="orange" borderRadius="md" />
          </Box>
          {loading ? <Spinner color="primary" /> : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Table className="table table-bordered align-middle table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Code Format</th>
                    <th>Forme</th>
                    <th>Fournisseur</th>
                    <th>Marque</th>
                    <th>État</th>
                    <th>Composants</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {poincons.map((p) => (
                    <tr key={p._id}>
                      <td>{p.codeFormat}</td>
                      <td>{p.forme || "—"}</td>
                      <td>{p.fournisseur?.designation || "—"}</td>
                      <td>{p.marque?.designation || "—"}</td>
                      <td>{p.etat || "—"}</td>
                      <td>{p.nbrComposants}</td>
                      <td className={p.statut?.toLowerCase() === "actif" ? "text-success" : "text-danger"}>
                        {p.statut}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

          {/* 🏷️ MARQUES */}
          <h5 className="mt-5 mb-2">🏷️ Marques ({marques.length})</h5>
          <Box mb={3}>
            <Progress value={marques.length} max={50} size="sm" colorScheme="green" borderRadius="md" />
          </Box>
          {loading ? <Spinner color="primary" /> : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Table className="table table-bordered align-middle table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Désignation</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {marques.map((m) => (
                    <tr key={m._id}>
                      <td>{m.code}</td>
                      <td>{m.designation}</td>
                      <td>{m.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

          {/* 👥 UTILISATEURS */}
          <h5 className="mt-5 mb-2">👥 Utilisateurs ({users.length})</h5>
          <Box mb={3}>
            <Progress value={users.length} max={100} size="sm" colorScheme="blue" borderRadius="md" />
          </Box>
          {loading ? <Spinner color="primary" /> : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <Table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.nom}</td>
                      <td>{user.prenom}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

          {/* 🔐 CONNEXIONS RÉCENTES */}
          <h5 className="mt-5 mb-2">🔐 Connexions récentes ({recentLogins.length})</h5>
          <Box mb={3}>
            <Progress value={recentLogins.length} max={10} size="sm" colorScheme="purple" borderRadius="md" />
          </Box>
          {loading ? <Spinner color="primary" /> : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <Table className="table table-hover table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Login</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogins.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{entry.login}</td>
                      <td>{new Date(entry.dateConnexion).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

          {/* 📦 PRODUITS */}
          <h5 className="mt-5 mb-2">📦 Produits ({produits.length})</h5>
          <Box mb={3}>
            <Progress value={produits.length} max={200} size="sm" colorScheme="red" borderRadius="md" />
          </Box>
          {loading ? <Spinner color="primary" /> : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
              <Table className="table table-bordered align-middle table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Désignation</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map((produit) => (
                    <tr key={produit._id}>
                      <td>{produit.code}</td>
                      <td>{produit.designation}</td>
                      <td>{produit.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

        </CardBody>
      </Card>
    </motion.div>
  );
};

export default RecentFile;
