const helpers = require('../helpers/helpers')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')



router.use(bodyParser.json())
router.get('/', (req, res) => {
 
    let rental_infos = helpers.readFromJSONFile("rental_infos.json")
    res.json(rental_infos)



})

router.post('/:cid/:bid/booked', (req, res) => {

    let rental_infos = helpers.readFromJSONFile("rental_infos.json")
    let books = helpers.readFromJSONFile("books.json")
    let customers = helpers.readFromJSONFile("customers.json")

    let customer_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)

    const customer = customers.find(c => c.id === customer_id)
    if (!customer) {
        res.status(400).send(`There is no customer with given id : ${customer_id} `)
        return
    }
    const book = books.find(c => c.id === book_id)
    if (!book) {
        res.status(400).send(`There is no book with given id : ${book_id} `)
        return
    }


    for (let i = 0; i < rental_infos.length; i++) {
        const element = rental_infos[i];
        if (element.book_id == book_id && element.returned_day == "") {
            res.status(400).send(`Book with id :${book_id} already has been booked `);
            return
        }
        if (element.customer_id == customer_id) {
            if (element.returned_day == "") {
                res.status(400).send("you can not take book until you return old one")
                return
            }
        }

    }

    const rental_info = {
        customer_id: customer_id,
        book_id: book_id,
        booked_day: new Date(),
        returned_day: "",
        created_at: new Date(),
        updated_at: new Date()
    }

    rental_infos.push(rental_info)
    helpers.saveInJSONFile(rental_infos, "rental_infos.json")
    res.send("Created")




}


)
router.put('/:cid/:bid/returned', (req, res) => {
    
    let rental_infos = helpers.readFromJSONFile("rental_infos.json")

    let customer_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)

    let info = rental_infos.find(e => e.customer_id == customer_id && e.book_id == book_id)
    if (!info) {
        res.status(400).send(`customer_id:${customer_id} doesn't have the book of book_id:${book_id}!`);
        return
    }
    if (info.returned_day != "") {
        res.status(400).send(`You have already returned this book`)
        return
    }
    info.returned_day = new Date()
    info.updated_at = new Date()

    helpers.saveInJSONFile(rental_infos, "rental_infos.json")
    res.send(info)

})

router.delete('/:cid/:bid', (req, res) => {
    let rental_infos = helpers.readFromJSONFile("rental_infos.json")

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

    let info = rental_infos.find(e => e.customer_id == customer_id && e.book_id == book_id)
    if (!info) {
        res.status(400).send(`customer_id:${customer_id} doesn't have the book of book_id:${book_id}!`);
        return
    }

    const index = rental_infos.indexOf(info)
    rental_infos.splice(index, 1)
    helpers.saveInJSONFile(rental_infos, "rental_infos.json")
    res.status(200).send("successfully deleted")

})

router.get('/:sid/customer', (req, res) => {
    
    let rental_infos = helpers.readFromJSONFile("rental_infos.json")
    let books = helpers.readFromJSONFile("books.json")
    let customers = helpers.readFromJSONFile("customers.json")
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

    res.json({ books_x: customerBookList, customer_x: customer })
})

// router.get('/:bid/book', (req, res) => {
//     let books = helpers.readFromJSONFile("books.json")
//     let customers = helpers.readFromJSONFile("customers.json")
//     let book_id = parseInt(req.params.bid)

//     let book = books.find(e => e.id == book_id)

//     if (!book_id) {
//         res.status(400).send("book_id is required");
//         return
//     }

//     let bookList = rental_infos.filter(e => e.book_id == book_id)
//     if (!bookList.length) {
//         res.status(400).send(`No one booked this book with id : ${book_id}`);
//         return
//     }

//     bookList.forEach(e => {
//         for (let i = 0; i < customers.length; i++) {
//             if (e.customer_id == customers[i].id) {
//                 e.customer = customers[i]
//                 break
//             }
//         }
//     });
//         console.log('qalesan')
//     res.json({ customers_x: bookList})
// })




module.exports = router


