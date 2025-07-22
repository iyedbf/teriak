import React from "react";
import { Input } from "reactstrap";
import SimpleBar from "simplebar-react";

const ChatList = ({ users, onUserSelect, currentRoomId }) => {
  return (
    <div className="chat-leftsidebar me-lg-4">
      <div className="py-4 border-bottom">
        <h5 className="font-size-15 mb-0">Utilisateurs connectés</h5>
      </div>
      <div className="search-box chat-search-box py-4">
        <div className="position-relative">
          <Input type="text" placeholder="Rechercher..." />
          <i className="bx bx-search-alt search-icon" />
        </div>
      </div>
      <SimpleBar style={{ height: "470px" }}>
        <ul className="list-unstyled chat-list" id="recent-list">
          {users.map((user) => (
            <li
              key={user._id}
              className={currentRoomId?.includes(user._id) ? "active" : ""}
            >
              <a href="#!" onClick={() => onUserSelect(user)}>
                <div className="d-flex align-items-center">
                  <div className="avatar-xs me-3">
                    <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                      {user.nom[0]}
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="font-size-14 mb-0">{user.nom} {user.prenom}</h5>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </SimpleBar>
    </div>
  );
};

export default ChatList;
