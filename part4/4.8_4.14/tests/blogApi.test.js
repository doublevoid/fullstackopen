const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    let content = response.body;
    console.log(content);
});

test('blogs have unique identifier named id', async () => {
    const response = await api.get('/api/blogs');
    const body = response.body;
    body.forEach((a) => {
        expect(a.id).toBeDefined();
        console.log(a.id);
    });
});

test('blog can be created', async () => {
    const newPost = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    };

    await api
        .post('/api/blogs')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((b) => b.url);
    expect(contents).toContain(
        'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    );
});

test('blog with no likes gets assigned to zero likes', async () => {
    const newPost = {
        title: 'xd',
        author: 'bielpk',
        url: 'bielpk.com',
    };

    const response = await api.post('/api/blogs').send(newPost).expect(201);

    expect(response.body.likes).toBe(0);
});

test('blog without title or url fucks up', async () => {
    const newPost = {
        title: 'xd',
        author: 'bielpk',
    };

    const newPostSecond = {
        author: 'bielpk',
        url: 'xd',
    };

    await api.post('/api/blogs').send(newPost).expect(400);
    await api.post('/api/blogs').send(newPostSecond).expect(400);
});

test('deletion of a post', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    await api.delete(`/api/blogs/${response.body[0].id}`).expect(204);
});

test('editing the likes of a post', async () => {
    const getNotes = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    
    const newPostLikes = {
        likes:100000
    };

    const response = await api.put(`/api/blogs/${getNotes.body[0].id}`).send(newPostLikes);
    expect(response.body.likes).toBe(100000);
});

afterAll(() => {
    mongoose.connection.close();
});
