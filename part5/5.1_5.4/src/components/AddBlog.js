import React from 'react';
const AddBlog = ({
    handleAdd,
    setAuthor,
    setTitle,
    setUrl,
    author,
    title,
    url,
}) => (
    <form onSubmit={handleAdd}>
        <div>
            <h2>new blog</h2>
            author
            <input
                type="text"
                value={author}
                name="Author"
                onChange={({ target }) => setAuthor(target.value)}
            />
        </div>
        <div>
            title
            <input
                type="text"
                value={title}
                name="Title"
                onChange={({ target }) => setTitle(target.value)}
            />
        </div>
        <div>
            url
            <input
                type="text"
                value={url}
                name="url"
                onChange={({ target }) => setUrl(target.value)}
            />
        </div>
        <button type="submit">submit</button>
    </form>
);

export default AddBlog;
