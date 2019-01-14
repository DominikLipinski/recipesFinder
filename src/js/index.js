import Search from './models/Search';

/* Global state:
-search
- current recipe
- shopping list
-liked recipes
*/

const state = {};

const controlSearch = async () => {
    //get query from view - TODO
    const query = 'chicken';

    //generate new search object and add it to state
    if(query) {
        state.search = new Search(query);

    // prepare UI for results (cleaning)
    
    // perform search 
       await state.search.getResults();

    //display result
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
