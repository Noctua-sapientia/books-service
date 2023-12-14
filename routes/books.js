var express = require('express');
var router = express.Router();

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


/*GET books listing*/
router.get('/', function(req, res, next){
    res.send(books);
});

module.exports = router;

/*GET books/isbn */
router.get('/:isbn', function(req, res, next) {
  const bookId = parseInt(req.params.isbn);
  const findBook = books.find(book => {return book.isbn === bookId});
  if (findBook) {
    res.status(201).send(findBook);
  }else{
    res.status(404).send("Libro no encontrado");
  }
});

/*GET books/isbn/seller */
router.get('/:isbn/:seller', function(req, res, next) {
  const bookId = parseInt(req.params.isbn); 
  const sellerId = parseInt(req.params.seller);
  const findBook = books.find(book => book.isbn === bookId);
  if (!findBook) {
    return res.status(404).send("Libro no encontrado");
  }
  const findSeller = findBook.options.find(option => option.seller === sellerId);
  if (!findSeller) {
    return res.status(404).send("Vendedor no encontrado para este libro");
  }
  res.status(200).send(findSeller);
});

/*GET books/isbn/seller/options?options= */
router.get('/:isbn/:seller/options', function(req, res, next) {
  const bookId = parseInt(req.params.isbn);
  const sellerId = parseInt(req.params.seller);
  const findBook = books.find(book => book.isbn === bookId);
  if (!findBook) {
    return res.status(404).send("Libro no encontrado");
  }
  const findOption = findBook.options.find(option => option.seller === sellerId);
  if (!findOption) {
    return res.status(404).send("Opción de vendedor no encontrada para este libro");
  }
  const options = req.query.options;
  if (options === 'stock') {
    return res.status(200).send({ stock: findOption.stock });
  } else if (options === 'prize') {
    return res.status(200).send({ prize: findOption.prize });
  } else if (options === 'reviews'){
    return res.status(200).send({ reviews: findOption.reviews });
  } else if (options === 'seller'){
    return res.status(200).send({ seller: findOption.seller });
  } else {
    return res.status(400).send("Parámetro 'options' no válido");
  }
});


/* POST books */
router.post('/', function(req, res, next) {
  var book = req.body;
  books.push(book);
  res.status(200).send('Libro añadido');
});

/* POST books/:isbn/:seller */
router.post('/:isbn/:seller', function(req, res, next) {
  const bookId = parseInt(req.params.isbn);
  const sellerId = parseInt(req.params.seller);

  const findBook = books.find(book => book.isbn === bookId);

  if (!findBook) {
    return res.status(404).send("Libro no encontrado");
  }

  const findSeller = findBook.options.find(option => option.seller === sellerId);

  if (!findSeller) {
    findBook.options.push({
      seller: sellerId,
      stock: req.body.stock, 
      precio: req.body.prize, 
      reviews: req.body.reviews 
    });

    res.status(200).send('Vendedor añadido al libro');
  } else {
    res.status(200).send('El vendedor ya está asociado a este libro');
  }
});

/*PUT book*/
router.put('/:isbn', function(req, res, next) {
  var bookId = parseInt(req.params.isbn);

  var findBook = books.find(libro => libro.isbn === bookId);

  if (!findBook) {
    return res.status(404).send("Libro no encontrado");
  }
  if (findBook.isbn !== req.body.isbn){
    return res.status(404).send("ISBN incorrecto, debe indicar correctamente el ISBN del libro que quiere modificar (No es posible modificar el ISBN)");
  }
  
    findBook.title = req.body.title;
    findBook.author = req.body.author;
    findBook.year = req.body.year;
    findBook.genre = req.body.genre;

  res.status(201).send("Libro actualizado exitosamente");
});


/*PUT books/:isbn/:seller/options */
router.put('/:isbn/:seller/options', function(req, res, next) {
  const bookId = parseInt(req.params.isbn);
  const sellerId = parseInt(req.params.seller);
  const findBook = books.find(book => book.isbn === bookId);

  if (!findBook) {
    return res.status(404).send("Libro no encontrado");
  }

  const findOption = findBook.options.find(option => option.seller === sellerId);

  if (!findOption) {
    return res.status(404).send("Opción de vendedor no encontrada para este libro");
  }

  const options = req.query.options;

  if (options === 'stock') {
    findOption.stock = req.body.stock;
  } else if (options === 'prize') {
    findOption.prize = req.body.prize;
  } else if (options === 'reviews') {
    findOption.reviews = req.body.reviews;
  } else {
    return res.status(400).send("Parámetro 'options' no válido");
  }

  res.status(200).send("Opción actualizada exitosamente");
});

/*DELETE book/:id*/
router.delete('/:isbn', function(req, res, next) {
  var bookId = parseInt(req.params.isbn);
  var findBook = books.find(book => book.isbn === bookId);
  if (!findBook) {
    return res.status(404).send("Libro no encontrado");
  }
  books.splice(findBook, 1);
  res.status(200).send("Libro eliminado exitosamente");
});


/*DELETE book/:id/:seller*/
router.delete('/:isbn/:seller', function(req, res, next) {
  const bookId = parseInt(req.params.isbn);
  const sellerId = parseInt(req.params.seller);

  const findBook = books.find(book => book.isbn === bookId);

  if (!findBook) {
    return res.status(404).send("Libro no encontrado");
  }
  if(!findBook.options){
    return res.status(404).send("Opciones no disponibles");
  }

  const findOption = findBook.options.find(option => option.seller === sellerId);

  if (!findOption) {
    return res.status(404).send("Vendedor no encontrado para este libro");
  }

  const numVendedores = findBook.options.length;

  if (numVendedores > 1) {
    findBook.options.splice(findOption, 1);
  } else {
    books.splice(findBook, 1);
  }

  res.status(200).send("Datos del vendedor borrados exitosamente");
});


module.exports = router;