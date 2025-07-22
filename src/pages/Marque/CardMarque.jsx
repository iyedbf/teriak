import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, UncontrolledTooltip, Badge, Button } from "reactstrap";
import { CheckCircle, XCircle } from "react-feather";

const CardMarque = ({ data, onView, onEdit, onDelete }) => {
  const designationIcon = data.designation ? data.designation.charAt(0).toUpperCase() : "?";

  const codeTooltipId = `codeTooltip_${data._id}`;
  const statutTooltipId = `statutTooltip_${data._id}`;

  const isActive = data.statut === "actif";
  const badgeBg = isActive ? "#d4edda" : "#f8d7da";
  const badgeTextColor = isActive ? "#155724" : "#721c24";

  return (
    <Card className="mb-3 shadow-sm border-0" style={{ maxWidth: 400, margin: "auto" }}>
      <CardBody className="d-flex flex-column align-items-center text-center">
        <div
          className="avatar-sm rounded-circle bg-primary text-white font-size-16 d-flex align-items-center justify-content-center mb-3"
          style={{ width: 48, height: 48 }}
        >
          {designationIcon}
        </div>
        <h5 className="mb-1 font-size-15 text-truncate w-100">{data.designation}</h5>

        <a
          href="#!"
          className="text-muted"
          id={codeTooltipId}
          style={{ cursor: "default" }}
        >
          Code: {data.code}
        </a>
        <UncontrolledTooltip placement="top" target={codeTooltipId}>
          Code de la marque
        </UncontrolledTooltip>

        {/* Statut sous le code */}
        <div
          id={statutTooltipId}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 16px",
            borderRadius: "20px",
            backgroundColor: badgeBg,
            color: badgeTextColor,
            fontWeight: "600",
            fontSize: "0.95rem",
            boxShadow: `0 0 8px ${badgeBg}`,
            cursor: "default",
            userSelect: "none",
            marginTop: 12,
            marginBottom: 16,
            minWidth: 100,
            justifyContent: "center",
          }}
          title={isActive ? "Statut actif" : "Statut inactif"}
        >
          {isActive ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {data.statut.charAt(0).toUpperCase() + data.statut.slice(1)}
        </div>

        {/* Boutons en ligne */}
        <div className="d-flex justify-content-center gap-2 w-100">
          <Button size="sm" color="info" onClick={() => onView(data._id)}>
            Voir
          </Button>
          <Button size="sm" color="warning" onClick={() => onEdit(data._id)}>
            Modifier
          </Button>
          <Button size="sm" color="danger" onClick={() => onDelete(data._id)}>
            Supprimer
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

CardMarque.propTypes = {
  data: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CardMarque;
