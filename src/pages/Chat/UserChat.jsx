import React, { useState, useEffect, useRef } from "react";
import { Input, Button } from "reactstrap";

const UserChat = ({ currentUser, selectedUser, roomId, messages, onSendMessage }) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll automatique en bas quand un nouveau message arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fonction d’envoi
  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  // Appuyer sur "Entrée" pour envoyer
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!selectedUser) {
    return <div className="flex-grow-1 p-4">👉 Sélectionnez un utilisateur pour discuter.</div>;
  }

  return (
    <div className="flex-grow-1 d-flex flex-column p-3 border-start" style={{ height: "75vh" }}>
      <h5 className="mb-3">💬 Conversation avec {selectedUser.nom} {selectedUser.prenom}</h5>

      {/* Affichage des messages */}
      <div className="flex-grow-1 overflow-auto mb-3" style={{ background: "#f9f9f9", borderRadius: "8px", padding: "1rem" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 d-flex ${msg.from === currentUser._id ? "justify-content-end" : "justify-content-start"}`}
          >
            <div className={`p-2 rounded ${msg.from === currentUser._id ? "bg-primary text-white" : "bg-light text-dark"}`}>
              {msg.content}
              <div className="small text-muted mt-1 text-end" style={{ fontSize: "0.7rem" }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Champ de saisie */}
      <div className="d-flex">
        <Input
          type="text"
          placeholder="Écrire un message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button color="primary" className="ms-2" onClick={handleSend}>
          Envoyer
        </Button>
      </div>
    </div>
  );
};

export default UserChat;
