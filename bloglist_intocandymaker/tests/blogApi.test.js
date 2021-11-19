const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const api = supertest(app);
const bcrypt = require('bcrypt');
const User = require('../models/user');

let loggedInToken;

beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('pass153', 10);
    const user = new User({
        username: 'bielpk',
        passwordHash,
    });
    await user.save();

    const response = await api.post('/api/login/').send({
        username: 'bielpk',
        password: 'pass153',
    });

    loggedInToken = response.body.token;
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
        .set({ Authorization: `bearer ${loggedInToken}` })
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

    const response = await api.post('/api/blogs').set({ Authorization: `bearer ${loggedInToken}` }).send(newPost).expect(201);

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

    await api.post('/api/blogs').set({ Authorization: `bearer ${loggedInToken}` }).send(newPost).expect(400);
    await api.post('/api/blogs').set({ Authorization: `bearer ${loggedInToken}` }).send(newPostSecond).expect(400);
});

test('deletion of a post', async () => {
    const newPost = {
        title: 'xd',
        author: 'bielpk',
        url: 'bielpk.com',
    };
    const response = await api.post('/api/blogs').set({ Authorization: `bearer ${loggedInToken}` }).send(newPost).expect(201);
    await api.delete(`/api/blogs/${response.body.id}`).set({ Authorization: `bearer ${loggedInToken}` }).expect(204);
});

test('editing the likes of a post', async () => {
    const getNotes = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const newPostLikes = {
        likes: 100000,
    };

    const response = await api
        .put(`/api/blogs/${getNotes.body[0].id}`)
        .send(newPostLikes);
    expect(response.body.likes).toBe(100000);
});

//...

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u) => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('`username` to be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
