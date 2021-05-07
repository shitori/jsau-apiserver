'use strict'
const dataPostEnq = {
    OK:{
        enq: {
            secret: 'test',
            titre: 'Enq titre test',
            description: 'Enq description test'
        },
        ques: [
            {
                titre: 'Qst 1 test',
                reponse: {
                    type: 'choix',
                    choix: [
                        'yes',
                        'no'
                    ]
                }
            },
            {
                titre: 'Qst 2 test',
                reponse: {
                    type: 'libre'
                }
            }
        ]
    },
    BadEnq:{
        enq: {
            secret: 'test',
            titre: 'Enq titre test',
            descrition: 'Enq description test' //error
        },
        ques: [
            {
                titre: 'Qst 1 test',
                reponse: {
                    type: 'choix',
                    choix: [
                        'yes',
                        'no'
                    ]
                }
            },
            {
                titre: 'Qst 2 test',
                reponse: {
                    type: 'libre'
                }
            }
        ]
    },
    BadQst:{
        enq: {
            secret: 'test',
            titre: 'Enq titre test',
            description: 'Enq description test' //error
        },
        ques: [
            {
                titre: 'Qst 1 test',
                reponse: {
                    type: 'choix',
                    choix: [
                        'yes',
                        'no'
                    ]
                }
            },
            {
                //pas de titre
                reponse: {
                    type: 'libre'
                }
            }
        ]
    },
}
module.exports = dataPostEnq
