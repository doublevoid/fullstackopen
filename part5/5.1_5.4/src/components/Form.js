import React from 'react';
const LoginForm = ({
    handleLogin,
    setUsername,
    setPassword,
    password,
    username,
    handleSignup,
    setStatus
}) => {
    let buttontext = 'login';
    if (handleSignup) {
        handleLogin = handleSignup;
        buttontext = 'signup';
    }
    return (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">{buttontext}</button>
            <button  onClick={() => setStatus('home')}>home</button>
        </form>
        
    );
};

const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => (
    <form onSubmit={addBlog}>
        <input value={newBlog} onChange={handleBlogChange} />
        <button type="submit">save</button>
    </form>
);

export default LoginForm;
BlogForm;
