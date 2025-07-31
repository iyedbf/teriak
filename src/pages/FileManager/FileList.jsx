import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Form,
  Input,
  Spinner,
  Button,
} from "reactstrap";
import axios from "axios";
import { getCountryCode } from "../../utils/flagUtils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FileList = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/fournisseurs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFournisseurs(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des fournisseurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFournisseurs();
  }, []);

  const filtered = fournisseurs.filter((f) =>
    `${f.nom} ${f.pays} ${f.code}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <React.Fragment>
      <Row className="mb-4 align-items-center">
        <Col md={6}>
        <h4 className="mb-0">
  <i className="mdi mdi-account-tie me-2 text-primary fs-4"></i>
  Fournisseurs
</h4>

        </Col>
        <Col md={6}>
          <Form className="d-flex justify-content-end">
            <Input
              type="search"
              className="form-control w-50"
              placeholder="🔍 Rechercher nom, pays ou code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: "20px", paddingLeft: "1.5rem" }}
            />
          </Form>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Chargement des fournisseurs...</p>
        </div>
      ) : (
        <Row>
          {filtered.length === 0 ? (
            <Col>
              <div className="text-center">Aucun fournisseur trouvé.</div>
            </Col>
          ) : (
            filtered.map((f, key) => {
              const code = getCountryCode(f.pays);
              const flagUrl = code ? `https://flagcdn.com/w40/${code}.png` : null;

              return (
                <motion.div
                  key={key}
                  className="col-xl-4 col-sm-6 mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: key * 0.05, duration: 0.4 }}
                >
                  <Card className="shadow border-0 hover-shadow">
                    <CardBody>
                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar-xs">
                          {flagUrl ? (
                            <img
                              src={flagUrl}
                              alt={f.pays}
                              width="32"
                              height="24"
                              className="rounded"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
             <div className="avatar-title bg-light rounded-circle text-primary">
<i className="mdi mdi-account-tie fs-3 text-primary" />
</div>



                          )}
                        </div>

                        <div className="ms-3">
                          <h5 className="mb-1 text-truncate">{f.nom}</h5>
                          <p className="text-muted mb-0">Code : {f.code}</p>
                        </div>
                      </div>

                      <p className="text-muted mb-2">
                        <strong>Pays :</strong>{" "}
                        <span className="badge bg-light text-dark border">{f.pays}</span>
                      </p>

                      <div className="d-flex justify-content-end">
                      <Link to={`/fournisseurs/${f._id}`}>
  <Button
    size="sm"
    style={{ backgroundColor: "#20c997", color: "#fff", border: "none" }}
  >
    Voir détails <i className="mdi mdi-arrow-right ms-1" />
  </Button>
</Link>

                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })
          )}
        </Row>
      )}
    </React.Fragment>
  );
};

export default FileList;
