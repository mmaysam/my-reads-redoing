import React, { useState, useEffect } from "react";
import * as BooksAPI from "../BooksAPI";
import "../App.css";
import Book from "./Book";

const Search = () => {
  const [books, setBooks] = useState([]);
  const [mapOfId, setMapOfId] = useState(new Map());
  const [booksInSearch, setbooksInSearch] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mergedBooks, setMergedBooks] = useState([]);

  const [query, setQuery] = useState("");

  useEffect(() => {
    BooksAPI.getAll().then((data) => {
      setBooks(data);
      setMapOfId(createMapOfBooks(data));
    });
  }, []);

  useEffect(
    () => {
      let isActive = true;
      if (query) {
        BooksAPI.search(query).then((data) => {
          if (data.error) {
            setbooksInSearch([]);
          } else {
            if (isActive) {
              setbooksInSearch(data);
            }
          }
        });
      }
      return () => {
        isActive = false;
      };
    },
    [query]
  );
  useEffect(
    () => {
      const combined = booksInSearch.map((book) => {
        if (mapOfId.has(book.id)) {
          return mapOfId.get(book.id);
        } else {
          return book;
        }
      });
      setMergedBooks(combined);
    },
    [booksInSearch]
  );

  const createMapOfBooks = (books) => {
    const map = new Map();
    books.map((book) => map.set(book.id, book));
    return map;
  };
  const updateBookShelf = (book, whereTo) => {
    const updatedBooks = books.map((b) => {
      if (b.id === book.id) {
        b.shelf = whereTo;
        return book;
      }
      return b;
    });
    setBooks(updatedBooks);
    BooksAPI.update(book, whereTo);
  };

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <button className="close-search" onClick={() => setShowSearch(false)}>
          Close
        </button>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title or author"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {mergedBooks.map((b) => (
            <li key={b.id}>
              <Book book={b} changeBookShelf={updateBookShelf} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Search;
