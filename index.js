import express from "express";

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (_req, res) => {
  return res.send({
    message: "Welcome to our Real Estate App",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
