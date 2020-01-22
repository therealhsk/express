const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res, next) => {
        res.end('Will send all the promotions to you');
    })

    .post((req, res, next) => {
        res.end('Will add the promotion: ' + req.body.name + ' with the details: ' + req.body.description);
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /promotions')
    })

    .delete((req, res, next) => {
        res.end('Deleting all the promotions')
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        res.end('Will send the details of the promo: ' + req.params.promoId + ' to you');
    })

    .post((req, res, next) => {
        res.end('POST operation is not supported on /promotions/' + req.params.promoId);
    })

    .put((req, res, next) => {
        res.write("Updating the promo: " + req.params.promoId + '\n');
        res.end("Will update the promo " + req.params.promoId + " with promotions: " + req.body.description);
    })

    .delete((req, res, next) => {
        res.end("Deleting promo: " + req.params.promoId);
    });

module.exports = promoRouter;