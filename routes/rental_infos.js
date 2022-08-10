const helpers = require('../helpers/helpers')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')



router.use(bodyParser.json())


var rental_infos = []
rental_infos = helpers.readFromJSONFile("rental_infos.json")
customers = helpers.readFromJSONFile("customers.json")
books = helpers.readFromJSONFile("books.json")
router.get('/', (req, res) => {

    res.json(rental_infos)



})

router.post('/', (req, res) => {
    const { error } = validate_infos(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    let customer_id = parseInt(req.body.customer_id)
    let book_id = parseInt(req.body.book_id)

    const customer = customers.find(c => c.id === customer_id)
    if(!customer){
        res.status(400).send(`There is no customer with given id : ${customer_id} `)
        return
    }
    const book = books.find(c => c.id === book_id)
    if(!book){
        res.status(400).send(`There is no book with given id : ${book_id} `)
        return
    }


    for (let i = 0; i < rental_infos.length; i++) {
        const element = rental_infos[i];
        if (element.customer_id == customer_id && element.book_id == book_id) {
            res.status(400).send(`customer_id:${customer_id} already has been booked  book that id is:${book_id}!`);
            return
        }
    }

    const rental_info = {
        customer_id: req.body.customer_id,
        book_id: req.body.book_id,
        booked_day: req.body.booked_day,
        returned_day: req.body.returned_day,
        created_at: new Date(),
        updated_at: new Date()
    }
    rental_infos.push(rental_info)
    helpers.saveInJSONFile(rental_infos, "rental_infos.json")
    res.send("Created")

   
       

    }
  

)
// router.put('/:id', (req, res) => {
//     let id = req.params.id
//     const customer = customers.find(c => c.id === parseInt(id))
//     if (!customer) return res.status(404).send(`The customer with id of ${id} not found `)

//     const { error } = validate_infos(req.body)
//     if (error) {
//         res.status(400).send(error.details[0].message)
//         return;
//     }
//         customer.firstname = req.body.firstname,
//         customer.lastname = req.body.lastname,
//         customer.email = req.body.email,
//         customer.phone = req.body.phone,
//         customer.date_of_birth = req.body.date_of_birth,
//         customer.address = req.body.address,
//         customer.created_at = customer.created_at,
//         customer.updated_at = new Date()


//     helpers.saveInJSONFile(customers, "customers.json")
//     res.send(customer)

// })

router.delete('/:cid/:bid', (req, res) => {

    const customer_id = req.params.cid
    const book_id = req.params.bid

        // const customer = customers.find(c => c.id === customer_id)
        // if(!customer){
        //     res.status(400).send(`There is no customer with given id : ${customer_id} `)
        //     return
        // }
        // const book = books.find(c => c.id === book_id)
        // if(!book){
        //     res.status(400).send(`There is no book with given id : ${book_id} `)
        //     return
        // }

        if (!customer_id) {
            res.status(400).send("customer_id is required");
            return
        }
    
        if (!book_id) {
            res.status(400).send("book_id is required");
            return
        }
    
        let info = rental_infos.find(e => e.customer_id == customer_id && e.book_id == book_id )
        if (!info) {
            res.status(400).send(`customer_id:${customer_id} doesn't have the book of book_id:${book_id}!`);
            return
        }

    const index = rental_infos.indexOf(info)
    rental_infos.splice(index, 1)
    helpers.saveInJSONFile(rental_infos, "rental_infos.json")
    res.status(200).send("successfully deleted")

})

router.get('/:sid', (req, res)=> {
    let customer_id = parseInt(req.params.sid)
    
    let customer = customers.find(e => e.id == customer_id)

    if (!customer_id) {
        res.status(400).send("customer_id is required");
        return
    }

    let customerBookList = rental_infos.filter(e => e.customer_id == customer_id)
    if (!customerBookList.length) {
        res.status(400).send(`customer_id:${customer_id} doesn't have books`);
        return
    }
    
    customerBookList.forEach(e => {
        for (let i = 0; i < books.length; i++) {
            if (e.book_id == books[i].id) {
                e.book = books[i]
                break
            }
        }
    });

    res.json({books: customerBookList, customer: customer})
})


function validate_infos(customer) {
    const schema = Joi.object({
        customer_id: Joi.number().required(),
        book_id: Joi.number().required(),
        booked_day: Joi.date().required(),
        returned_day: Joi.date().required(),
      
        

    })
    return validate = schema.validate(customer)

}



module.exports = router


