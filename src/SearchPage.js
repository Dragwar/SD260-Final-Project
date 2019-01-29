import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import allSearchTerms from './SEARCH_TERMS';
import Book from './Book';

class SearchPage extends Component {
  state = {
    query: ""
  }
  queryInput = React.createRef();

  componentDidMount() {
    this.queryInput.current.focus();

    // When "Enter" is pressed then it fetches results based on query
    this.queryInput.current.addEventListener('keyup', (e) => {
      if (e.key === "Enter") {
        this.handleQueryChange();
      }
    });
  }

  handleChange = (tgt) => {
    this.setState((prevState) => ({
      [tgt.name]: tgt.value
    }));
  }

  handleQueryChange = () => {
    let userQuery = this.state.query;
    console.log(userQuery);
    if (userQuery !== "") {
      BooksAPI.search(userQuery)
        .then(data => this.props.handleFetchResults(data))
        .catch(console.warn);
    } else {
      console.log('none');
    }
  }


  render() {
    const { results, handleSelectBookType, fetchError } = this.props;

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
              name="query"
              placeholder="Search by title or author"
              onChange={(e) => this.handleChange(e.target)}
              onDoubleClick={this.handleQueryChange}
              value={this.state.query}
              list="allSearchTermsList"
              ref={this.queryInput}
            />


          </div>
        </div>
        <div className="search-books-results">
          {
            fetchError !== "" && (
              <h2>{fetchError}</h2>
            )
          }
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
