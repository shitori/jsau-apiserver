'use strict'

const model = require('../models/model')

function delOrPutIssue(res) {
    return (err, data) => {
        if (!err) {
            res.status(200).json({status: data})
        } else {
            res.status(404).json({error: err})
        }
    }
}

module.exports = {
    test: (req, res) => {
        model.test((err, data) => {
            /* istanbul ignore next */
            if (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            }
            res.status(200).json({test: 'TEST jtest', enquetes: data.e, questions: data.q, resultats: data.r})
        })
    },
    getEnqs: (req, res) => {
        model.getAllEnq((err, data) => {
            /* istanbul ignore next */
            if (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            }
            res.status(200).json(data)
        })
    },
    getEnq: (req, res) => {
        model.getEnq(req.params.id, (err, data) => {
            if (err) {
                res.status(404).json({error: err})
            } else {
                res.status(200).json(data)
            }
        })
    },
    getRes: (req, res) => {
        model.getRes(req.params.id, (err, data) => {
            if (err) {
                res.status(404).json({error: err})
            } else {
                res.status(200).json(data)
            }
        })
    },
    createEnq: (req, res) => {
        model.addEnq(req.body.enq, req.body.ques, (err, data) => {
            if (!err) {
                res.status(201).json({
                    message: 'Enquete créer avec l\'id: ' + data.idEnq,
                    id_enquete: data.idEnq,
                    id_questions: data.idQsts
                })
            } else {
                res.status(409).json({error: err})
            }
        })
    },
    createQst: (req, res) => {
        model.addQst(req.params.id, req.body.secret, req.body.qst, (err, data) => {
            if (!err) {
                res.status(201).json({status: data.message, id_question: data.idQst})
            } else {
                res.status(404).json({error: err})
            }
        })
    },
    createRes: (req, res) => {
        model.addRes(req.params.id, req.body.res, (err, data) => {
            if (!err) {
                res.status(201).json({status: data})
            } else {
                res.status(409).json({error: err})
            }
        })
    },
    removeEnq: (req, res) => {
        model.removeEnq(req.params.id, req.body.secret, delOrPutIssue(res))
    },
    modifEnq: (req, res) => {
        model.modifEnq(req.params.id, req.body.secret, req.body.titre, req.body.description, delOrPutIssue(res))
    },
    removeQst: (req, res) => {
        model.removeQst(req.params.id, req.body.secret, req.params.idq, delOrPutIssue(res))
    },
    modifQst: (req, res) => {
        model.modifQst(req.params.id, req.body.secret, req.params.idq, req.body.titre, req.body.reponse, delOrPutIssue(res))
    },
    info: (req, res) => {
        res.status(200).send('jsau-apiserver-1.0.0')
    }

}
