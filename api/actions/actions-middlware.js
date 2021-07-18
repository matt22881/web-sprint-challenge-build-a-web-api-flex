// add middlewares here related to actions

const Actions = require('./../actions/actions-model')

function validateActionsId(req, res, next) {
    Actions.get(req.params.id)
        .then(resp => {
            if (resp) {
                next()
            } else res.status(404).json({ message: `Action with that ID doesn't exist in the database` })
        })
        .catch(err => {
            console.err('error validating id: ', err)
        })
}

function validateActions(req, res, next) {
    if (!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(400).json({ message: "Project Id, notes, and description required" })
    } else next()

}

module.exports = {
    validateActions,
    validateActionsId
}