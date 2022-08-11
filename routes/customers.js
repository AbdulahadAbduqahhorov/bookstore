const helpers = require('../helpers/helpers')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')
let idCounter = 0


router.use(bodyParser.json())





router.get('/', (req, res) => {
    let customers = helpers.readFromJSONFile("customers.json")
    let search = req.query.search
    if (!search) {
        search=""
    }

    let custom = customers.filter(obj =>
        obj.firstname.toLowerCase().includes(search.toLowerCase()) || obj.lastname.toLowerCase().includes(search.toLowerCase())
    )
    if (custom.length == 0) {
        res.status(404).send("customers resource not found!")
        return
    }

    res.json(custom)

})

router.get('/:id', (req, res) => {
    let customers = helpers.readFromJSONFile("customers.json")
    const id = req.params.id
    const customer = customers.find(c => c.id === parseInt(id))
    if (!customer) return res.status(404).send(`The customer with id of ${id} not found `)
    res.json(customer)
})

router.post('/', (req, res) => {
    let customers = helpers.readFromJSONFile("customers.json")
    const { error } = validate_customer(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    const customer = {
        id: idCounter += 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth,
        address: req.body.address,
        created_at: new Date(),
        updated_at: new Date()

    }
    customers.push(customer)
    helpers.saveInJSONFile(customers, "customers.json")
    res.send("ok")

})
router.put('/:id', (req, res) => {
    let customers = helpers.readFromJSONFile("customers.json")
    let id = req.params.id
    const customer = customers.find(c => c.id === parseInt(id))
    if (!customer) return res.status(404).send(`The customer with id of ${id} not found `)

    const { error } = validate_customer(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    customer.firstname = req.body.firstname,
        customer.lastname = req.body.lastname,
        customer.email = req.body.email,
        customer.phone = req.body.phone,
        customer.date_of_birth = req.body.date_of_birth,
        customer.address = req.body.address,
        customer.created_at = customer.created_at,
        customer.updated_at = new Date()


    helpers.saveInJSONFile(customers, "customers.json")
    res.send(customer)

})

router.delete('/:id', (req, res) => {
    let customers = helpers.readFromJSONFile("customers.json")
    const id = req.params.id
    const customer = customers.find(c => c.id === parseInt(id))
    if (!customer) return res.status(404).send(`The customer with id of ${id} not found `)

    const index = customers.indexOf(customer)
    customers.splice(index, 1)
    helpers.saveInJSONFile(customers, "customers.json")
    res.send(customer)

})


function validate_customer(customer) {
    const schema = Joi.object({
        firstname: Joi.string().min(3).required(),
        lastname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        date_of_birth: Joi.string().required(),
        address: Joi.string().required(),


    })
    return validate = schema.validate(customer)

}



module.exports = router


