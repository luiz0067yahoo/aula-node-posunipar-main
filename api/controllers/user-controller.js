const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const passport = require('passport');
const UserModel = mongoose.model('User');

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
            req.userId = decoded._id;
            req.userUsername = decoded.username;
            next();
        })
    },

    get_all_users: async (req, res, next) => {
        try {
          const usuarioLogado = await UserModel.findById(req.userId);
          if (usuarioLogado.acesso != "Admin") {
            res.status(401).json({message: "Usuario não permitido"});
            return;
          }
          const users = await UserModel.find({user: req.userId}).select("username acesso");
        
          res.status(200).json({
            count: users.length,
            users: users.map(user => {
              return {
                username: user.username,
                acesso: user.acesso,
                _id: user._id,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/users/" + user._id
                }
              }
            })
          });
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      get_by_id_users: async (req, res, next) => {
        const id = req.params.userId;
        try {
          let status = await UserModel.deleteOne({_id: id});
      
          res.status(200).json({
              message: 'Delete user',
              status: status
          })
      
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      get_info_users: async (req, res, next) => {
        
        try {
          let user = await UserModel.findById(req.userId);
          if(user){
            res.status(200).json(user);
          }else{
            res.status(404).json("Usuário não existe!"); 
          }
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      signup_user: async (req, res, next) => {
        try {
      
          let user = new UserModel({});
          user.username = req.body.username;
          user.name = req.body.name;
          //password: req.body.password
          user.setPassword(req.body.password);
          
          user = await user.save();
          res.status(201).json({
            message: 'Created user successfully',
            createdUser: {
                username: user.username,
                _id: user._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/users/" + user._id
                }
            }
          })
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      login_user: function(req, res, next){
        if(!req.body.username || !req.body.password){
          return res.status(400).json({message: 'Por favor, preencha todos os campos'});
        }
      
        passport.authenticate('local', function(err, user, info){
          if(err){ return next(err); }
      
          if(user){
            return res.json({token: user.generateJWT()});
          } else {
            return res.status(401).json(info);
          }
        })(req, res, next);
      }
}