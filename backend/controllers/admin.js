const Product = require('../backend/models/product');
const CurrentSong = require('../backend/models/currentsong');

const Parser = require('icecast-parser');
const timestamp = require('time-stamp');

let currentDate = function getDate() {
  return timestamp();
};
let currentTime = function getTime() {
  return timestamp('HH:mm:ss');
};

// MetaData setup
const radioStation = new Parser({
  url: 'http://janus.cdnstream.com:5726/stream', // URL to radio station
  userAgent: 'Parse-Icy', // userAgent to request
  keepListen: false, // don't listen radio station after metadata was received
  autoUpdate: true, // update metadata after interval
  errorInterval: 10 * 60, // retry connection after 10 minutes
  emptyInterval: 5 * 60, // retry get metadata after 5 minutes
  metadataInterval: 30, // update metadata after 30 seconds
});

radioStation.on('metadata', function (metadata) {

  let song = function getSong() {
    return metadata.StreamTitle;
  };

  const nowPlaying = song();
  const date = currentDate();
  const time = currentTime();
  const currentSong = new CurrentSong(nowPlaying, date, time);
  currentSong.save();
});


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
