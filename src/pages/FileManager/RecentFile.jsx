import React, { useEffect, useState } from "react";
import { Table, Card, CardBody, Spinner } from "reactstrap";
import axios from "axios";

const RecentFile = () => {
  const [users, setUsers] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, loginRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:5000/api/historique", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setUsers(usersRes.data);
        // Trie du plus récent au plus ancien
        const sortedLogins = loginRes.data
          .sort(
            (a, b) =>
              new Date(b.dateConnexion).getTime() -
              new Date(a.dateConnexion).getTime()
          )
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
    <Card className="mt-4">
      <CardBody>
        <h5 className="mb-3">👥 Utilisateurs</h5>
        {loading ? (
          <Spinner color="primary" />
        ) : (
          <div className="table-responsive">
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
          </div>
        )}

        {/* 🔽 Connexions récentes affichées en dessous */}
        <h5 className="mt-5 mb-3">🔐 Connexions récentes</h5>
        {loading ? (
          <Spinner color="primary" />
        ) : (
          <div className="table-responsive">
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
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RecentFile;
