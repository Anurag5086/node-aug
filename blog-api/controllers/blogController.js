const blogData = [
  {
    id: 1,
    title: "Getting Started with Node.js",
    content: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows developers to build scalable server-side applications using JavaScript.",
    author: "Anurag Gupta",
    category: "Node.js"
  },
  {
    id: 2,
    title: "Introduction to Express.js",
    content: "Express.js is a minimal and flexible web framework for Node.js that simplifies routing, middleware, and API development.",
    author: "Rahul Sharma",
    category: "Express.js"
  },
  {
    id: 3,
    title: "Understanding REST APIs",
    content: "REST APIs use HTTP methods like GET, POST, PUT, PATCH, and DELETE to perform CRUD operations between clients and servers.",
    author: "Priya Singh",
    category: "API"
  },
  {
    id: 4,
    title: "What is Middleware?",
    content: "Middleware functions execute during the request-response cycle. They can modify requests, responses, or terminate the cycle.",
    author: "Amit Verma",
    category: "Express.js"
  },
  {
    id: 5,
    title: "Route Parameters Explained",
    content: "Route parameters allow dynamic values in URLs, such as /users/:id, making APIs flexible and reusable.",
    author: "Anurag Gupta",
    category: "Routing"
  },
  {
    id: 6,
    title: "Query Parameters in Express",
    content: "Query parameters are used to filter, sort, or search data. Example: /products?category=electronics.",
    author: "Rohan Mehta",
    category: "Routing"
  },
  {
    id: 7,
    title: "MVC Architecture in Node.js",
    content: "MVC separates an application into Models, Views, and Controllers, improving maintainability and scalability.",
    author: "Neha Gupta",
    category: "Architecture"
  },
  {
    id: 8,
    title: "Handling Errors in Express",
    content: "Express provides centralized error handling using middleware to catch and respond to application errors.",
    author: "Vikram Patel",
    category: "Express.js"
  },
  {
    id: 9,
    title: "Working with JSON Data",
    content: "JSON is the most common format for exchanging data between frontend and backend applications.",
    author: "Karan Malhotra",
    category: "JavaScript"
  },
  {
    id: 10,
    title: "HTTP Methods Explained",
    content: "GET retrieves data, POST creates data, PUT replaces data, PATCH updates data partially, and DELETE removes data.",
    author: "Anurag Gupta",
    category: "HTTP"
  },
  {
    id: 11,
    title: "Why Learn Backend Development?",
    content: "Backend development powers the logic, database interactions, authentication, and APIs behind modern web applications.",
    author: "Arjun Joshi",
    category: "Backend"
  },
  {
    id: 12,
    title: "Introduction to MongoDB",
    content: "MongoDB is a NoSQL database that stores data in flexible JSON-like documents instead of tables.",
    author: "Meera Nair",
    category: "Database"
  },
  {
    id: 13,
    title: "Express Router Basics",
    content: "Express Router helps organize routes into separate modules, making large applications easier to maintain.",
    author: "Harsh Agarwal",
    category: "Express.js"
  },
  {
    id: 14,
    title: "Building Your First API",
    content: "Creating an API involves defining routes, handling requests, validating data, and sending JSON responses.",
    author: "Anurag Gupta",
    category: "API"
  },
  {
    id: 15,
    title: "Understanding Status Codes",
    content: "HTTP status codes like 200, 201, 400, 401, 404, and 500 indicate the result of an HTTP request.",
    author: "Ritika Jain",
    category: "HTTP"
  },
  {
    id: 16,
    title: "Introduction to Authentication",
    content: "Authentication verifies user identity using techniques such as sessions, cookies, or JWT tokens.",
    author: "Aditya Rao",
    category: "Security"
  },
  {
    id: 17,
    title: "Environment Variables in Node.js",
    content: "Environment variables help store sensitive information like API keys and database credentials securely.",
    author: "Pooja Arora",
    category: "Node.js"
  },
  {
    id: 18,
    title: "Async Programming in JavaScript",
    content: "Promises and async/await simplify asynchronous programming, making code easier to read and maintain.",
    author: "Sahil Bansal",
    category: "JavaScript"
  },
  {
    id: 19,
    title: "Introduction to CRUD Operations",
    content: "CRUD stands for Create, Read, Update, and Delete, the four basic operations performed on data.",
    author: "Nisha Verma",
    category: "Database"
  },
  {
    id: 20,
    title: "Deploying a Node.js Application",
    content: "Node.js applications can be deployed on platforms like Render, Railway, AWS, and DigitalOcean with minimal configuration.",
    author: "Yash Khanna",
    category: "Deployment"
  }
];

exports.getBlogById = (req, res) => {
    const blogId = parseInt(req.params.id)

    const blogPost = blogData.find(blog => blog.id === blogId)

    if(!blogPost){
       res.status(404).json({ success: false, message: "Blog post not found!" })
    }

    res.status(200).json({ success: true, message: "Blog found successfully!" , blogPost })
}

exports.getAllBlogs = (req, res) => {
    let filteredBlogs = blogData

    if(req.query.author){
        const author = req.query.author
        filteredBlogs = filteredBlogs.filter(blog => blog.author.toLowerCase() === author.toLowerCase())
    }

    if(req.query.category){
        const category = req.query.category
        filteredBlogs = filteredBlogs.filter(blog => blog.category.toLowerCase() === category.toLowerCase())
    }

    res.status(200).json({ success: true, message: "Blogs found successfully!" , blogs: filteredBlogs })
}

