import React, { Component } from 'react';
import Book from './Book';

class BookShelf extends Component {
  render() {
    const { typeOfShelf, books, handleSelectBookType } = this.props;
    let humanReadableVersion;

    switch (typeof typeOfShelf === 'string') {
      case typeOfShelf === 'currentlyReading':
        humanReadableVersion = 'Currently Reading';
        break;

      case typeOfShelf === 'wantToRead':
        humanReadableVersion = 'Want To Read';
        break;

      case typeOfShelf === 'read':
        humanReadableVersion = 'Read';
        break;

      default:
        humanReadableVersion = typeOfShelf;
        break;
    }

    return (
      <div id={typeOfShelf} className="bookshelf">
        <h2 className="bookshelf-title">{humanReadableVersion}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {
              books !== null && books.map((book, index) => (
                <Book
                  key={index}
                  book={book}
                  handleSelectBookType={handleSelectBookType}
                />
              ))
            }
          </ol>
        </div>
      </div>
    );
  }
}

export default BookShelf;
