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

    /**
     * @description
     * When "Enter" is pressed then it fetches results based on query
     */
    this.queryInput.current.addEventListener('keyup', (e) => {
      if (e.key === "Enter") {
        this.handleQueryChange();
      }
    });
  }

  /**
   * @description
   * Simple function that just sets state to the query search input value
   * then invokes the _this.handleQueryChange();_ to fetch book results
   * based on the current query value
   * ____
   * @explain Why async await?
   * 1. 
   * This is an async function because if the query state (_q-state_)
   * takes time to update with the user's keystrokes meaning
   * if I didn't await for the _this.setState((//...))_ then the
   * _this.handleQueryChange();_ function will get called before the _q-state_
   * gets set. Which will search with the previous _q-state_ value. (not intended)
   * 
   * 2. 
   * With awaiting the _this.setState((//...))_ then the 
   * _this.handleQueryChange();_ will get called when the _q-state_
   * has been set with the newest input val set by the user (intended)
   * ____
   */
  handleChange = async (tgt) => {
    await this.setState((prevState) => ({
      [tgt.name]: tgt.value
    }));

    this.handleQueryChange();
  }

  /**
   * @description
   * Only gets called when input field is double clicked or,
   * the user presses "Enter" while the input field has focus.
   * 
   * fetches all relevant books from api with _BooksAPI.search(userQuery)_ and _this.props.handleFetchResults(data)_ 
   */
  handleQueryChange = () => {
    let userQuery = this.state.query;
    console.log({ query: userQuery });

    if (userQuery !== "" && typeof userQuery === 'string') {
      BooksAPI.search(userQuery)
        .then(data => this.props.handleFetchResults(data))
        .catch(console.warn);
    }
  }

  render() {
    const { results, handleSelectBookType, fetchError } = this.props;

    return (
      <div className="search-books SearchPage">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">

            <input
              type="text"
              name="query"
              placeholder="Search by title or author"
              onChange={(e) => this.handleChange(e.target)}
              value={this.state.query}
              ref={this.queryInput}
              list="allSearchTermsList"
            />

          </div>
        </div>

        <div className="search-books-results">
          <ol className="books-grid">
            {
              fetchError !== "" ? (
                <h2 style={{ color: "red", fontStyle: "italic", fontVariant: "all-small-caps" }}>{fetchError}</h2>
              ) : (
                  results.length > 0 && results.map((book, index) => (
                    <Book
                      key={index}
                      index={index}
                      book={book}
                      handleSelectBookType={handleSelectBookType}
                    />
                  ))
                )
            }
          </ol>
        </div>

        <datalist id="allSearchTermsList">
          {
            allSearchTerms && allSearchTerms.map((term, index) => (
              <option key={index} value={term} />
            ))
          }
        </datalist>

      </div>
    );
  }
}

export default SearchPage;
