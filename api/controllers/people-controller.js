const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const passport = require('passport');
const PeopleModel = mongoose.model('Peoples');

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
            req.peopleId = decoded._id;
            req.peoplePeoplename = decoded.peoplename;
            next();
        })
    },

    get_all_peoples: async (req, res, next) => {
        try {
         
          const peoples = await PeopleModel.find({people: req.peopleId}).select();
        
          res.status(200).json({
            count: peoples.length,
            peoples: peoples.map(people => {
              return {
                peoplename: people.peoplename,
                acesso: people.acesso,
                _id: people._id,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/peoples/" + people._id
                }
              }
            })
          });
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      delete_by_id_peoples: async (req, res, next) => {
        const id = req.params.peopleId;
        try {
          let status = await PeopleModel.deleteOne({_id: id});
      
          res.status(200).json({
              message: 'Delete people',
              status: status
          })
      
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      get_by_id_peoples: async (req, res, next) => {
        
        try {
          let people = await PeopleModel.findById(req.params.peopleId);
          if(people){
            res.status(200).json(people);
          }else{
            res.status(404).json("Pessoa não existe!"); 
          }
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      create_people: async (req, res, next) => {
        try {          
          let people = new PeopleModel({
            
          });
          people.name = req.body.name;
          people.aliasname = req.body.aliasname;
          people.phone = req.body.phone;
          people.email = req.body.email;
          people.status = req.body.status;
          people = await people.save();
          
          res.status(201).json({
            message: 'Created people successfully',
            createdPeople: {
                name: people.name,
                _id: people._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/peoples/" + people._id
                }
            }
          });
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
     
      
}