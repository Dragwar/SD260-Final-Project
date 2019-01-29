import React from 'react';
import { Route } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import './App.css';
import SearchPage from './SearchPage';
import ListBooks from './ListBooks';

class BooksApp extends React.Component {
  state = {
    results: [], // stores all book search results per session (array of search result objects)
    myListOfBooks: [], // stores all the user selected books (array of book objects)
    allShelfHeaders: [], // stores all book shelf headers (array of header strings)
    fetchError: "", // stores any error during search fetch
  }

  /**
   * @description
   * 
   * **HANDLES THE SEARCH PAGE FETCH**
   * 
   * when the _data_ is an Array type then it is most likely a successful search fetch
   * when the _data_ is an Object type then it is most likely an error
   */
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

  /**
   * @description
   * waits until the _getAll_ fetch has fetched all _myBooks_ then sets state _myListOfBooks_ with said _myBooks_
   */
  setMyBooks = async () => {
    let myBooks = await BooksAPI.getAll().catch(console.warn);

    this.setState(({
      myListOfBooks: myBooks,
    }));
  }

  /**
   * @description
   * waits until the updates to the api is completely done,
   * then re-renders the page with the changes that the user made
   */
  handleSelectBookType = async (event, book) => {
    await BooksAPI.update(book, event.target.value).catch(console.warn);
    this.setShelfHeaders();
    this.setMyBooks();
  }

  /**
   * @description
   * Gets and sets all bookshelf headers in state _AllShelfHeaders_
   */
  setShelfHeaders = async () => {
    let shelfHeaders = await BooksAPI.getAll().then((data) => {
      let myShelfHeaders = [...new Set(data.map((ele) => ele = ele.shelf))];
      return shelfHeaders = [...myShelfHeaders];
    });

    this.setState(({
      allShelfHeaders: shelfHeaders,
    }));
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
              myListOfBooks={myListOfBooks}
              allShelfHeaders={allShelfHeaders}
              handleSelectBookType={this.handleSelectBookType}
              setMyBooks={this.setMyBooks}
              setShelfHeaders={this.setShelfHeaders}
            />
          )}
        />
        <Route
          exact path="/search"
          render={() => (
            <SearchPage
              results={results}
              fetchError={fetchError}
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
