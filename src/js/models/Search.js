import axios from 'axios';


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = '8fcb4a11834b907ae4e2d48ee3fc2fd6';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        }
        catch(error) {
            console.log(error);
        }
    };

}