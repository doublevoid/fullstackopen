const dummy = (blogs) => {
    console.log(blogs);
    return 1;
};

const totalLikes = (blogs) => {
    let totalLikes = 0;
    blogs.forEach((blog) => {
        totalLikes = totalLikes + blog.likes;
    });
    return totalLikes;
};

const favoriteBlog = (blogs) => {
    let favoriteBlog = { name: 'blog', likes: 0 };
    blogs.forEach((blog) => {
        if (blog.likes > favoriteBlog.likes) favoriteBlog = blog;
    });
    return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes,
    };
};

const mostBlogs = (blogs) => {
    let mostBlogs = {};
    blogs.forEach((blog) => {
        mostBlogs[blog.author] = mostBlogs[blog.author]
            ? mostBlogs[blog.author] + 1
            : 0 + 1;
    });
    let maxAuthor = Object.keys(mostBlogs).reduce((a, b) =>
        mostBlogs[a] > mostBlogs[b] ? a : b
    );
    mostBlogs = { author: maxAuthor, blogs: mostBlogs[maxAuthor] };
    return mostBlogs;
};

const mostLikes = (blogs) => {
    let mostLikes = {};
    blogs.forEach((blog) => {
        mostLikes[blog.author] = mostLikes[blog.author]
            ? mostLikes[blog.author] + blog.likes
            : 0 + blog.likes;
        //mostLikes['likes'] = mostLikes['likes'] + blog;
    });
    let maxAuthor = Object.keys(mostLikes).reduce((a, b) =>
        mostLikes[a] > mostLikes[b] ? a : b
    );
    mostLikes = {author: maxAuthor, likes: mostLikes[maxAuthor]};
    return mostLikes;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
