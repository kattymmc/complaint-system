const { Router } = require('express');
const router = Router();
const { 
    renderServices,
    createNewService,
    renderServicesForm,
    renderServicesEditForm,
    updateService,
    deleteService
} = require('../controllers/services.controller');
const { isAuthenticated } = require('../helpers/auth');

//Render category form and all categories
router.get('/services',isAuthenticated ,renderServices);
router.get('/services/form',isAuthenticated ,renderServicesForm);
router.get('/services/edit/:id',isAuthenticated ,renderServicesEditForm);

router.post('/services/new-service', createNewService); //post: recibir
router.put('/services/edit/:id',isAuthenticated, updateService); //put: actualizar
router.delete('/services/delete/:id', isAuthenticated, deleteService); //delete: eliminar

module.exports = router;