const { Router } = require('express');
const { verificarJWT } = require('../middlewares/validarJWT');
const { dashboardManager } = require('../controllers/manager.controller');

const router = Router();


router.get('/dashboard', [verificarJWT], dashboardManager);

module.exports = router;