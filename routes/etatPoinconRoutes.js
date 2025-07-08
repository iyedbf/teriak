const express = require('express');
const router = express.Router();  
const controller = require('../controllers/etatPoinconController');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.post('/', verifyToken, checkPermission('etatpoincons', 'create'), controller.createEtat);
router.get('/', verifyToken, checkPermission('etatpoincons', 'read'), controller.getEtats);
router.put('/:id', verifyToken, checkPermission('etatpoincons', 'update'), controller.updateEtat);
router.delete('/:id', verifyToken, checkPermission('etatpoincons', 'delete'), controller.deleteEtat);

module.exports = router;
