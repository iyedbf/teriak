import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./user-create.css"; // ✅ Import du style

const UserCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    login: '',
    motDePasse: '',
    email: '',
    role: 'Agent',
    statut: 'actif',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  return (
    <div className="user-create-wrapper">
      <div className="user-create-card">
<h2 className="form-title">Ajouter un utilisateur</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          {['nom', 'prenom', 'login', 'motDePasse', 'email'].map(field => (
            <div key={field} className="mb-3">
              <label className="form-label">{field}</label>
              <input
                type={field === 'motDePasse' ? 'password' : 'text'}
                name={field}
                className="form-control"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="mb-3">
            <label>Rôle</label>
            <select name="role" className="form-select" onChange={handleChange} value={formData.role}>
              <option>Administrateur</option>
              <option>Superviseur</option>
              <option>Agent</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Statut</label>
            <select name="statut" className="form-select" onChange={handleChange} value={formData.statut}>
              <option>actif</option>
              <option>inactif</option>
            </select>
          </div>
<button type="submit" className="btn-teal">Créer</button>
        </form>
      </div>
    </div>
  );
};

export default UserCreate;
