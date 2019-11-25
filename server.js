const http = require('http');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const httpServer = http.createServer(app);
const config = require('./config.json');

const PORT = process.env.PORT || 3000;

httpServer.listen(3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const List = require('./mongo/models/List');

mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to Mongo');
    }
  });

app.use(session({ secret: config.sessionSecret, saveUninitialized: true, resave: true }));
app.use(cookieParser());

app.get('/api', (req, res) => {
  List.find().then((resp, err) => {
    if (err) {
      console.log(`Mongo Error!: ${err}`);

      res
        .status(200)
        .contentType('json')
        .end({ data: 'Mongo Error!' });
    } else {
      let returned = '';

      resp.forEach((item, index) => {
        let itemObject = '';

        itemObject += `"id": "${item.id}",`;
        itemObject += `"name": "${item.name}",`;
        itemObject += `"dueDate": "${item.dueDate}",`;
        itemObject += `"done": ${item.done}`;

        if (index !== resp.length - 1) {
          returned += `{${itemObject}},`;
        } else {
          returned += `{${itemObject}}`;
        }
      });

      res
        .status(200)
        .contentType('json')
        .end(`{"todo": [${returned}]}`);
    }
  });
});

app.post('/api', (req, res) => {
  if (req.query.name) {
    let entry;

    if (req.query.date) {
      entry = new List({ name: req.query.name, dueDate: req.query.date, done: false });
    } else {
      entry = new List({ name: req.query.name, done: false });
    }

    entry.save(() => {
      res
        .status(200)
        .contentType('text')
        .end('success');
    });
  } else {
    res
      .status(400)
      .contentType('text')
      .end('Missing Parameter');
  }
});

app.patch('/api', (req, res) => {
  if (req.query.id) {
    List.findOne({ _id: req.query.id }, (err, resp) => {
      if (!err) {
        resp.done = !resp.done;
        resp.save();
        res
          .status(200)
          .contentType('text')
          .end('success');
      }
    });
  } else {
    res
      .status(400)
      .contentType('text')
      .end('Missing Parameter');
  }
});
