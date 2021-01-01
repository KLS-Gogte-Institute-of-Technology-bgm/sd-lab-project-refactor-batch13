const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favorites = require('../models/favorite');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites == null) {
                    Favorites.create({ user: req.user._id, dishes: req.body })
                    .populate('user')
                    .populate('dishes')
                        .then((newfavorite) => {
                            res.StatusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(newfavorite);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    for (var j = (req.body.length - 1); j >= 0; j--) {
                        var exit = false;
                        for (var i = (favorites.dishes.length - 1); i >= 0; i--) {
                            if (req.body[j]._id == favorites.dishes[i]._id)
                                exit = true;
                        }
                        if (!exit)
                            favorites.dishes.push(req.body[j]);
                    }
                    favorites.save()
                    .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
                .catch((err) => {
                    return next(err);
                });
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({ user: req.user._id })
            .then((resp) => {
                res.StatusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors,authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites == null) {
                    Favorites.create({ user: req.user._id, dishes: req.params.dishId })
                        .then((newfavorites) => {
                            console.log('Favorites Created ', newfavorites);
                            res.StatusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(newfavorites);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    var exit = false;
                    for (var i = (favorites.dishes.length - 1); i >= 0; i--) {
                        if (req.params.dishId == favorites.dishes[i]._id){

                            exit = true;
                        }
                    }
                    if (!exit) {
                        favorites.dishes.push(req.params.dishId);
                        favorites.save()
                            .then((favorites) => {
                                 Favorites.findById(favorites._id)
                                .populate('user')
                                .populate('dishes')
                                 .then((favorites) => {
                                res.StatusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            })
                             })
                            .catch((err) => {
                            return next(err);
                            });
                    }

                    else {
                        err = new Error('Dish already in your favorites!');
                        err.status = 403;
                        return next(err);
                    }
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites == null) {
                    err = new Error('favorites list is empty');
                    err.status = 404;
                    return next(err);
                }
                else {
                    favorites.dishes = favorites.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId.toString());
                    favorites.save()
                      .then((favorites) => {
                Favorites.findById(favorites._id)
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                })
            })
            .catch((err) => next(err));
    }
});
})

module.exports = favoriteRouter;