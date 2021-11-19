import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
    token = `bearer ${newToken}`;
};

const create = async (newBlog) => {
    console.log(token);
    const config = {
        headers: { Authorization: token },
    };

    const response = await axios.post(baseUrl, newBlog, config);
    return response.data;
};

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then((response) =>{ return response.data;});
};

export default { getAll, setToken, create };
