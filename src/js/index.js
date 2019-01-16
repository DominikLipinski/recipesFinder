import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state:
-search
- current recipe
- shopping list
-liked recipes
*/

const state = {};


/*-- SEARCH CONTROLLER --*/

const controlSearch = async () => {
    //get query from view - TODO
    const query = searchView.getInput();
    console.log(query);

    //generate new search object and add it to state
    if(query) {
        state.search = new Search(query);

    // prepare UI for results (cleaning)
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
    // perform search 
       await state.search.getResults();

    //display result
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/*-- RECIPE CONTROLLER --*/

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if(id) {
        //prepare UI

        //create new recipe object
        state.recipe = new Recipe(id);

        //get recipe data
        await state.recipe.getRecipe();

        //calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        //render recipe
        console.log(state.recipe);
    }
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);