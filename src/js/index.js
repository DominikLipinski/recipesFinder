import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/* Global state:
-search
- current recipe
- shopping list
-liked recipes
*/

const state = {};

const controlSearch = async () => {
    //get query from view - TODO
    const query = searchView.getInput();
    console.log(query);

    //generate new search object and add it to state
    if(query) {
        state.search = new Search(query);

    // prepare UI for results (cleaning)
    
    // perform search 
       await state.search.getResults();

    //display result
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
