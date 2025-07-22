import React from "react";
import { Card, CardBody, Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import FileLeftBar from "./FileLeftBar";
import FileList from "./FileList";
import RecentFile from "./RecentFile";
import Storage from "./Storage";

const Index = () => {
  document.title = "Dashboard Données - Fournisseurs, Utilisateurs, Connexions";

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Dashboard" breadcrumbItem="Vue Globale" />
        <div className="d-xl-flex">
          <div className="w-100">
            <div className="d-md-flex">
              <FileLeftBar />
              <div className="w-100">
                <Card>
                  <CardBody>
                    <FileList />
                    <RecentFile />
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
          <Storage dataColors='["--bs-primary"]' />
        </div>
      </Container>
    </div>
  );
};

export default Index;
