const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

//connect database
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fcmanhwa",
});

con.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Database is connected!");
});

app.get("/api/fcmanhwa", (req, res) => {
  con.query(
    // * = manhwa_list.manh_id, manhwa_list.manh_name, manhwa_list.manh_desc, manhwa_list.manh_rating, cate_manhwa.cate_id, cate_manhwa.country
    // "SELECT * FROM manhwa_list, cate_manhwa WHERE manhwa_list.cate_id = cate_manhwa.cate_id",
    "SELECT * FROM manhwa_list INNER JOIN cate_manhwa ON manhwa_list.cate_id = cate_manhwa.cate_id",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.json(result);
    }
  );
});

app.get("/api/fcmanhwa/:id", (req, res) => {
  const manh_id = req.params.id;
  con.query(
    "SELECT * FROM manhwa_list, cate_manhwa WHERE manh_id = (?) AND manhwa_list.cate_id = cate_manhwa.cate_id",
    [manh_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.json(result);
    }
  );
});

app.get("/api/category/fcmanhwa", (req, res) => {
  // const cate_id = req.params.slug;
  con.query(
    "SELECT * FROM cate_manhwa ",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.json(result);
    }
  );
});

app.get("/api/category/:id/fcmanhwa", (req, res) => {
  const cate_id = req.params.id;
  con.query(
    "SELECT * FROM cate_manhwa INNER JOIN manhwa_list ON cate_manhwa.cate_id = manhwa_list.cate_id AND manhwa_list.cate_id = (?)",[cate_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.json(result);
    }
  );
});

app.post("/api/create/fcmanhwa", (req, res) => {
  const {manh_name, manh_desc, manh_rating, cate_id } = req.body;
  const sql =
    "INSERT INTO manhwa_list (manh_name,manh_desc,manh_rating,cate_id) VALUES (?,?,?,?) ";
  con.query(
    sql,
    [manh_name, manh_desc, manh_rating, cate_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.json(result);
    }
  );
});

app.delete("/api/delete/fcmanhwa/:id",(req,res)=>{
  const manh_id = req.params.id;
  const sql = "DELETE FROM manhwa_list WHERE manh_id = (?)";
  con.query(sql,[manh_id],(err,result)=>{
    if (err) {
      res.status(404).json({error: "Delete Failled."});
    }
    res.json({
      data: "Delete Success."
    });
  });
});

app.put("/api/update/manhname/fcmanhwa/:id",(req,res)=>{
  const manh_id = req.params.id;
  const {manh_name} = req.body;
  const sql = "UPDATE manhwa_list SET manh_name = (?) WHERE manh_id = (?)";
  con.query(sql,[manh_id,manh_name],(err,result)=>{
    if (err) {
      res.status(404).json({error: "Update Failled."});
    }
    res.json(result);
  });

})

const port = 8080;
app.listen(port, () => {
  console.log("SERVER-SIDE IS RENDERING IN PORT: " + port);
});
