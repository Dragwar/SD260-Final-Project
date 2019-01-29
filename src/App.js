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
    myListOfBooks: [],
    allShelfHeaders: [],
  }

  handleFetchResults = (data) => {
    console.log('fetch results:', data);
    this.setState((prevState) => ({
      results: [...data, ...prevState.results],
    }));
  }

  setMyBooks = async () => {
    let myBooks = await BooksAPI.getAll().then((data) => data);

    this.setState(({
      myListOfBooks: myBooks
    }));
  }

  handleSelectBookType = (event, book) => {
    console.log('book:', book, event.target.value);
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
    const { results, myListOfBooks, allShelfHeaders } = this.state;
    
    return (
      <div className="app App">
        <Route
          exact path="/"
          component={() => (
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
