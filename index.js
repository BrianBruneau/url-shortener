var express = require('express');
var bodyParser = require('body-parser')
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var Hashids = require("hashids"),
hashids = new Hashids("this is my salt");
var db = require('./models')
var app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/static'));
app.use(session({
  secret: 'dsalkfjasdflkjgdfblknbadiadsnkl',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function(req, res) {
  res.render('index')
})

app.post('/links', function(req, res) {
  db.link.findOrCreate({
    where: {
      url: req.body.url
    }
}).spread(function(link) {
    var encoded = hashids.encode(link.id);
    link.hash = encoded;
    link.save();
    res.redirect('/links/' + link.id)
  }).catch(function(err) {
    res.send(err);
  });
});

app.get('/links/:id', function(req, res) {
  db.link.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(link){
    res.render('links', {link: link});
  })
})

app.get('/:hash', function(req, res) {
  db.link.findOne({
    where: {
      hash: req.params.hash
    }
  }).then(function(link){
    res.redirect(link.url);
  }).catch(function(err) {
    res.send(err);
  })
});



var port = 3000;
app.listen(port, function() {
  console.log("You're listening to the smooth sounds of port " + port);
});  