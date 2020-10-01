const servicesCtrl = {};

const Service = require('../models/Service');
const Complaint = require('../models/Complaint');

servicesCtrl.createNewService = async (req,res) =>{
    const {name, description} = req.body;
    const newService = new Service({name, description});
    await newService.save(); //guarda en mongodb
    req.flash('success_msg', 'Service Added Successfully');
    console.log(newService);
    res.redirect('/services');
};

servicesCtrl.renderServices = async (req,res) =>{
    if(req.user.role != "Admin"){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/complaints');
    }
    var services;
    services = await Service.find().sort().lean(); 
    services.forEach( 
        async function(obj) { 
            newDateCreate = obj.createdAt.toString().substring(0, 24);
            newDateUpdate = obj.updatedAt.toString().substring(0, 24);
            obj.createdAt = newDateCreate;
            obj.updatedAt = newDateUpdate;
        });
    res.render('services/all-services', { services })
};

servicesCtrl.renderServicesForm = async (req,res) =>{
    if(req.user.role != "Admin"){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/complaints');
    }
    res.render('services/new-service')
};

servicesCtrl.renderServicesEditForm = async (req,res) =>{
    const service = await Service.findById(req.params.id).lean();
    if(req.user.role != "Admin"){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/complaints');
    }
    res.render('services/edit-service', { service })
};

servicesCtrl.updateService = async (req,res) =>{
    const {name, description} = req.body;
    await Service.findByIdAndUpdate(req.params.id, {name, description});
    req.flash('success_msg', 'Service Updated Successfully');
    res.redirect('/services');
};

servicesCtrl.deleteService = async (req,res) =>{
    await Service.findByIdAndDelete(req.params.id);
    await Complaint.deleteMany({'service': req.params.id});
    req.flash('success_msg', 'Service Deleted Successfully');
    res.redirect('/services');
};

module.exports = servicesCtrl;