var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var debug = require('debug')('books-2:server');
var emailSender = require('../services/sendEmailService');
const User = require("../services/users");
const Order = require("../services/orders");
const verificarToken = require('./verificarToken') ;
const cors = require('cors');

router.use(cors());
/*
var books =[
    {
      "isbn": 12345678,
      "title": "Harry Potter y la piedra filosofal",
      "author": "J.K.Rowling",
      "year": "1997",
      "genre": "fantasía",
      "rating": 4.7
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

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Obtiene la lista de libros.
 *     description: Requiere token de autenticación.
 *     responses:
 *       200:
 *         description: Lista de libros obtenida correctamente.
 *       500:
 *         description: Error en el servidor.
 */
router.get('/', verificarToken, async function(req, res, next){
  try {
    const result = await Book.find();
    res.send(result.map((c) => c.cleanup()));
  } catch(e){
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /books/{isbn}:
 *   get:
 *     summary: Obtiene detalles de un libro por ISBN.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del libro obtenidos correctamente.
 *       404:
 *         description: Libro no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
/*GET books listing*/
router.get('/:isbn', verificarToken, async function(req, res, next) {
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

/**
 * @swagger
 * /books/{isbn}/{seller}:
 *   get:
 *     summary: Obtiene detalles de un libro por ISBN y vendedor.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: seller
 *         description: ID del vendedor.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del libro obtenidos correctamente.
 *       404:
 *         description: Libro o vendedor no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
/*GET books/isbn/seller */
router.get('/:isbn/:seller', verificarToken, async function(req, res, next) {
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
/**
 * @swagger
 * /books/{isbn}/{rating}:
 *   get:
 *     summary: Obtiene detalles de un libro por ISBN y calificación.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: rating
 *         description: Calificación del libro.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del libro obtenidos correctamente.
 *       404:
 *         description: Libro o calificación no encontrados.
 *       500:
 *         description: Error en el servidor.
 */
/*GET books/isbn/rating */
router.get('/:isbn/:rating', verificarToken, async function(req, res, next) {
  const isbn = req.params.isbn;
  const ratingId = parseInt(req.params.seller);

  try {
    const foundBook = await Book.findOne({ isbn });
    if (!foundBook) {
      return res.status(404).send("Libro no encontrado");
    }

    const foundRating = foundBook.options.find(option => option.rating === ratingId);

    if (!foundRating) {
      return res.status(404).send("Reseña no encontrada para este libro");
    }

    res.status(200).send(foundRating.cleanup());
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /books/{isbn}/{seller}/options:
 *   get:
 *     summary: Obtiene opciones de un libro por ISBN y vendedor.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: seller
 *         description: ID del vendedor.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: options
 *         description: Tipo de opciones a obtener (stock, prize, seller).
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opciones del libro obtenidas correctamente.
 *       400:
 *         description: Parámetro 'options' no válido.
 *       404:
 *         description: Libro o vendedor no encontrados.
 *       500:
 *         description: Error en el servidor.
 */
router.get('/:isbn/:seller/options', verificarToken, async function(req, res, next) {
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

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Crea un nuevo libro.
 *     description: Requiere token de autenticación.
 *     requestBody:
 *       description: Datos del nuevo libro.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Libro creado exitosamente.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/', verificarToken, async function(req, res, next) {
  const { isbn, author, title, year, genre, rating, options } = req.body;
  const accessToken = req.headers.authorization;

  const newBook = new Book({
    isbn,
    author,
    title,
    year,
    genre,
    rating,
    options
  });
  console.log("Opciones", options.seller);
  try {
    //userOfReview llega nulo
    //const findOptions = options.find(option => option.seller);
    //NO SE ENVIA NADA A GETSELLERSINFO VER CON PABLO PARECE QUE NO HACE BIEN EL GET
    const userOfReview = await User.getSellersInfo(accessToken, options.seller);
    console.log("Nombre", userOfReview.name);
    console.log("Email", userOfReview.email);

      await emailSender.sendEmail(userOfReview.name, userOfReview.email, newBook.title);
      await newBook.save();
      res.sendStatus(201);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send(e);
  }
});

/**
 * @swagger
 * /books/{isbn}/{seller}:
 *   post:
 *     summary: Agrega un nuevo vendedor a un libro por ISBN.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: seller
 *         description: ID del vendedor.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos del vendedor a agregar.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookOptions'
 *     responses:
 *       200:
 *         description: Vendedor añadido correctamente al libro.
 *       404:
 *         description: Libro no encontrado o vendedor ya asociado.
 *       500:
 *         description: Error en el servidor.
 */
/* POST books/:isbn/:seller */
router.post('/:isbn/:seller', verificarToken, async function(req, res, next) {
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

/**
 * @swagger
 * /books/{isbn}/{rating}:
 *   post:
 *     summary: Agrega una nueva valoración a un libro por ISBN.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: rating
 *         description: ID de la valoración.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Valoración añadida correctamente al libro.
 *       404:
 *         description: Libro no encontrado o valoración ya asociada.
 *       500:
 *         description: Error en el servidor.
 */
/* POST books/:isbn/:rating */
router.post('/:isbn/:rating', verificarToken, async function(req, res, next) {
  const isbn = req.params.isbn;
  const ratingId = parseInt(req.params.rating);

  try {
    // Buscar el libro por ISBN en la base de datos
    const foundBook = await Book.findOne({ isbn });

    if (!foundBook) {
      return res.status(404).send("Libro no encontrado");
    }

    // Verificar si el vendedor ya está asociado al libro
    const existingSeller = foundBook.options.find(option => option.seller === sellerId);

    if (!existingSeller) {
      foundBook.rating.push({
        rating: ratingId
      });
      await foundBook.save();

      res.status(200).send('Valoración añadida al libro');
    } else {
      res.status(200).send('El vendedor ya está asociado a este libro');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar valoración al libro');
  }
});


/**
 * @swagger
 * /books/{isbn}:
 *   put:
 *     summary: Actualiza un libro por ISBN.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Nuevos datos del libro.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Libro actualizado correctamente.
 *       404:
 *         description: Libro no encontrado.
 *       400:
 *         description: ISBN incorrecto.
 *       500:
 *         description: Error en el servidor.
 */
/* PUT book */
router.put('/:isbn', verificarToken, async function(req, res, next) {
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
    foundBook.rating = req.body.rating;
    foundBook.options = req.body.options;
    
    await foundBook.save();

    res.status(200).send("Libro actualizado exitosamente");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /books/{isbn}/{seller}/options:
 *   put:
 *     summary: Actualiza las opciones de un libro por ISBN y vendedor.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: seller
 *         description: ID del vendedor.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: options
 *         description: Tipo de opciones a actualizar (stock, prize, reviews).
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Nuevos valores de las opciones seleccionadas.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookOptions'
 *     responses:
 *       200:
 *         description: Opciones actualizadas correctamente.
 *       400:
 *         description: Parámetro 'options' no válido.
 *       404:
 *         description: Libro o vendedor no encontrados.
 *       500:
 *         description: Error en el servidor.
 */
/* PUT books/:isbn/:seller/options */
router.put('/:isbn/:seller/options', verificarToken, async function(req, res, next) {
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
/**
 * @swagger
 * /books/{isbn}/{seller}/stock:
 *   put:
 *     summary: Aumenta el stock en el número de unidades especificado para un libro y vendedor.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: seller
 *         description: ID del vendedor.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Número de unidades a aumentar en el stock.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               units:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock actualizado correctamente.
 *       404:
 *         description: Libro o vendedor no encontrados.
 *       500:
 *         description: Error en el servidor.
 */
// Aumenta el stock en el numero de unidades especificado
router.put('/:isbn/:seller/stock', verificarToken, async function(req, res, next) {
  const isbn = req.params.isbn;
  const sellerId = parseInt(req.params.seller);

  console.log(isbn, sellerId, req.body.units)
  try {
    const book = await Book.findOne({ isbn: isbn });
    if (!book) {
      return res.status(404).send("Book not found.");
    }
    const sellerOption = book.options.find(option => option.seller === sellerId);
    if (!sellerOption) {
      return res.status(404).send("Seller not found.");
    }
    sellerOption.stock += req.body.units;

    await book.save();
    res.status(200).send("Stock updated.");

  } catch (error) {
    console.error("Database error", error);
    return res.status(500).send({ error: "Database error" });
  }
});


/* DELETE book/:id */
router.delete('/:isbn', verificarToken, async function(req, res, next) {
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

/**
 * @swagger
 * /books/{isbn}:
 *   delete:
 *     summary: Elimina un libro por ISBN.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Libro eliminado correctamente.
 *       404:
 *         description: Libro no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
/* DELETE book/:id/:seller */
router.delete('/:isbn/:seller', verificarToken, async function(req, res, next) {
  const isbn = req.params.isbn;
  const sellerId = parseInt(req.params.seller);
  const accessToken = req.headers.authorization;

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
      Order.cancelDeletedBookOrders(accessToken, isbn, sellerId);

    } else {
      await Book.findOneAndDelete({ isbn });
      Order.cancelDeletedBookOrders(accessToken, isbn, sellerId);
    }

    res.status(200).send("Datos del vendedor borrados exitosamente");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
/**
 * @swagger
 * /books/{isbn}/{seller}:
 *   delete:
 *     summary: Elimina los datos de un vendedor para un libro por ISBN.
 *     description: Requiere token de autenticación.
 *     parameters:
 *       - in: path
 *         name: isbn
 *         description: ISBN del libro.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: seller
 *         description: ID del vendedor.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del vendedor eliminados correctamente.
 *       404:
 *         description: Libro, vendedor o opciones no encontrados.
 *       500:
 *         description: Error en el servidor.
 */
/* DELETE book/:id */
router.delete('/:isbn', verificarToken, async function(req, res, next) {
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

module.exports = router;