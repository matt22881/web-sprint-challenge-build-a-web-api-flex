// Write your "actions" router here!

const express = require('express')

const Actions = require('./actions-model')
const { validateActions, validateActionsId } = require('./actions-middlware')
const router = express.Router()

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            res.status(500).json({ message: 'There was and error GETing the actions', error: err })
        })
})

router.get('/:id', (req, res) => {
    Actions.get(req.params.id)
        .then(action => {
            if (!action) {
                res.status(404).json({ message: `Error, action ID# ${req.params.id} does not exist in the database.` })
            } else res.status(200).json(action)
        })
        .catch(err => {
            res.status(500).json({ message: `There was an error GETing the action with ID# ${req.params.id}`, error: err })
        })
})

router.post('/', (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: `Error: no request body` })
    } else {
        if (!req.body.notes || !req.body.description || !req.body.project_id) {
            res.status(400).json({ message: 'Request body missing required field(s)' })
        } else {
            Actions.insert(req.body)
                .then(action => {
                    res.status(200).json(action)
                })
                .catch(err => {
                    res.status(500).json({ message: `There was an error POSTing the action: ${res.body}`, error: err })
                })
        }
    }
})

router.put('/:id', validateActions, validateActionsId, (req, res) => {
    Actions.update(req.params.id, req.body)
        .then(project => {
            res.json(project)
        })
        .catch(err => {
            res.status(500).json({ message: `There was an error upadting the action: \n ${res.body}`, error: err })
        })
})






router.delete('/:id', (req, res) => {
    Actions.remove(req.params.id)
        .then(del => {
            if (del === 0) {
                res.status(404).json({ message: `Error: Action ID# ${req.params.id} does not exist in the database` })
            } else {
                res.status(200).json({ message: `The action with ID# ${req.params.id} has been deleted`, deleted: del })
            }
        })
        .catch(err => {
            res.status(500).json({ message: `There was an error deleting action ID# ${req.params.id}`, error: err })
        })
})

module.exports = router