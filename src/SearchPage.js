import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import allSearchTerms from './SEARCH_TERMS';
import Book from './Book';

class SearchPage extends Component {
  queryInput = React.createRef();

  componentDidMount() {
    this.queryInput.current.focus();
  }

  handleQueryChange = () => {
    let query = this.queryInput.current.value;
    if (query !== "") {
      BooksAPI.search(query)
        .then(data => this.props.handleFetchResults(data))
        .catch(console.warn);
    }
  }


  render() {
    const { results, handleSelectBookType } = this.props;

    return (
      <div className="search-books SearchPage">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <datalist id="allSearchTermsList">
              {
                allSearchTerms.map((term, index) => (
                  <option key={index} value={term} />
                ))
              }
            </datalist>
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={this.handleQueryChange}
              list="allSearchTermsList"
              ref={this.queryInput}
            />

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {
              results.length > 0 && results.map((book, index) => (
                <Book
                  key={index}
                  index={index}
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

export default SearchPage;
