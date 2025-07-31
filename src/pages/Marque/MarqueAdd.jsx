import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Alert,
} from "reactstrap";
import axios from "axios";

const MarqueAdd = () => {
  const [marque, setMarque] = useState({
    code: "",
    designation: "",
    statut: "actif",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMarque({ ...marque, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/marques", marque, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess("Marque ajoutée avec succès !");
      setTimeout(() => {
        navigate("/marque-list");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout.");
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <CardBody>
              <h4 className="mb-4">Ajouter une Marque</h4>

              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="code">Code</Label>
                  <Input
                    type="text"
                    name="code"
                    id="code"
                    value={marque.code}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="designation">Désignation</Label>
                  <Input
                    type="text"
                    name="designation"
                    id="designation"
                    value={marque.designation}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="statut">Statut</Label>
                  <Input
                    type="select"
                    name="statut"
                    id="statut"
                    value={marque.statut}
                    onChange={handleChange}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </Input>
                </FormGroup>

                <div className="d-flex justify-content-end">
                  <Button type="submit" color="primary">
                    Ajouter
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MarqueAdd;
