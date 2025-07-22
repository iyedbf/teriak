import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import ChatList from "./ChatList";
import UserChat from "./UserChat";
import axios from "axios";
import { io } from "socket.io-client";

// Initialisation du client socket.io
const socket = io("http://localhost:5000");

const Chat = () => {
  document.title = "Chat Utilisateurs | Dashboard";

  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Récupération des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAllUsers(res.data);

        // ⚠️ À adapter selon l'utilisateur connecté
        const userId = localStorage.getItem("userId");
        const user = res.data.find(u => u._id === userId) || res.data[0];
        setCurrentUser(user);
      } catch (err) {
        console.error("Erreur chargement utilisateurs :", err);
      }
    };

    fetchUsers();
  }, []);

  // Rejoindre la room dès qu'elle est définie
  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", roomId);
    }
  }, [roomId]);

  // Réception des messages en temps réel
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (message.roomId === roomId) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [roomId]);

  // Sélection d'un utilisateur
  const openChatWith = async (user) => {
    setSelectedUser(user);
    const room = [currentUser._id, user._id].sort().join("-");
    setRoomId(room);

    try {
      const res = await axios.get(`http://localhost:5000/api/messages/room/${room}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Erreur chargement messages :", error);
      setMessages([]);
    }
  };

  // Envoi d'un message
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const newMsg = {
      from: currentUser._id,
      to: selectedUser._id,
      roomId,
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5000/api/messages", newMsg);
      setMessages((prev) => [...prev, newMsg]);
      socket.emit("sendMessage", newMsg);
    } catch (error) {
      console.error("Erreur envoi message :", error);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Messagerie" breadcrumbItem="Chat" />
        <Row>
          <Col lg="12">
            <div className="d-lg-flex">
              <ChatList
                users={allUsers.filter((u) => u._id !== currentUser?._id)}
                onUserSelect={openChatWith}
                currentRoomId={roomId}
              />
              <UserChat
                currentUser={currentUser}
                selectedUser={selectedUser}
                roomId={roomId}
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Chat;
