const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
    response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body);
    const user = request.user;
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken){
        return response.status(401).json({error: 'token missing or invalid'});
    }
    if(blog.likes === undefined){
        blog.likes = 0;
    }
    if(!blog.title ||!blog.url){
        response.status(400).json({error: 'title or url missing'});
        return;
    }
    blog.author = user.name;
    blog.user = user._id;
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken){
        return response.status(401).json({error: 'token missing or invalid'});
    }
    const user = request.user;
    const findBlog = await Blog.findById(request.params.id);
    if(findBlog.user.toString() === user._id.toString()){
        await Blog.findByIdAndRemove(request.params.id);
        response.status(204).end();
    }
    else{
        response.status(400).end();
    }

});

blogsRouter.put('/:id', async (request, response) =>{
    const body = request.body;
    const blog = {
        likes: body.likes,
    };
    let blogResponse = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true});
    response.json(blogResponse);
    
});

module.exports = blogsRouter;
