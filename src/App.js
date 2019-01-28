import React from 'react';
import { Route } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import './App.css';
import SearchPage from './SearchPage';
import ListBooks from './ListBooks';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    results: [],
  }

  handleFetchResults = (data) => {
    this.setState((prevState) => ({
      results: [...data, ...prevState.results],
    }));
  }

  handleSelectBookType = (event) => {
    console.log(event.target.value);
  }

  render() {
    const { results } = this.state;
    BooksAPI.getAll().then(myBooks => console.log('myBooks:', myBooks));

    return (
      <div className="app App">
        <Route
          exact path="/"
          component={() => (
            <ListBooks
              results={results}
            />
          )}
        />
        <Route
          exact path="/search"
          component={() => (
            <SearchPage
              results={results}
              handleFetchResults={this.handleFetchResults}
              handleSelectBookType={this.handleSelectBookType}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
