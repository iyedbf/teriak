import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import * as jwt_decode from "jwt-decode";
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import DeleteModal from "./DeleteModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import verification from "../../assets/images/verification-img.png";

const EntretienCalendar = () => {
  document.title = "Calendrier des entretiens";

  // States
  const [entretien, setEntretien] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [entretienEvents, setEntretienEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [produits, setProduits] = useState([]);
  const [userId, setUserId] = useState(null);

  // Decode le token pour récupérer l'id utilisateur (gestion compatible avec Vite)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = typeof jwt_decode === "function" ? jwt_decode(token) : jwt_decode.default(token);
        setUserId(decoded.id || decoded.userId || null);
      } catch (err) {
        console.error("Erreur décodage token:", err);
      }
    }
  }, []);

  // Fonction utilitaire pour créer headers avec token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token manquant");
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch produits
  const fetchProduits = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/produits", {
        headers: getAuthHeaders(),
      });
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err.response?.data || err.message);
    }
  };

  // Fetch entretiens
  const fetchEntretiens = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/entretiens", {
        headers: getAuthHeaders(),
      });

      const events = res.data.map((e) => ({
        id: e._id,
        title: `Entretien: ${e.produit?.code || "Sans produit"}`,
        start: new Date(e.date),
        extendedProps: {
          produitId: e.produit?._id,
          produitCode: e.produit?.code,
          commentaire: e.nettoyage?.produit || "",
        },
        className: "bg-info text-white",
      }));

      setEntretienEvents(events);
    } catch (err) {
      console.error("Erreur lors du chargement des entretiens :", err.response?.data || err.message);
    }
  };

  // Initial fetch des données
  useEffect(() => {
    fetchProduits();
    fetchEntretiens();
  }, []);

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      produit: entretien.produit || "",
      commentaire: entretien.commentaire || "",
      date: entretien.date
        ? new Date(entretien.date).toISOString().substr(0, 10)
        : selectedDate
        ? selectedDate.toISOString().substr(0, 10)
        : "",
    },
    validationSchema: Yup.object({
      produit: Yup.string().required("Produit requis"),
      commentaire: Yup.string().required("Commentaire requis"),
      date: Yup.date().required("Date requise"),
    }),
    onSubmit: async (values) => {
      try {
        const dateISO = new Date(values.date).toISOString();

        const payload = {
          reference: `ENT-${Math.floor(Math.random() * 10000)}`,
          date: dateISO,
          produit: values.produit,
          nettoyage: {
            date: dateISO,
            produit: values.commentaire,
          },
          lubrification: {
            date: dateISO,
            produit: "",
          },
          utilisateurs: userId ? [userId] : [],
        };

        const res = await axios.post("http://localhost:5000/api/entretiens", payload, {
          headers: getAuthHeaders(),
        });

        const saved = res.data;

        const produitInfo = produits.find((p) => p._id === values.produit);

        const newEvent = {
          id: saved._id,
          title: `Entretien: ${produitInfo?.code || values.produit}`,
          start: new Date(dateISO),
          extendedProps: {
            produitId: values.produit,
            produitCode: produitInfo?.code || values.produit,
            commentaire: values.commentaire,
          },
          className: "bg-info text-white",
        };

        setEntretienEvents((prev) => [...prev, newEvent]);
        toggleModal();
      } catch (err) {
        console.error("Erreur lors de la sauvegarde :", err.response?.data?.message || err.message);
      }
    },
  });

  // Mise à jour selectedDate quand date change dans formulaire
  useEffect(() => {
    if (formik.values.date) {
      setSelectedDate(new Date(formik.values.date));
    }
  }, [formik.values.date]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setIsEdit(false);
    setEntretien({});
    setSelectedDate(null);
    formik.resetForm();
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setEntretien({});
    setIsEdit(false);
    toggleModal();
  };

  const handleEventClick = (arg) => {
    const evt = arg.event;
    setEntretien({
      id: evt.id,
      reference: evt.id,
      produit: evt.extendedProps.produitId,
      commentaire: evt.extendedProps.commentaire,
      date: evt.start,
    });
    setSelectedDate(evt.start);
    setIsEdit(true);
    setDeleteId(evt.id);
    toggleModal();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/entretiens/${deleteId}`, {
        headers: getAuthHeaders(),
      });
      setEntretienEvents((prev) => prev.filter((evt) => evt.id !== deleteId));
      setDeleteModal(false);
      toggleModal();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err.response?.data || err.message);
    }
  };

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Entretien" breadcrumbItem="Calendrier des entretiens" />
          <Row>
            <Col xl={3}>
              <Card>
                <CardBody>
                  <Button color="primary" onClick={handleDateClick} className="mb-3">
                    <i className="mdi mdi-plus-circle-outline me-1" /> Ajouter Entretien
                  </Button>
                  <Row className="justify-content-center mt-4">
                    <img src={verification} alt="" className="img-fluid d-block" />
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={9}>
              <Card>
                <CardBody>
                  <FullCalendar
                    plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                    }}
                    themeSystem="bootstrap"
                    locales={allLocales}
                    locale="fr"
                    events={entretienEvents}
                    editable
                    selectable
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal isOpen={modalOpen} toggle={toggleModal} centered>
          <ModalHeader toggle={toggleModal}>{isEdit ? "Modifier Entretien" : "Ajouter Entretien"}</ModalHeader>
          <ModalBody>
            <Form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <Label>Produit</Label>
                <Input
                  type="select"
                  name="produit"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.produit}
                  invalid={formik.touched.produit && !!formik.errors.produit}
                >
                  <option value="">-- Sélectionner un produit --</option>
                  {produits.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.code} - {prod.designation}
                    </option>
                  ))}
                </Input>
                <FormFeedback>{formik.errors.produit}</FormFeedback>
              </div>

              <div className="mb-3">
                <Label>Commentaire </Label>
                <Input
                  name="commentaire"
                  type="textarea"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.commentaire}
                  invalid={formik.touched.commentaire && !!formik.errors.commentaire}
                />
                <FormFeedback>{formik.errors.commentaire}</FormFeedback>
              </div>

              <div className="mb-3">
                <Label>Date</Label>
                <Input
                  type="date"
                  name="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                  invalid={formik.touched.date && !!formik.errors.date}
                />
                <FormFeedback>{formik.errors.date}</FormFeedback>
              </div>

              <div className="text-end">
                <Button type="button" color="light" onClick={toggleModal} className="me-2">
                  Fermer
                </Button>
                <Button type="submit" color="success">
                  Sauvegarder
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

EntretienCalendar.propTypes = {
  className: PropTypes.string,
};

export default EntretienCalendar;
