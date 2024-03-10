import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT || 4000;

// const blog = [
//   {
//     id: 5,
//     title: "Responsive Web Design Principles",
//     description:
//       "Learn the principles of responsive web design and how to create websites that work well on all devices.",
//     author: "David Wilson",
//     publishedAt: "2024-02-07",
//   },
// ];

connectDb()
  .then(() => {
    // app.get("/api/blog", (req, res) => {
    //   res.send(blog);
    // });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });
