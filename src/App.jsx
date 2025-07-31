import PropTypes from "prop-types";
import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes/index";

// Middleware
import Authmiddleware from "./routes/route";

// Layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Styles
import "./assets/scss/theme.scss";

// Fake backend
import fakeBackend from "./helpers/AuthType/fakeBackend";
fakeBackend();

const App = (props) => {
  // Sélection du layout depuis Redux
  const LayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutType: layout.layoutType,
    })
  );

  const { layoutType } = useSelector(LayoutProperties);

  // Choix du layout selon configuration
  const Layout = layoutType === "horizontal" ? HorizontalLayout : VerticalLayout;

  // Vérification de l'authentification
  const isAuthenticated = localStorage.getItem("authUser"); // ou "token" si c’est ce que vous utilisez

  return (
    <React.Fragment>
      <Routes>
        {/* Routes publiques */}
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            exact={true}
          />
        ))}

        {/* Routes protégées */}
        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <Layout>{route.component}</Layout>
              </Authmiddleware>
            }
            key={idx}
            exact={true}
          />
        ))}

        {/* ✅ Redirection dynamique selon l'état d'authentification */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Fallback route vers 404 si aucune correspondance */}
        <Route path="*" element={<Navigate to="/pages-404" />} />
      </Routes>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
