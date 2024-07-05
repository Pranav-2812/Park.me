const express = require("express");
const router = express.Router()
const Locations = require("../models/Locations");
const User = require("../models/Users");
const getuser  = require("../middleware/getuser");
const City = require("../models/Cities");
const Transactions = require("../models/Transactions");
const carSlot = require("../models/CarSlots");
const bikeSlot = require("../models/BikeSlot");
//user specific search ,login required
router.get("/isAvailable/:id",getuser,async(req,res)=>{
   try {
    let user;
    if(req.params.id !==undefined){
        user =await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({success:false,msg:"User not found"});
        }
    }
    else{return res.json({success:false,msg:"Please reload the window"})}
    let cities = await City.findOne({name:user.city});
    if(!cities){
        return res.json({success:false,msg:"Sorry, No locations available in your city",user,cities});
    }
    let location = await Locations.find({city:user.city});
    
    res.status(200).json({success:true,cities,location});
    }
    catch (error) {
    console.log(error)
    res.json({success:false,msg:"Some Error occured"});
   }

});
//general search
router.get("/isAvailable",async(req,res)=>{
    const {city_name} = req.body;
    try {
        let city = await City.findOne({name:city_name});
        if(!city){
            return res.json({success:false,msg:"Sorry, No locations available in your city"});
        }
        let location = await Locations.find({city:city_name});
        res.status(200).json({success:true,location});
    } catch (error) {
        console.log(error);
        res.json({success:false,msg:"Some Error occured"});
    }
})
//get parking location status
router.get("/location/status/:id",getuser,async(req,res)=>{
    
    try {
        if(req.params.id === null){
            console.log("sahi hai")
            return res.json({success:false,msg:"Please refresh"});
        }
        let user = await User.findById(req.user.id);
        if(!user){
            return res.json({success:false,msg:"user not found"});
        }
        let vehicle;
        if(user.vehicle_type==="car"){
            if(req.params.id === null){
                console.log("sahi hai")
                return res.json({success:false,msg:"Please refresh"})
            }
            vehicle = await carSlot.find({location:req.params.id})
            if(!vehicle){
                return res.json({success:false,msg:"some error occured"})
            }
            return res.status(200).json({success:true,vehicle});
        }
        if(user.vehicle_type ==="bike"){
            if(req.params.id === null){
                console.log("sahi hai")
                return res.json({success:false,msg:"Please refresh"})
            }
            vehicle = await bikeSlot.find({location:req.params.id})
            if(!vehicle){
                return res.json({success:false,msg:"some error occured"})
            }
            return res.status(200).json({success:true,vehicle});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,msg:"Some Error occured"});
    }
})
//book a slot ,login required
router.post("/book/slot/:id",getuser,async(req,res)=>{
    const { duration}= req.body;
    
     try {
        let user = await User.findById(req.user.id);
        if(!user){
            return res.json({success:false,msg:"Some error occured"});
        }
        let slot;
        let charges;
        if(user.vehicle_type ==="car"){
            slot = await carSlot.findById(req.params.id);
            
            if(!slot){
                return res.json({success:false,msg:"Some error occured"});
            }
            charges = 1*duration;
            slot = await carSlot.findByIdAndUpdate(slot.id,{isAvailable:false},{new:true});
            
        }
        if(user.vehicle_type ==="bike"){
            
            slot = await bikeSlot.findById(req.params.id);
            if(!slot){
                return res.json({success:false,msg:"Somr error occured"});
            }
            charges = 0.5*duration;
            slot = await bikeSlot.findByIdAndUpdate(slot.id,{isAvailable:false,duration:duration},{new:true});
        }
        let location = await Locations.findById(slot.location);
        let transaction = await Transactions.create({
            name :user.id,
            email:user.email,
            Mob_No:user.Mob_no,
            duration:duration,
            location:slot.location,
            slot_no:slot.id,
            charges:charges,
            vehicle_type:user.vehicle_type,
            vehicle_number:user.vehicle_number,
            city:location.city,
            date: new Date().getDate()

        });
        res.status(200).json({success:true,transaction,slot});
    } catch (error) {
        console.log(error);
        res.json({success:false,msg:"Some Error occured"});
    }
});
router.post("/location/slot/update/:id",getuser,async(req,res)=>{
    try {
        const {duration} = req.body;
        let user = await User.findById(req.user.id);
        if(!user){
            return res.json({success:false,msg:"Not Authorized"});
        }
        if(user.vehicle_type ==="car"){
           let  slot = await carSlot.findByIdAndUpdate(req.params.id,{isAvailable:true,duration:duration},{new:true});
            return res.status(200).json({success:true,msg:"slot updated",slot});
        }
        if(user.vehicle_type ==="bike"){
           let slot = await bikeSlot.findByIdAndUpdate(req.params.id,{isAvailable:true,duration:duration},{new:true});
            return res.status(200).json({success:true,msg:"slot updated",slot});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,msg:"Some Error occured"});
    }
})
module.exports = router;