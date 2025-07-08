const express = require('express');
const router = express.Router();
const formeController = require('../controllers/formeController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.post(
  '/',
  auth,
  checkPermission('formes', 'create'),
  formeController.createForme
);

router.get(
  '/',
  auth,
  checkPermission('formes', 'read'),
  formeController.getFormes
);

router.get(
  '/:id',
  auth,
  checkPermission('formes', 'read'),
  formeController.getFormeById
);

router.put(
  '/:id',
  auth,
  checkPermission('formes', 'update'),
  formeController.updateForme
);

router.delete(
  '/:id',
  auth,
  checkPermission('formes', 'delete'),
  formeController.deleteForme
);

module.exports = router;
