const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body);
    if(blog.likes === undefined){
        blog.likes = 0;
    }
    if(!blog.title ||!blog.url){
        response.status(400).json({error: 'title or url missing'});
        return;
    }

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
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
