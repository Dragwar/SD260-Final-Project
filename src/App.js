import React from 'react';
import { Route } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import './App.css';
import SearchPage from './SearchPage';
import ListBooks from './ListBooks';

class BooksApp extends React.Component {
  state = {
    /**
     * @NOTE ***state.results*** could just be in the search page component but 
     * the search results will disappear after switching pages if it was in there
     */
    results: [], // stores all current book search results (array of search result objects)
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
    if (data instanceof Array) {
      this.setState((prevState) => ({
        // adds a default shelf property to "none" to each object
        results: [...data.map(ele => ({ ...ele, shelf: "none" }))],
        fetchError: "",
      }));

      this.updateSearchBookIcons();

    } else if (data instanceof Object && data.error !== "") {
      this.setState((prevState) => ({
        fetchError: data.error,
      }));

    } else {
      alert("something went wrong");
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
   * ____
   * If the user changes the type of bookShelf than the icon
   * will be updated via line 72 - 82
   */
  handleSelectBookType = async (event, book) => {
    event.persist();// is needed to retain an event (for react)
    await BooksAPI.update(book, event.target.value).catch(console.warn);

    this.setState((prevState) => {
      let arr = [...prevState.results];
      let foundObj = { ...prevState.results.find((bk) => bk.id === book.id) };
      let foundObjIndex = prevState.results.indexOf(book);

      if (event.target.value) {
        foundObj.shelf = event.target.value;
        arr[foundObjIndex] = foundObj;
        return { results: arr };
      }
    });

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
      return [...myShelfHeaders];
    });

    this.setState(({
      allShelfHeaders: shelfHeaders,
    }));
  }

  /**
   * @description
   * gets the myBooks again then checks if the book id exists in the _this.state.results_ arr
   * then replaces the matching ids with the book obj from _this.state.myListOfBooks_ in other words 
   * books that exist in _this.state.myListOfBooks_ will replace the identical ones in
   * the _this.state.results_.
   */
  updateSearchBookIcons = async () => {
    let arrOfMyListOfBooks = await BooksAPI.getAll();
    let arrOfMyListOfBookIDs = arrOfMyListOfBooks.map((bk) => bk.id);

    let updatedArrayWithBookIcons = this.state.results.map((ele) => {
      let bookClone = { ...ele };

      if (!arrOfMyListOfBookIDs.includes(bookClone.id)) {
        return bookClone;

      } else {
        bookClone.shelf = arrOfMyListOfBooks.find((myBook) => myBook.id === bookClone.id).shelf;
        return bookClone;
      }
    });

    this.setState((prevState) => ({
      results: updatedArrayWithBookIcons,
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
              updateSearchBookIcons={this.updateSearchBookIcons}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
