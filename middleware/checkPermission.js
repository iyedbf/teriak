const Etatpoincon = require("../models/Etatpoincon");

const permissions = {
  Administrateur: {
    users: ['create', 'read', 'update', 'delete'],
    produits: ['create', 'read', 'update', 'delete'],
    poincons: ['create', 'read', 'update', 'delete'],
    fournisseurs: ['create', 'read', 'update', 'delete'],
    marques: ['create', 'read', 'update', 'delete'],
    etatpoincons: ['create', 'read', 'update', 'delete'], // généralement en camelCase
  },
  Superviseur: {
    users: ['read'],
    produits: ['read'],
    poincons: ['read'],
    fournisseurs: ['read'],
    marques: ['read'],
    etatpoincons: ['read'],
  },
  Agent: {
    users: [],
    produits: ['read'],
    poincons: [],
    fournisseurs: [],
    marques: [],
    etatpoincons: [],
  },
};

module.exports = function (moduleName, action) {
  return (req, res, next) => {
    const role = req.user.role;
    const allowedActions = permissions[role]?.[moduleName] || [];

    if (allowedActions.includes(action)) {
      next();
    } else {
      res.status(403).json({ message: 'Permission refusée' });
    }
  };
};
