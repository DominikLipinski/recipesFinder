import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state:
-search
- current recipe
- shopping list
-liked recipes
*/

const state = {};
window.state = state;


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
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch(err) {
        console.log(err);
        }

    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/*-- SHOPPING LIST CONTROLLER --*/

const controlList = () => {
    
    if(!state.list) state.list = new List();

    //add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// delete and update list items
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    //count update arrows    
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});

/*-- LIKES CONTROLLER --*/

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //user has yet NOT liked recipe
    if(!state.likes.isLiked(currentID)) {
    // add like to state
    const newLike = state.likes.addLike(
        currentID,
        state.recipe.title,
        state.recipe.author,
        state.recipe.img
        );
    //toogle likes button
    likesView.toggleLikeBtn(true);
    //add like to UI list
    likesView.renderLike(newLike);
    //user HAS liked recipe    
    } else {
    // remove like from state
    state.likes.deleteLike(currentID);
    //toogle likes button
    likesView.toggleLikeBtn(false);
    //remove like from UI list
    likesView.deleteLike(currentID);      
    }

    likesView.toogleLikeMenu(state.likes.getNumLikes());
};

// restore likes from local storage on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toogleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// recipe servings button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease button
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // like controller
        controlLike();
    }
});


