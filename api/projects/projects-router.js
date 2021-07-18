// Write your "projects" router here!
const express = require('express')

const Projects = require('./projects-model')
const { validateProject, validateProjectId, validateProjectPut } = require('./projects-middleware')

const router = express.Router()

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({ message: 'There was and error GETing the projects', error: err })
        })
})

router.get('/:id', validateProjectId, (req, res) => {
    Projects.get(req.params.id)
        .then(project => {
            if (!project) {
                res.status(404).json({ message: `Error, project ID# ${req.params.id} does not exist in the database.` })
            } else {
                res.status(200).json(project)
            }
        })
        .catch(err => {
            res.status(500).json({ message: `There was an error GETing the project with ID# ${req.params.id}`, error: err })
        })
})

router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.params.id)
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            res.status(500).json({ message: `there was an error retrieving the actions for project ID# ${req.params.id}`, error: err })
        })
})

router.post('/', validateProject, (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: `Error: no request body` })
    } else {
        if (!req.body.name || !req.body.description) {
            res.status(400).json({ message: 'Request body missing required field(s)' })
        } else {
            Projects.insert(req.body)
                .then(project => {
                    res.status(200).json(project)
                })
                .catch(err => {
                    res.status(500).json({ message: `There was an error POSTing the project: \n ${res.body}`, error: err })
                })
        }
    }
})

router.put('/:id', validateProjectPut, validateProjectId, (req, res) => {
    Projects.update(req.params.id, req.body)
        .then(project => {

            console.log('project: ', project)
            res.json(project)
        })
        .catch(err => {
            res.status(500).json({ message: `There was an error upadting the project: \n ${res.body}`, error: err })
        })
})

router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.params.id)
        .then(del => {
            if (del === 0) {
                res.status(404).json({ message: `Error: Project ID# ${req.params.id} does not exist in the database` })
            } else {
                res.status(200).json({ message: `The project with ID# ${req.params.id} has been deleted`, deleted: del })
            }
        })
        .catch(err => {
            res.status(500).json({ message: `There was an error deleting project ID# ${req.params.id}`, error: err })
        })
})

module.exports = router