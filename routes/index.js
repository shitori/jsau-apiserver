'use strict'
const express = require('express')
const router = new express.Router()
const controller = require('../controllers/controller')

router.get('/', controller.test)

router.get('/enquetes', controller.getEnqs)

router.get('/enquetes/:id', controller.getEnq)

router.put('/enquetes/:id', controller.modifEnq)

router.post('/enquetes', controller.createEnq)

router.delete('/enquetes/:id', controller.removeEnq)

router.post('/enquetes/:id/resultats', controller.createRes)

router.get('/enquetes/:id/resultats', controller.getRes)

router.post('/enquetes/:id/question', controller.createQst)

router.delete('/enquetes/:id/question/:idq', controller.removeQst)

router.put('/enquetes/:id/question/:idq', controller.modifQst)

router.get('/info', controller.info)

module.exports = router
