const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const passport = require('passport');
const AddressModel = mongoose.model('Addresses');

module.exports = {
    verifyJWT: function (req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401)
                  .json({ 
                      auth: false, 
                      message: 'Token não informado.'
                  });
        }

        jwt.verify(token, 'SECRET', function(err, decoded) {
            if (err) {
                return res.status(401)
                .json({ 
                    auth: false, 
                    message: 'Falha na autenticação do token.'
                });
            }
            req.addressId = decoded._id;
            req.addressAddressname = decoded.addressname;
            next();
        })
    },

    get_all_addresses: async (req, res, next) => {
        try {
         
          const addresses = await AddressModel.find({address: req.addressId}).select();
        
          res.status(200).json({
            count: addresses.length,
            addresses: addresses.map(address => {
              return {
                addressname: address.addressname,
                acesso: address.acesso,
                _id: address._id,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/addresses/" + address._id
                }
              }
            })
          });
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      delete_by_id_address: async (req, res, next) => {
        const id = req.params.addressId;
        try {
          let status = await AddressModel.deleteOne({_id: id});
      
          res.status(200).json({
              message: 'Delete address',
              status: status
          })
      
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      get_by_id_address: async (req, res, next) => {
        
        try {
          let address = await AddressModel.findById(req.params.addressId);
          if(address){
            res.status(200).json(address);
          }else{
            res.status(404).json("Endereço não existe!"); 
          }
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      create_address: async (req, res, next) => {
          try {          
          let address = new AddressModel({
            
          });
          const PeopleModel = mongoose.model('Peoples');
          let people = await PeopleModel.findById(req.body.people_id);
          if(people){
            address.people_id = req.body.people_id;
            address.zipcode = req.body.zipcode;
            address.street = req.body.street;
            address.house_number = req.body.house_number;
            address.complement = req.body.complement;
            address.district = req.body.district;
            address.city = req.body.city;
            address.state = req.body.state;
            address = await address.save();
            
            res.status(201).json({
              message: 'Created address successfully',
              createdAddress: {
                  name: address.name,
                  _id: address._id,
                  request: {
                      type: "GET",
                      url: "http://localhost:3000/addresses/" + address._id
                  }
              }
            });
          }else{
            res.status(404).json("Pessoa não  existe!"); 
          }
            
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
}