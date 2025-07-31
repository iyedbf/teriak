import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import { useCallback } from "react";

const SidebarContent = (props) => {
  const ref = useRef();
  const path = useLocation();

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  // useEffect(() => {
  //   new MetisMenu("#side-menu");
  //   activeMenu();
  // }, []);
  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu");
    activeMenu();

    // Cleanup on component unmount
    return () => {
      metisMenu.dispose();
    };
  }, []);

  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title">{props.t("Menu")} </li> */}
            {/* <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/dashboard">{props.t("Default")}</Link>
                </li>
                <li>
                  <Link to="/dashboard-saas">{props.t("Saas")}</Link>
                </li>
                <li>
                  <Link to="/dashboard-crypto">{props.t("Crypto")}</Link>
                </li>
                <li>
                  <Link to="/blog">{props.t("Blog")}</Link>
                </li>
                <li>
                  <Link to="/dashboard-job">
                    {props.t("Job")}
                  </Link>
                </li>
              </ul>
            </li> */}

          <li className="menu-title">{props.t("Apps")}</li>

<li>
  <Link to="/calendar">
    <i className="bx bx-calendar"></i>
    <span>{props.t("Calendar")}</span>
  </Link>
</li>

<li>
  <Link to="/chat">
    <i className="bx bx-chat"></i>
    <span>{props.t("Chat")}</span>
  </Link>
</li>

<li>
  <Link to="/apps-filemanager">
    <i className="bx bx-folder"></i>
    <span>{props.t("File Manager")}</span>
  </Link>
</li>

<li className="menu-title">{props.t("Gestion")}</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-bullseye"></i>
    <span>{props.t("Poinçons")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/poincon-list">{props.t("Liste des poinçons")}</Link></li>
    <li><Link to="/poincons/add">{props.t("Ajouter un poinçon")}</Link></li>
  </ul>
</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-purchase-tag"></i>
    <span>{props.t("Marques")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/marque-list">{props.t("Liste des marques")}</Link></li>
    <li><Link to="/marque/add">{props.t("Ajouter une marque")}</Link></li>
  </ul>
</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-cog"></i>
    <span>{props.t("Compremeuse")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/compremeuses">{props.t("Liste des compremeuses")}</Link></li>
    <li><Link to="/compremeuses/add">{props.t("Ajouter une compremeuse")}</Link></li>
  </ul>
</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-clipboard"></i>
    <span>{props.t("Audit Trail")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/audit-trail">{props.t("Liste des Audits")}</Link></li>
  </ul>
</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-group"></i>
    <span>{props.t("Utilisateurs")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/users-list">{props.t("Liste des utilisateurs")}</Link></li>
    <li><Link to="/users-detail">{props.t("Détails utilisateur")}</Link></li>
  </ul>
</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-package"></i>
    <span>{props.t("Produits")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/produits-add">{props.t("Ajouter un produit")}</Link></li>
    <li><Link to="/produits-list">{props.t("Liste des produits")}</Link></li>
  </ul>
</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-user-check"></i>
    <span>{props.t("Fournisseurs")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/fournisseurs">{props.t("Liste des fournisseurs")}</Link></li>
  </ul>
</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-history"></i>
    <span>{props.t("Historique de connexion")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/historique">{props.t("Liste de l'historique")}</Link></li>
  </ul>
</li>

<li>
  <Link to="#" className="has-arrow">
    <i className="bx bx-history"></i>
    <span>{props.t("Historique d'utilisation")}</span>
  </Link>
  <ul className="sub-menu" aria-expanded="false">
    <li><Link to="/utilisation-list">{props.t("Liste de l'utilisation")}</Link></li>
    <li><Link to="/utilisation/add">{props.t("Production")}</Link></li>
      
  </ul>
</li>

{/* 
            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-map"></i>
                <span>{props.t("Maps")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/maps-google">{props.t("Google Maps")}</Link>
                </li>
              </ul>
            </li> */}

            {/* <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-share-alt"></i>
                <span>{props.t("Multi Level")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="true">
                <li>
                  <Link to="/#">{props.t("Level 1.1")}</Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Level 1.2")}
                  </Link>
                  <ul className="sub-menu" aria-expanded="true">
                    <li>
                      <Link to="/#">{props.t("Level 2.1")}</Link>
                    </li>
                    <li>
                      <Link to="/#">{props.t("Level 2.2")}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
