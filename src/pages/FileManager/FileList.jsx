import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Form,
  Input,
  Spinner,
} from "reactstrap";
import axios from "axios";
import { getCountryCode } from "../../utils/flagUtils";

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

  const filtered = fournisseurs.filter(f =>
    `${f.nom} ${f.pays} ${f.code}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <React.Fragment>
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h4 className="mb-0">📁 Fournisseurs</h4>
        </Col>
        <Col md={6}>
          <Form className="d-flex justify-content-end">
            <Input
              type="search"
              className="form-control w-50"
              placeholder="🔍 Rechercher par nom ou pays"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner color="primary" /> Chargement des données...
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
                <Col xl={4} sm={6} key={key} className="mb-4">
                  <Card className="shadow border-0">
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
      <i className="mdi mdi-domain"></i>
    </div>
  )}
</div>

                        <div className="ms-3">
                          <h5 className="mb-1 text-truncate">{f.nom}</h5>
                          <p className="text-muted mb-0">Code : {f.code}</p>
                        </div>
                      </div>
                     <p className="text-muted mb-1"><strong>Pays :</strong> {f.pays}</p>

                    </CardBody>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      )}
    </React.Fragment>
  );
};

export default FileList;
