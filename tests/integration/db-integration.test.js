const Book = require('../../models/book');
const dbConnect = require('../../dbTest');

jest.setTimeout(30000);

describe('Books DB connection', () => {
    beforeAll((done) => {
        if (dbConnect.readyState === 1) {
            done();
        } else {
            dbConnect.on("connected", () => done());
        }
    });

    beforeEach(async () => {
        await Book.deleteMany({});
    });

    it('Writes a contact in the DB', async () => {
        const book = new Book({
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
        });
        await book.save();
        const books = await Book.find();
        expect(books).toHaveLength(1);
    });

    afterAll(async () => {
        if (dbConnect.readyState === 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});
