import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/blog")
      .then((response) => {
        console.log(response.data);
        setBlogs(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>Popular Blogs : {blogs.length}</h1>

      <div className="main">
        {blogs.map((blog) => {
          return (
            <div key={blog.id} className="container">
              <div className="card">
                <h2> {blog.title} </h2>
                <p> {blog.description} </p>
                <p> {blog.author} </p>
                <p> {blog.publishedAt} </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
