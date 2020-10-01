const complaintsCtrl = {};

const Complaint = require('../models/Complaint');
const Service = require('../models/Service');
const User = require('../models/User');

complaintsCtrl.renderComplaintDashboard = async (req,res) =>{
    var complaintsCount;
    if(req.user.role == "Admin"){
        complaintsCount = await Complaint.aggregate([
            {'$group': {
                '_id': "$status" ,
                'count': { $sum : 1 }
              }}]);
    }else{
        complaintsCount = await Complaint.aggregate([
            {'$match': {'user': req.user.id}},
            {'$group': {
                '_id': "$status" ,
                'count': { $sum : 1 }
              }}]);
    }
    console.log(complaintsCount);
    res.render('complaints/dashboard-complaints', { complaintsCount });
};

complaintsCtrl.renderComplaintform = async (req,res) =>{
    var services;
    services = await Service.find().lean(); 
    res.render('complaints/new-complaint', { services });
};

complaintsCtrl.createNewComplaint = async (req,res) =>{
    const {name, service, priority, description} = req.body;
    const newComplaint = new Complaint({name, service, priority, description});
    newComplaint.status = "Not Processed Yet";
    newComplaint.user = req.user.id;
    console.log(newComplaint);
    await newComplaint.save(); //guarda en mongodb
    req.flash('success_msg', 'Complaint Added Successfully');
    res.redirect('/complaints');
};

complaintsCtrl.renderComplaints = async (req,res) =>{
    var complaints;
    if(req.user.role == "Admin"){
        complaints = await Complaint.find().lean();  //buscar todas las notas
    }else{
        complaints = await Complaint.find({user: req.user.id}).lean(); //buscar todas las notas
        complaints.forEach( 
            async function(obj) { 
                newDateCreate = obj.createdAt.toString().substring(0, 24);
                newDateUpdate = obj.updatedAt.toString().substring(0, 24);
                obj.createdAt = newDateCreate;
                obj.updatedAt = newDateUpdate;
            });
    }
    res.render('complaints/all-complaints', { complaints });
};

complaintsCtrl.renderComplaintsNotProcess = async (req,res) =>{  
    if(req.user.role != "Admin"){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/complaints');
    }
    var complaints;
    complaints = await Complaint.find({status: 'Not Processed Yet'}).lean(); 
    complaints.forEach( 
        async function(obj) { 
            userComplainant = await User.findById(obj.user);
            obj.complainant = userComplainant.name;
            newDateCreate = obj.createdAt.toString().substring(0, 24);
            newDateUpdate = obj.updatedAt.toString().substring(0, 24);
            obj.createdAt = newDateCreate;
            obj.updatedAt = newDateUpdate;

        });
    console.log(complaints);
    res.render('complaints/notprocess-complaint', { complaints });
};

complaintsCtrl.renderComplaintsInProcess = async (req,res) =>{
    if(req.user.role != "Admin"){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/complaints');
    }
    var complaints;
    complaints = await Complaint.find({status: 'In Process'}).lean(); 
    complaints.forEach( 
     async function(obj) { 
         userComplainant = await User.findById(obj.user);
         obj.complainant = userComplainant.name;
         newDateCreate = obj.createdAt.toString().substring(0, 24);
         newDateUpdate = obj.updatedAt.toString().substring(0, 24);
         obj.createdAt = newDateCreate;
         obj.updatedAt = newDateUpdate;

    });
    res.render('complaints/inprocess-complaint', { complaints })
};
complaintsCtrl.renderComplaintsClosed = async (req,res) =>{
    if(req.user.role != "Admin"){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/complaints');
    }
    var complaints;
      complaints = await Complaint.find({status: 'Closed'}).lean(); 
      complaints.forEach( 
        async function(obj) { 
            userComplainant = await User.findById(obj.user);
            obj.complainant = userComplainant.name;
            newDateCreate = obj.createdAt.toString().substring(0, 24);
            newDateUpdate = obj.updatedAt.toString().substring(0, 24);
            obj.createdAt = newDateCreate;
            obj.updatedAt = newDateUpdate;
        });
    res.render('complaints/closed-complaint', { complaints })
};

complaintsCtrl.renderComplaintDetails = async (req,res) =>{
    const complaint = await Complaint.findById(req.params.id).lean();
    const service = await Service.findById(complaint.service).lean();
    res.render('complaints/complaint-details',{ complaint , service });
};
complaintsCtrl.renderComplaintDetailsAdmin = async (req,res) =>{
    if(req.user.role != "Admin"){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/complaints');
    }
    const complaint = await Complaint.findById(req.params.id).lean();
    const userComplainant = await User.findById(complaint.user).lean();
    //complaint.complainant = userComplainant.name;
    const service = await Service.findById(complaint.service).lean();
    res.render('complaints/complaint-details-admin',{ complaint, service, userComplainant})
};
complaintsCtrl.renderComplaintTakeAction = async (req,res) =>{
    if(req.user.role != "Admin"){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/complaints');
    }
    const complaint = await Complaint.findById(req.params.id).lean();
    res.render('complaints/takeaction-complaint', {complaint});
};

complaintsCtrl.updateComplaint = async (req,res) =>{
    const {status, remark} = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, {status, remark});
    req.flash('success_msg', 'Complaint Updated Successfully');
    res.redirect('/complaints/not-process');
};

complaintsCtrl.deleteComplaint = (req,res) =>{
    res.send("Complaint deleted");
};

module.exports = complaintsCtrl;