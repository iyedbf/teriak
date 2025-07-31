import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import SimpleBar from "simplebar-react";
import { useNotification } from "../../../context/NotificationContext";

const NotificationDropdown = () => {
  const [menu, setMenu] = useState(false);
  const { notifications } = useNotification();

  return (
    <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="dropdown d-inline-block" tag="li">
      <DropdownToggle className="btn header-item noti-icon position-relative" tag="button">
        <i className="bx bx-bell bx-tada" />
        <span className="badge bg-danger rounded-pill">{notifications.length}</span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
        <SimpleBar style={{ height: "230px" }}>
          {notifications.map((notif) => (
            <div key={notif.id} className="text-reset notification-item px-3 py-2 border-bottom">
              <h6 className="mb-1 fw-bold">{notif.title}</h6>
              <p className="mb-0 text-muted">{notif.description}</p>
              <small className="text-muted">
                <i className="mdi mdi-clock-outline me-1" />
                {notif.timestamp}
              </small>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center p-3 text-muted">Aucune notification</div>
          )}
        </SimpleBar>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;
