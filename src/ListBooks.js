import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BookShelf from './BookShelf';

class ListBooks extends Component {
  componentDidMount() {
    this.props.setShelfHeaders();
    this.props.setMyBooks();
  }

  render() {
    const { handleSelectBookType, myListOfBooks, allShelfHeaders } = this.props;

    return (
      <div className="list-books ListBooks">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        <div className="list-books-content">
          <div>
            {
              allShelfHeaders.map((header, index) => (
                <BookShelf
                  key={index}
                  typeOfShelf={header}
                  books={myListOfBooks.filter(ele => ele.shelf === header)}
                  handleSelectBookType={handleSelectBookType}
                />
              ))
            }
          </div>
        </div>

        <div className="open-search">
          <Link to="/search" className="page-link">Add a book</Link>
        </div>
      </div>
    );
  }

}

export default ListBooks;
