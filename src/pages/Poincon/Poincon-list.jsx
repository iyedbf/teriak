import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardBody, Button, Input, Spinner, Row, Col, Table } from "reactstrap";

const EditIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M16.5 3.75a2.25 2.25 0 013.182 3.182L7.5 18.75H4.5v-3l12-12z" />
  </svg>
);

const DeleteIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PoinconList = () => {
  const navigate = useNavigate();
  const [poincons, setPoincons] = useState([]);
  const [filteredPoincons, setFilteredPoincons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPoincons = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErreur("Token introuvable. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/poincons", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (Array.isArray(res.data)) {
          setPoincons(res.data);
          setFilteredPoincons(res.data);
        } else {
          setErreur("Réponse inattendue.");
        }
      } catch (err) {
        console.error("Erreur API :", err);
        setErreur(err.response?.data?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPoincons();
  }, []);

  useEffect(() => {
    const filtered = poincons.filter((p) => {
      const search = searchTerm.toLowerCase();
      return (
        p.codeFormat.toLowerCase().includes(search) ||
        p.forme?.designation?.toLowerCase().includes(search) ||
        p.fournisseur?.designation?.toLowerCase().includes(search) ||
        p.marque?.designation?.toLowerCase().includes(search) ||
        p.etat?.designation?.toLowerCase().includes(search) ||
        p.statut?.toLowerCase().includes(search)
      );
    });
    setFilteredPoincons(filtered);
  }, [searchTerm, poincons]);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce poinçon ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/poincons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const updated = poincons.filter((p) => p._id !== id);
      setPoincons(updated);
      setFilteredPoincons(updated);
    } catch (err) {
      alert("Erreur lors de la suppression.");
      console.error(err);
    }
  };

  const handleEdit = (id) => navigate(`/poincons/edit/${id}`);
  const handleView = (id) => navigate(`/poincons/detail/${id}`);

  return (
    <Card >
      <CardBody>
        <Row className="align-items-center mb-3">
  <Col md="6">
    <Input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Rechercher un poinçon..."
    />
  </Col>
  <Col md="6" className="text-end">
    <Button color="primary" onClick={() => navigate("/poincons/add")}>
      + Ajouter un Poinçon
    </Button>
  </Col>
</Row>


        {loading ? (
          <div className="text-center my-4">
            <Spinner color="primary" />
          </div>
        ) : erreur ? (
          <p className="text-danger text-center">{erreur}</p>
        ) : filteredPoincons.length === 0 ? (
          <p className="text-center">Aucun poinçon trouvé.</p>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Code Format</th>
                <th>Forme</th>
                <th>Fournisseur</th>
                <th>Marque</th>
                <th>État</th>
                <th>Composants</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPoincons.map((p) => (
                <tr key={p._id}>
                  <td>{p.codeFormat}</td>
                  <td>{p.forme?.designation || "—"}</td>
                  <td>{p.fournisseur?.designation || "—"}</td>
                  <td>{p.marque?.designation || "—"}</td>
                  <td>{p.etat?.designation || "—"}</td>
                  <td>{p.nbrComposants}</td>
                  <td className={p.statut?.toLowerCase() === "actif" ? "text-success" : "text-danger"}>{p.statut}</td>
                  <td>
                    <Button size="sm" color="info" onClick={() => handleView(p._id)} title="Voir">🔍</Button>{' '}
                    <Button
  size="sm"
  onClick={() => handleEdit(p._id)}
  title="Modifier"
  style={{ backgroundColor: 'teal', color: 'white', borderColor: 'teal' }}
>
  <EditIcon />
</Button>
                    <Button size="sm" color="danger" onClick={() => handleDelete(p._id)} title="Supprimer">
                      <DeleteIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default PoinconList;