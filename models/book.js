const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn: { 
        type: String, 
        unique: true, 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String, 
        required: true 
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    options: [{
        seller: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        prize: {
            type: Number,
            required: true
        }
    }]
});

bookSchema.methods.cleanup = function() {
    return {
        isbn: this.isbn,
        title: this.title,
        author: this.author,
        year: this.year,
        genre: this.genre,
        rating: this.rating,
        options: this.options.map(option => ({
            seller: option.seller,
            stock: option.stock,
            prize: option.prize
        }))
        }
    }
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
