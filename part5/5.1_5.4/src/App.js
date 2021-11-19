import React, { useState, useEffect } from 'react';
//import Blog from './components/Blog';
import blogService from './services/blogs';
import LoginForm from './components/Form';
//import BlogForm from './components/Form';
import Blog from './components/Blog';
import loginService from './services/login';
import AddBlog from './components/AddBlog';
import Notification from './components/Notification';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [notification, setNotification] = useState(null);
    const [siteStatus, setStatus] = useState('home');
    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    useEffect(() => {
        const loggedUser = window.localStorage.getItem('loggedBlogAppUser');
        if (loggedUser) {
            const user = JSON.parse(loggedUser);
            setUser(user);
            blogService.setToken(user.token);
            setStatus('different');
        }
    }, []);

    const handleLogoff = () => {
        window.localStorage.removeItem('loggedBlogAppUser');
        setUser(null);
        setStatus('home');
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const blog = {
                author: author,
                title: title,
                url: url,
            };
            const newBlog = await blogService.create(blog);
            setBlogs(blogs.concat(newBlog));
            setNotification(
                `You've successfully added ${blog.title} to the blog list.`
            );
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        } catch (exception) {
            setNotification(`${exception}`);
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await loginService.login({
                username,
                password,
            });
            window.localStorage.setItem(
                'loggedBlogAppUser',
                JSON.stringify(user)
            );
            setUser(user);
            setNotification('You\'ve succesfully logged in.');
            setTimeout(() => {
                setNotification(null);
            }, 5000);
            setUsername('');
            setPassword('');
            setStatus('different');
        } catch (exception) {
            setNotification(`${exception}`);
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await loginService.register({
                username,
                password,
            });
            setNotification('You\'ve succesfully registered.');
            setTimeout(() => {
                setNotification(null);
            }, 5000);
            setUsername('');
            setPassword('');
            setStatus('home');
        } catch (exception) {
            setNotification(`${exception}`);
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    };

    const handleLoginForm = () => (
        <LoginForm
            handleLogin={(val) => handleLogin(val)}
            setUsername={(val) => setUsername(val)}
            setPassword={(val) => setPassword(val)}
            password={password}
            username={username}
        />
    );

    const handleSignup = () => (
        <LoginForm
            setUsername={(val) => setUsername(val)}
            setPassword={(val) => setPassword(val)}
            password={password}
            username={username}
            handleSignup={(val) => handleRegister(val)}
        />
    );

    const handleAddBlog = () => (
        <AddBlog
            handleAdd={(val) => handleAdd(val)}
            setAuthor={(val) => setAuthor(val)}
            setTitle={(val) => setTitle(val)}
            setUrl={(val) => setUrl(val)}
            author={author}
            title={title}
            url={url}
        />
    );

    return (
        <div>
            <Notification message={notification} />
            {siteStatus == 'home' ? (
                <div>
                    <h1>login or register</h1>
                    <button onClick={() => setStatus('login')}>login</button>
                    <button onClick={() => setStatus('register')}>register</button>
                </div>
            ) : siteStatus == 'register' ? (
                <div>{handleSignup()}</div>
            ) : siteStatus == 'login' ? (
                <div>{handleLoginForm()}</div>
            ) : (
                <div>
                    <p>
                        {user.name} logged-in
                        <button onClick={() => handleLogoff()}>logout</button>
                    </p>
                    <div>
                        
                        {handleAddBlog()}
                        <h2>blogs</h2>
                        {blogs.map((blog) => (
                            <Blog key={blog.id} blog={blog} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
