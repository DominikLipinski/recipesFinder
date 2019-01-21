import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
    //get query from view 
    const query = searchView.getInput();

    //generate new search object and add it to state
    if(query) {
        state.search = new Search(query);

    try {
    // prepare UI for results (cleaning)
         searchView.clearInput();
         searchView.clearResults();
         renderLoader(elements.searchRes);
    // perform search 
        await state.search.getResults();
    //display result
         clearLoader();
         searchView.renderResults(state.search.result);   
    } catch (error) {
        console.log(error);
        clearLoader();
    }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// 4 test
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected item
        if(state.search) searchView.higlitedSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        try {
        //get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        //render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        } catch(err) {
        console.log(err);
        }

    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// recipe servings button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
});
