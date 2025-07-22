import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Button, Input, Spinner, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import CardMarque from "./CardMarque";
import "./Marque.css";

const Marque = () => {
  const navigate = useNavigate();
  const [marques, setMarques] = useState([]);
  const [filteredMarques, setFilteredMarques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMarques = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErreur("Token introuvable. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/marques", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (Array.isArray(res.data)) {
          setMarques(res.data);
          setFilteredMarques(res.data);
        } else {
          setErreur("Réponse inattendue de l'API.");
        }
      } catch (err) {
        console.error("Erreur API :", err);
        setErreur(err.response?.data?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchMarques();
  }, []);

  useEffect(() => {
    const filtered = marques.filter((m) =>
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.statut.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMarques(filtered);
  }, [searchTerm, marques]);

  const handleAdd = () => navigate("/marque/add");
  const handleEdit = (id) => navigate(`/marques/edit/${id}`);
  const handleView = (id) => navigate(`/marque/detail/${id}`);

  return (
    <div className="marque-page-container">
      <Card>
        <CardBody>
          {/* Barre de recherche + bouton ajout alignés */}
          <Row className="align-items-center mb-4">
            <Col md="8">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une marque (code, désignation, statut)..."
              />
            </Col>
            <Col md="4" className="text-end">
              <Button color="primary" onClick={handleAdd}>
                + Ajouter une Marque
              </Button>
            </Col>
          </Row>

          {/* Contenu : chargement / erreur / liste */}
          {loading ? (
            <div className="text-center my-4">
              <Spinner color="primary" />
            </div>
          ) : erreur ? (
            <p className="text-danger text-center">{erreur}</p>
          ) : filteredMarques.length === 0 ? (
            <p className="text-center">Aucune marque trouvée.</p>
          ) : (
            <Row>
              {filteredMarques.map((m) => (
                <Col key={m._id} lg="4" md="6" sm="12">
                  <CardMarque data={m} onView={handleView} onEdit={handleEdit} />
                </Col>
              ))}
            </Row>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Marque;
