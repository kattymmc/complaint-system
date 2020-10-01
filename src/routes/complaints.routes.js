const { Router } = require('express');
const router = Router();

const { 
    renderComplaintform,
    createNewComplaint,
    renderComplaints,
    renderComplaintsNotProcess,
    renderComplaintsInProcess,
    renderComplaintsClosed,
    renderComplaintDetails,
    renderComplaintDetailsAdmin,
    renderComplaintTakeAction,
    renderComplaintDashboard,
    deleteComplaint,
    updateComplaint
} = require('../controllers/complaints.controller');
const { isAuthenticated } = require('../helpers/auth');

//New complaint
router.get('/complaints/add',isAuthenticated, renderComplaintform); //get: pedir
router.post('/complaints/new-complaint',isAuthenticated, createNewComplaint); //post: recibir

//Get all complaints
router.get('/complaints/not-process',isAuthenticated, renderComplaintsNotProcess);
router.get('/complaints/in-process',isAuthenticated, renderComplaintsInProcess);
router.get('/complaints/closed',isAuthenticated, renderComplaintsClosed);
router.get('/complaints',isAuthenticated, renderComplaints);
router.get('/dashboard-complaints',isAuthenticated, renderComplaintDashboard);

//Edit notes
router.get('/complaints/details/:id',isAuthenticated ,renderComplaintDetails);
router.get('/complaints/details-admin/:id',isAuthenticated, renderComplaintDetailsAdmin);
router.get('/complaints/take-action/:id',isAuthenticated, renderComplaintTakeAction);
router.put('/complaints/edit/:id',isAuthenticated, updateComplaint); //put: actualizar

//Delete notes
router.delete('/complaints/delete/:id', isAuthenticated, deleteComplaint); //delete: eliminar

module.exports = router;