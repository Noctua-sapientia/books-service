var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var debug = require('debug')('books-2:server');
const verificarToken = require('./verificarToken') ;
/*
var books =[
    {
      "isbn": 12345678,
      "title": "Harry Potter y la piedra filosofal",
      "author": "J.K.Rowling",
      "year": "1997",
      "genre": "fantasía",
      "options": [
        { "seller": 2, "stock": 110, "prize": 9.9, "reviews": 4.7},
        { "seller": 3, "stock": 120, "prize": 12.10, "reviews": 3.9}
      ]
    },
    {
      "isbn": 987654321,
      "title": "Orgullo y prejuicio",
      "author": "Jane Austen",
      "year": "1813",
      "genre": "romance",
      "options": [
        { "seller": 1, "stock": 100, "prize": 9.9, "reviews": 4.3},
        { "seller": 2, "stock": 120, "prize": 12.10, "reviews": 3.7}
      ]
    }
]

*/

/*AÑADIR verificarToken A TODO */
/*GET books listing*/
router.get('/', async function(req, res, next){
  try {
    const result = await Book.find();
    res.send(result.map((c) => c.cleanup()));
  } catch(e){
    debug("DB problem", e);
    res.sendStatus(500);
  }
});


/*GET books/isbn */
router.get('/:isbn', async function(req, res, next) {
  const isbn = req.params.isbn;

  try {
    const foundBook = await Book.findOne({ isbn });

    if (foundBook) {
      res.status(200).send(foundBook.cleanup());
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/*GET books/isbn/seller */
router.get('/:isbn/:seller', async function(req, res, next) {
  const isbn = req.params.isbn;
  const sellerId = parseInt(req.params.seller);

  try {
    const foundBook = await Book.findOne({ isbn });
    if (!foundBook) {
      return res.status(404).send("Libro no encontrado");
    }

    const foundSeller = foundBook.options.find(option => option.seller === sellerId);

    if (!foundSeller) {
      return res.status(404).send("Vendedor no encontrado para este libro");
    }

    res.status(200).send(foundSeller.cleanup());
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/*GET books/isbn/seller/options?options= */
router.get('/:isbn/:seller/options', async function(req, res, next) {
  const isbn = req.params.isbn;
  const sellerId = parseInt(req.params.seller);
  const options = req.query.options;

  try {
    const foundBook = await Book.findOne({ isbn });
    if (!foundBook) {
      return res.status(404).send("Libro no encontrado");
    }

    const foundOption = foundBook.options.find(option => option.seller === sellerId);
    if (!foundOption) {
      return res.status(404).send("Opción de vendedor no encontrada para este libro");
    }

    if (options === 'stock') {
      return res.status(200).send({ stock: foundOption.stock });
    } else if (options === 'prize') {
      return res.status(200).send({ prize: foundOption.prize });
    } else if (options === 'reviews') {
      return res.status(200).send({ reviews: foundOption.reviews });
    } else if (options === 'seller') {
      return res.status(200).send({ seller: foundOption.seller });
    } else {
      return res.status(400).send("Parámetro 'options' no válido");
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


/* POST books */
router.post('/', async function(req, res, next) {
  const { isbn, author, title, year, genre, options } = req.body;
  
  const newBook = new Book({
    isbn,
    author,
    title,
    year,
    genre,
    options
  });

  try {
    await newBook.save();
    return res.sendStatus(201);
  } catch (e) {
      debug("DB problem", e);
      res.sendStatus(500);
  }
});

/* POST books/:isbn/:seller */
router.post('/:isbn/:seller', async function(req, res, next) {
  const isbn = req.params.isbn;
  const sellerId = parseInt(req.params.seller);

  try {
    // Buscar el libro por ISBN en la base de datos
    const foundBook = await Book.findOne({ isbn });

    if (!foundBook) {
      return res.status(404).send("Libro no encontrado");
    }

    // Verificar si el vendedor ya está asociado al libro
    const existingSeller = foundBook.options.find(option => option.seller === sellerId);

    if (!existingSeller) {
      // Si el vendedor no está asociado, agregarlo a la lista de opciones del libro
      foundBook.options.push({
        seller: sellerId,
        stock: req.body.stock, 
        prize: req.body.prize, 
        reviews: req.body.reviews 
      });

      // Guardar los cambios en la base de datos
      await foundBook.save();

      res.status(200).send('Vendedor añadido al libro');
    } else {
      res.status(200).send('El vendedor ya está asociado a este libro');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el vendedor al libro');
  }
});

/* PUT book */
router.put('/:isbn', async function(req, res, next) {
  const isbn = req.params.isbn;

  try {
    const foundBook = await Book.findOne({ isbn });

    if (!foundBook) {
      return res.status(404).send("Libro no encontrado");
    }

    if (foundBook.isbn !== isbn) {
      return res.status(400).send("ISBN incorrecto, debe indicar correctamente el ISBN del libro que quiere modificar (No es posible modificar el ISBN)");
    }

    foundBook.title = req.body.title;
    foundBook.author = req.body.author;
    foundBook.year = req.body.year;
    foundBook.genre = req.body.genre;

    await foundBook.save();

    res.status(200).send("Libro actualizado exitosamente");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/* PUT books/:isbn/:seller/options */
router.put('/:isbn/:seller/options', async function(req, res, next) {
  const isbn = req.params.isbn;
  const sellerId = parseInt(req.params.seller);

  try {
    const foundBook = await Book.findOne({ isbn });

    if (!foundBook) {
      return res.status(404).send("Libro no encontrado");
    }

    const foundOption = foundBook.options.find(option => option.seller === sellerId);

    if (!foundOption) {
      return res.status(404).send("Opción de vendedor no encontrada para este libro");
    }

    const options = req.query.options;

    if (options === 'stock') {
      foundOption.stock = req.body.stock;
    } else if (options === 'prize') {
      foundOption.prize = req.body.prize;
    } else if (options === 'reviews') {
      foundOption.reviews = req.body.reviews;
    } else {
      return res.status(400).send("Parámetro 'options' no válido");
    }

    await foundBook.save();

    res.status(200).send("Opción actualizada exitosamente");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/* DELETE book/:id */
router.delete('/:isbn', async function(req, res, next) {
  const isbn = req.params.isbn;

  try {
    const result = await Book.findOneAndDelete({ isbn });

    if (!result) {
      return res.status(404).send("Libro no encontrado");
    }

    res.status(200).send("Libro eliminado exitosamente");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/* DELETE book/:id/:seller */
router.delete('/:isbn/:seller', async function(req, res, next) {
  const isbn = req.params.isbn;
  const sellerId = parseInt(req.params.seller);

  try {
    const foundBook = await Book.findOne({ isbn });

    if (!foundBook) {
      return res.status(404).send("Libro no encontrado");
    }

    if (!foundBook.options) {
      return res.status(404).send("Opciones no disponibles");
    }

    const findOptionIndex = foundBook.options.findIndex(option => option.seller === sellerId);

    if (findOptionIndex === -1) {
      return res.status(404).send("Vendedor no encontrado para este libro");
    }

    const numVendedores = foundBook.options.length;

    if (numVendedores > 1) {
      foundBook.options.splice(findOptionIndex, 1);
      await foundBook.save();
    } else {
      await Book.findOneAndDelete({ isbn });
    }

    res.status(200).send("Datos del vendedor borrados exitosamente");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;