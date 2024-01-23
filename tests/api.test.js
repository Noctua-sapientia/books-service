const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');

var Book = require('../models/book');

describe("Books API", () => {

    beforeAll(() => {
        const SECRET_KEY = 'a56d1f7c0c817387a072692731ea60df7c3a6c19d82ddac228a9a4461f8c5a72';
        jwtToken = jwt.sign({}, SECRET_KEY,);
    });

    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").set('Authorization', jwtToken).then((response) => {
                expect(response.statusCode).toBe(200);
            })
        })
    });

    describe("GET /books", () => {
        it("Should return all books", () => {
            const books  = [
                new Book({
                    "isbn": "789338",
                    "title": "sadfsaj",
                    "author": "dfgdsg",
                    "genre": "dgfdsg",
                    "year": "2002",
                    "options": {
                        "seller": "2",
                        "prize": "22",
                        "stock": "111"
                    }
                }),

                new Book ({
                    "isbn": "789338",
                    "title": "sadfsaj",
                    "author": "dfgdsg",
                    "genre": "dgfdsg",
                    "year": "2002",
                    "options": {
                        "seller": "2",
                        "prize": "22",
                        "stock": "111"
                    }
                })
            ];

            dbFind = jest.spyOn(Book, "find");
            dbFind.mockImplementation(async () => Promise.resolve(books));

            return request(app).get("/api/v1/books").set('Authorization', jwtToken).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(dbFind).toBeCalled();
            });
        });
    });

    describe("POST /books", () => {
            const book = {
            "isbn": "731313",
            "title": "fe",
            "author": "adn",
            "genre": "dgfKNVDdsg",
            "year": "2002",
            "options": {
                "seller": "2",
                "prize": "17",
                "stock": "111"
            }
        };
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Book.prototype, "save");
        });

        it("Should add a new book if data everything", () => {
            dbSave.mockImplementation(async () => Promise.resolve(true));

            return request(app).post("/api/v1/books").send(book).set('Authorization', jwtToken).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            });
        });
        it("Should return 500 if there is a problem with the connection", () => {
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).post("/api/v1/books").send(book).set('Authorization', jwtToken).then((response) =>{
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();
            });
        });
    });
}); 