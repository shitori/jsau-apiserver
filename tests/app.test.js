'use strict'
const request = require('supertest')
const app = require('./../app')
const dataPostEnq = require('./dataJson/dataPostEnq')

let server
let id
let ids
let nidq

describe('Etats des routes', () => {

    beforeAll((done) => {
        server = app.listen(done)
    })

    afterAll((done) => {
        server.close(done)
    })

    test('GET /', async() => {
        const res = await request(server).get('/').set('Accept', 'application/json')
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)

        expect(res.body).toHaveProperty('test')
        expect(res.body).not.toHaveProperty('katoto')

    })

    test('GET /info', async() => {
        const res = await request(server).get('/info').set('Accept', 'application/json')
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/text\/html/)
    })

    test('GET /:error', async() => {
        const res = await request(server).get('/gdfnlkhjg').set('Accept', 'application/json')
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Afficher toutes mes enquetes
     */
    test('GET /enquetes', async() => {
        const res = await request(server).get('/enquetes').set('Accept', 'application/json')
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)
    })

    /**
     * Ajouter une enquete
     */
    test('POST /enquetes OK', async() => {
        const res = await request(server).post('/enquetes').set('Accept', 'application/json').send(dataPostEnq.OK)
        expect(res.statusCode).toBe(201)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('id_enquete')
        expect(res.body).toHaveProperty('id_questions')
        expect(res.body).toHaveProperty('message')

        id = res.body.id_enquete
        ids = res.body.id_questions
    })

    test('POST /enquetes KO bad enq', async() => {
        const res = await request(server).post('/enquetes').set('Accept', 'application/json').send(dataPostEnq.BadEnq)
        expect(res.statusCode).toBe(409)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    test('POST /enquetes KO bad qst', async() => {
        const res = await request(server).post('/enquetes').set('Accept', 'application/json').send(dataPostEnq.BadQst)
        expect(res.statusCode).toBe(409)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Afficher une enquete
     */
    test('GET /enquetes/:id OK', async() => {
        const res = await request(server).get('/enquetes/' + id).set('Accept', 'application/json')
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('enq')
        expect(res.body).toHaveProperty('quest')
    })

    test('GET /enquetes/:id KO', async() => {
        const res = await request(server).get('/enquetes/sdfjhsbfjhsbdjf').set('Accept', 'application/json')
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Ajouter une réponse
     */
    test('POST /enquetes/:id/resultats OK', async() => {
        const dataPostEnqId = {res: []}
        ids.forEach(idq => {
            dataPostEnqId.res.push({id_questions: idq, resultat: 'reponse test'})
        })
        const res = await request(server).post('/enquetes/' + id + '/resultats').set('Accept', 'application/json').send(dataPostEnqId)
        expect(res.statusCode).toBe(201)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('status')

    })

    test('POST /enquetes/:id/resultats KO attr', async() => {
        const dataPostEnqId = {res: []}
        ids.forEach(idq => {
            dataPostEnqId.res.push({id_questions: idq, resutat: 'reponse test'}) //resultat
        })
        const res = await request(server).post('/enquetes/' + id + '/resultats').set('Accept', 'application/json').send(dataPostEnqId)
        expect(res.statusCode).toBe(409)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    test('POST /enquetes/:id/resultats KO attr', async() => {
        const dataPostEnqId = {res: null}
        const res = await request(server).post('/enquetes/' + id + '/resultats').set('Accept', 'application/json').send(dataPostEnqId)
        expect(res.statusCode).toBe(409)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    test('POST /enquetes/:id/resultats KO BAD ID', async() => {
        const dataPostEnqId = {res: []}
        ids.forEach(idq => {
            dataPostEnqId.res.push({id_questions: 'dqshdikuq', resultat: 'reponse test'}) //resultat
        })
        const res = await request(server).post('/enquetes/' + id + '/resultats').set('Accept', 'application/json').send(dataPostEnqId)
        expect(res.statusCode).toBe(409)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Modifier une enquete
     */
    test('Put /enquetes/:id OK', async() => {
        const dataPutEnqId = {secret: 'test', titre: 'put test', description: 'put test'}
        const res = await request(server).put('/enquetes/' + id).set('Accept', 'application/json').send(dataPutEnqId)
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('status')
    })

    test('Put /enquetes/:id KO BAD Secret', async() => {
        const dataPutEnqId = {secret: 'tet', titre: 'put test'} //secret
        const res = await request(server).put('/enquetes/' + id).set('Accept', 'application/json').send(dataPutEnqId)
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Ajouter une question d'une enquete
     */
    test('Post /enquetes/:id/question OK', async() => {
        const dataPostQstId = {
            secret: 'test',
            qst: {
                titre: 'new test',
                reponse: {
                    type: 'libre'
                }
            }
        }
        const res = await request(server).post('/enquetes/' + id + '/question').set('Accept', 'application/json').send(dataPostQstId)
        expect(res.statusCode).toBe(201)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('id_question')

        nidq = res.body.id_question
    })

    test('Post /enquetes/:id/question KO BAD Secret', async() => {
        const dataPostQstId = {
            secret: 'tst', //bad secret
            qst: {
                titre: 'new test',
                reponse: {
                    type: 'libre'
                }
            }
        }
        const res = await request(server).post('/enquetes/' + id + '/question').set('Accept', 'application/json').send(dataPostQstId)
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    test('Post /enquetes/:id/question KO BAD QST', async() => {
        const dataPostQstId = {
            secret: 'test',
            qst: {
                titree: 'new test', //bad titre
                reponse: {
                    type: 'libre'
                }
            }
        }
        const res = await request(server).post('/enquetes/' + id + '/question').set('Accept', 'application/json').send(dataPostQstId)
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Modifier une question d'une enquete
     */
    test('Put /enquetes/:id/question/:idq  OK', async() => {
        const dataPutQstId = {
            secret: 'test',
            titre: 'new title test',
            reponse: {
                type: 'libre'
            }
        }
        const res = await request(server).put('/enquetes/' + id + '/question/' + nidq).set('Accept', 'application/json').send(dataPutQstId)
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('status')
    })

    test('Put /enquetes/:id/question/:idq  KO BAD ID', async() => {
        const dataPutQstId = {
            secret: 'test',
        }
        const res = await request(server).put('/enquetes/' + id + '/question/dfhskjh').set('Accept', 'application/json').send(dataPutQstId)
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Afficher résultats
     */
    test('GET /enquetes/:id/resultats OK', async() => {
        const res = await request(server).get('/enquetes/' + id + '/resultats').set('Accept', 'application/json')
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)
        const resIDQ = res.body.res.map(reponse => reponse.id_questions)
        resIDQ.forEach(r => {
            expect(ids).toContain(r)
        })
        expect(resIDQ).not.toContain(nidq)
    })

    test('GET /enquetes/:id/resultats KO BAD ID', async() => {
        const res = await request(server).get('/enquetes/qhsdkhkqs/resultats').set('Accept', 'application/json')
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Supprimer une question d'une enquete
     */
    test('DEL /enquetes/:id/question/:idq OK', async() => {
        const dataDelQstId = {
            secret: 'test',
        }
        const res = await request(server).delete('/enquetes/' + id + '/question/' + nidq).set('Accept', 'application/json').send(dataDelQstId)
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('status')
    })

    test('DEL /enquetes/:id/question/:idq KO', async() => {
        const dataDelQstId = {
            secret: 'test',
        }
        const res = await request(server).delete('/enquetes/' + id + '/question/' + nidq).set('Accept', 'application/json').send(dataDelQstId)
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

    /**
     * Supprimer une enquete
     */
    test('DEL /enquetes/:id OK', async() => {
        const dataDelEnqId = {secret: 'test'}
        const res = await request(server).delete('/enquetes/' + id).set('Accept', 'application/json').send(dataDelEnqId)
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('status')

    })

    test('DEL /enquetes/:id KO BAD ID', async() => {
        const dataDelEnqId = {secret: 'test'}
        const res = await request(server).delete('/enquetes/' + id).set('Accept', 'application/json').send(dataDelEnqId)
        expect(res.statusCode).toBe(404)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toHaveProperty('error')
    })

})

