const helpers = require('../helpers/helpers')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi')
let idCounter = 0


router.use(bodyParser.json())


var books = []
books = helpers.readFromJSONFile("books.json")


router.get('/', (req, res) => {
    let search = req.query.search
    if (!search) {
        search=""
    }

    let book = books.filter(obj =>
        obj.title.toLowerCase().includes(search.toLowerCase()) 
    )
    if (book.length == 0) {
        res.status(404).send("Book resource not found!")
        return
    }

    res.json(book)
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    const book = books.find(c => c.id === parseInt(id))
    if (!book) return res.status(404).send(`The book with id of ${id} not found `)
    res.json(book)
})

router.post('/', (req, res) => {
    const { error } = validate_book(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    const book = {
        id: idCounter += 1,
        isbn: req.body.isbn,
        title: req.body.title,
        gener: req.body.gener,
        description: req.body.description,
        author: req.body.author,
        pulish_year: req.body.pulish_year,
        cover_photo_url: req.body.cover_photo_url,
        created_at: new Date(),
        updated_at: new Date()

    }
    books.push(book)
    helpers.saveInJSONFile(books, "books.json")
    res.send("ok")

})
router.put('/:id', (req, res) => {
    let id = req.params.id
    const book = books.find(c => c.id === parseInt(id))
    if (!book) return res.status(404).send(`The book with id of ${id} not found `)

    const { error } = validate_book(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
        book.isbn = req.body.isbn,
        book.title = req.body.title,
        book.gener = req.body.gener,
        book.description = req.body.description,
        book.author = req.body.author,
        book.pulish_year = req.body.pulish_year,
        book.cover_photo_url = req.body.cover_photo_url,
        book.created_at = book.created_at,
        book.updated_at = new Date()


    helpers.saveInJSONFile(books, "books.json")
    res.send(book)

})

router.delete('/:id', (req, res) => {

    const id = req.params.id
    const book = books.find(c => c.id === parseInt(id))
    if (!book) return res.status(404).send(`The book with id of ${id} not found `)

    const index = books.indexOf(book)
    books.splice(index, 1)
    helpers.saveInJSONFile(books, "books.json")
    res.send(book)

})


function validate_book(book) {
    const schema = Joi.object({
        isbn: Joi.string().min(3).required(),
        title: Joi.string().min(3).required(),
        gener: Joi.string().min(3).required(),
        description: Joi.string().min(5).required(),
        author: Joi.string().min(5).required(),
        pulish_year: Joi.number().required(),
        cover_photo_url: Joi.string().min(3).required(),

    })
    return validate = schema.validate(book)

}



module.exports = router


