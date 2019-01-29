import React, { Component } from 'react';
import Book from './Book';

class BookShelf extends Component {
  render() {
    const { typeOfShelf, books, handleSelectBookType } = this.props;
    let humanReadableVersion;

    if (typeOfShelf === 'currentlyReading') {
      humanReadableVersion = 'Currently Reading';

    } else if (typeOfShelf === 'wantToRead') {
      humanReadableVersion = 'Want To Read';

    } else if (typeOfShelf === 'read') {
      humanReadableVersion = 'Read';
      
    } else {
      humanReadableVersion = typeOfShelf;
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
