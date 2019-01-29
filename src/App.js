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
    results: [], // stores all book search results per session
    myListOfBooks: [],
    allShelfHeaders: [],
    fetchError: "",
  }

  handleFetchResults = (data) => {
    console.log('fetch results:', data);

    if (data instanceof Array) {
      this.setState((prevState) => ({
        results: [...data, ...prevState.results],
        fetchError: "",
      }));

    } else {
      this.setState((prevState) => ({
        fetchError: data.error,
      }));
    }
  }

  setMyBooks = async () => {
    let myBooks = await BooksAPI.getAll().then((data) => data);

    this.setState(({
      myListOfBooks: myBooks
    }));
  }

  handleSelectBookType = (event, book) => {
    BooksAPI.update(book, event.target.value).then(console.log)
    this.setMyBooks();
  }

  setShelfHeaders = async () => {
    let shelfHeaders = await BooksAPI.getAll().then((data) => {
      let myShelfHeaders = [...new Set(data.map((ele) => ele = ele.shelf))]
      return shelfHeaders = [...myShelfHeaders];
    });

    this.setState(({
      allShelfHeaders: shelfHeaders
    }));
  }

  componentDidMount() {
    this.setMyBooks();
    this.setShelfHeaders();
  }

  render() {
    const { results, myListOfBooks, allShelfHeaders, fetchError } = this.state;
    
    return (
      <div className="app App">
        <Route
          exact path="/"
          render={() => (
            <ListBooks
              results={results}
              handleSelectBookType={this.handleSelectBookType}
              myListOfBooks={myListOfBooks}
              setMyBooks={this.setMyBooks}
              allShelfHeaders={allShelfHeaders}
            />
          )}
        />
        <Route
          exact path="/search"
          render={() => (
            <SearchPage
              results={results}
              handleFetchResults={this.handleFetchResults}
              handleSelectBookType={this.handleSelectBookType}
              fetchError={fetchError}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
