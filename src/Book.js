import React, { Component } from 'react';

class Book extends Component {
  render() {
    const { book, handleSelectBookType } = this.props;

    return (
      <li className="Book">
        <div className="book">
          <div className="book-top">
            {
              !book.imageLinks ? (
                <div
                  className="book-cover"
                  style={
                    {
                      width: 128,
                      height: 192,
                      background: "gray",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  }
                >
                  <span>No Image</span>
                </div>
              ) : (
                  <div
                    className="book-cover"
                    style={
                      {
                        width: 128,
                        height: 192,
                        backgroundImage: `url(${book.imageLinks.thumbnail})`,
                      }
                    }
                  >
                  </div>
                )
            }
            <div className="book-shelf-changer">
              <select onChange={(event) => handleSelectBookType(event, book)}>
                <option value="move" disabled>Move to...</option>
                <option value="">-----------------------</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.authors && book.authors.join(', ')}</div>
        </div>
      </li>
    );
  }
}

export default Book;
