import axios from 'axios';

const getResults = async(query) => {
    const key = '8fcb4a11834b907ae4e2d48ee3fc2fd6';
    const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    console.log(res);
};

getResults('pizza');