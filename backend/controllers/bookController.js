import Book from "../models/Book.js";

const createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const Books = await Book.find();
    res.json(Books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecificBook = async (req, res) => {
  try {
    const { id } = req.params;
    const specificBook = await Book.findById(id);
    if (!specificBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(specificBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const BookReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const Book = await Book.findById(req.params.id);

    if (Book) {
      const alreadyReviewed = Book.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Book already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      Book.reviews.push(review);
      Book.numReviews = Book.reviews.length;
      Book.rating =
        Book.reviews.reduce((acc, item) => item.rating + acc, 0) /
        Book.reviews.length;

      await Book.save();
      res.status(201).json({ message: "Review Added" });
    } else {
      res.status(404);
      throw new Error("Book not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBook = await Book.findByIdAndDelete(id);

    if (!deleteBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { BookId, reviewId } = req.body;
    const Book = await Book.findById(BookId);

    if (!Book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviewIndex = Book.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    Book.reviews.splice(reviewIndex, 1);
    Book.numReviews = Book.reviews.length;
    Book.rating =
      Book.reviews.length > 0
        ? Book.reviews.reduce((acc, item) => item.rating + acc, 0) /
          Book.reviews.length
        : 0;

    await Book.save();
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getNewBooks = async (req, res) => {
  try {
    const newBooks = await Book.find().sort({ createdAt: -1 }).limit(10);
    res.json(newBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopBooks = async (req, res) => {
  try {
    const topRatedBooks = await Book.find()
      .sort({ numReviews: -1 })
      .limit(10);
    res.json(topRatedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandomBooks = async (req, res) => {
  try {
    const randomBooks = await Book.aggregate([{ $sample: { size: 10 } }]);
    res.json(randomBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createBook,
  getAllBooks,
  getSpecificBook,
  updateBook,
  BookReview,
  deleteBook,
  deleteComment,
  getNewBooks,
  getTopBooks,
  getRandomBooks,
};