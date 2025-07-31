import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Spinner, Button } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const Storage = ({ dataColors }) => {
  const apexfileManagerChartColors = getChartColorsArray(dataColors);

  const [userCount, setUserCount] = useState(0);
  const [fournisseurCount, setFournisseurCount] = useState(0);
  const [connexionCount, setConnexionCount] = useState(0);
  const [marqueCount, setMarqueCount] = useState(0);
  const [poinconCount, setPoinconCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const total =
    userCount + fournisseurCount + connexionCount + marqueCount + poinconCount || 1;
  const percent = Math.round((total / 100) * 100);

  const series = [percent];

  const options = {
    chart: {
      height: 150,
      type: "radialBar",
      sparkline: { enabled: true },
    },
    colors: apexfileManagerChartColors,
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5,
        },
        hollow: { size: "60%" },
        dataLabels: {
          name: { show: false },
          value: { offsetY: -2, fontSize: "16px" },
        },
      },
    },
    grid: { padding: { top: -10 } },
    stroke: { dashArray: 3 },
    labels: ["Statistiques"],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [
          usersRes,
          fournisseursRes,
          connexionsRes,
          marquesRes,
          poinconsRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/fournisseurs", {
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
        ]);

        setUserCount(usersRes.data.length);
        setFournisseurCount(fournisseursRes.data.length);
        setConnexionCount(connexionsRes.data.length);
        setMarqueCount(marquesRes.data.length);
        setPoinconCount(poinconsRes.data.length);
      } catch (error) {
        console.error("Erreur de chargement des stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="filemanager-sidebar ms-lg-2">
      <CardBody>
        <div className="text-center">
          <h5 className="font-size-15 mb-4">📊 Statistiques Globales</h5>
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={150}
            className="apex-charts"
          />
          {!loading ? (
            <p className="text-muted mt-4">
              {fournisseurCount} fournisseurs / {userCount} utilisateurs /{" "}
              {connexionCount} connexions / {marqueCount} marques /{" "}
              {poinconCount} poinçons
            </p>
          ) : (
            <Spinner size="sm" className="mt-3" />
          )}
        </div>

        <div className="mt-4">
          {/* Utilisateurs */}
          <Card className="border shadow-none mb-2">
            <div className="p-2 d-flex align-items-center">
              <div className="avatar-xs align-self-center me-2">
                <div className="avatar-title rounded bg-transparent text-info font-size-20">
                  <i className="mdi mdi-account-multiple-outline"></i>
                </div>
              </div>
              <div className="overflow-hidden me-auto">
                <h5 className="font-size-13 mb-1">Utilisateurs</h5>
                <p className="text-muted mb-1">{userCount} utilisateurs</p>
                <Link to="/users">
                  <Button size="sm" color="primary">
                    Voir plus
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Fournisseurs */}
          <Card className="border shadow-none mb-2">
            <div className="p-2 d-flex align-items-center">
              <div className="avatar-xs align-self-center me-2">
                <div className="avatar-title rounded bg-transparent text-warning font-size-20">
                  <i className="mdi mdi-domain"></i>
                </div>
              </div>
              <div className="overflow-hidden me-auto">
                <h5 className="font-size-13 mb-1">Fournisseurs</h5>
                <p className="text-muted mb-1">{fournisseurCount} fournisseurs</p>
                <Link to="/fournisseurs">
                  <Button size="sm" color="warning">
                    Voir plus
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Connexions */}
          <Card className="border shadow-none mb-2">
            <div className="p-2 d-flex align-items-center">
              <div className="avatar-xs align-self-center me-2">
                <div className="avatar-title rounded bg-transparent text-success font-size-20">
                  <i className="mdi mdi-login"></i>
                </div>
              </div>
              <div className="overflow-hidden me-auto">
                <h5 className="font-size-13 mb-1">Connexions</h5>
                <p className="text-muted mb-1">{connexionCount} connexions</p>
                <Link to="/historique">
                  <Button size="sm" color="success">
                    Voir plus
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Marques */}
          <Card className="border shadow-none mb-2">
            <div className="p-2 d-flex align-items-center">
              <div className="avatar-xs align-self-center me-2">
                <div className="avatar-title rounded bg-transparent text-secondary font-size-20">
                  <i className="mdi mdi-label-outline"></i>
                </div>
              </div>
              <div className="overflow-hidden me-auto">
                <h5 className="font-size-13 mb-1">Marques</h5>
                <p className="text-muted mb-1">{marqueCount} marques</p>
                <Link to="/marque-list">
                  <Button size="sm" color="secondary">
                    Voir plus
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Poinçons */}
          <Card className="border shadow-none mb-2">
            <div className="p-2 d-flex align-items-center">
              <div className="avatar-xs align-self-center me-2">
                <div className="avatar-title rounded bg-transparent text-dark font-size-20">
                  <i className="mdi mdi-shield-star-outline"></i>
                </div>
              </div>
              <div className="overflow-hidden me-auto">
                <h5 className="font-size-13 mb-1">Poinçons</h5>
                <p className="text-muted mb-1">{poinconCount} poinçons</p>
                <Link to="/poincon-list">
                  <Button size="sm" color="dark">
                    Voir plus
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

Storage.propTypes = {
  dataColors: PropTypes.any,
};

export default Storage;
