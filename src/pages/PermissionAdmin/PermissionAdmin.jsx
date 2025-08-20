import React, { useEffect, useState } from "react";
import axios from "axios";
import './PermissionsAdmin.css';


const PermissionsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const modulesList = ["users", "produits", "poincons", "fournisseurs", "utilisations","marques","compromeuses","entretiens","utilisations"];
  const actionsList = ["create", "read", "update", "delete"];

  // Charger tous les utilisateurs
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  // Charger les permissions d’un utilisateur sélectionné
  const handleSelectUser = async (userId) => {
    if (!userId) {
      setSelectedUser(null);
      setPermissions({});
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);

      // Initialiser les permissions avec true/false selon les actions existantes
      const userPermissions = res.data.permissions || {};
      const initPermissions = {};
      modulesList.forEach((module) => {
        initPermissions[module] = {};
        actionsList.forEach((action) => {
          // ✅ Vérifie si l’action est incluse dans le tableau
          initPermissions[module][action] = userPermissions[module]?.includes(action) || false;
        });
      });

      setPermissions(initPermissions);
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle d’une permission
  const togglePermission = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  // Sauvegarde
  const handleSave = async () => {
    if (!selectedUser) return;

    // Transformer en format tableau pour le backend
    const formattedPermissions = {};
    modulesList.forEach((module) => {
      formattedPermissions[module] = actionsList.filter((action) => permissions[module][action]);
    });

    try {
      await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}/permissions`,
        { permissions: formattedPermissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Permissions mises à jour !");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestion des Permissions</h2>

      {/* Choix utilisateur */}
      <select
        className="border p-2 rounded mb-4"
        onChange={(e) => handleSelectUser(e.target.value)}
      >
        <option value="">-- Choisir un utilisateur --</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.nom} {user.prenom} ({user.role})
          </option>
        ))}
      </select>

      {loading && <p>Chargement...</p>}

      {/* Tableau des permissions */}
      {selectedUser && (
        <div className="overflow-x-auto mt-4">
          <h3 className="text-xl font-semibold mb-2">
            Permissions pour {selectedUser.nom} {selectedUser.prenom}
          </h3>

          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Module</th>
                {actionsList.map((action) => (
                  <th key={action} className="border px-4 py-2">{action}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modulesList.map((module) => (
                <tr key={module}>
                  <td className="border px-4 py-2 font-semibold">{module}</td>
                  {actionsList.map((action) => (
                    <td key={action} className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.[action] || false}
                        onChange={() => togglePermission(module, action)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            💾 Sauvegarder
          </button>
        </div>
      )}
    </div>
  );
};

export default PermissionsAdmin;
