//jshint esversion:6

// hello arya, the smart contract is up and running have a look at it....all the basic things are done
// my app will function as simply as you said....
// go to login page will find two buttons login and register..
// the login button will cheack the validateUser function of Smart contracts
// the signup button will fire registerUser function from SC.
// havent wrote any function such in js till now...






const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
var Web3 = require("web3");
var contract = require('@truffle/contract');
var socialJSON = require("../build/contracts/Social.json");
var { JSDOM } = require('jsdom');


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
let posts = [];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// async function isEnabled(){
//   if (window.ethereum) {
//     window.web3 = new Web3(window.ethereum);
//     window.ethereum.enable();
//     return true;
//   }
//   return false;
// }
// isEnabled();



const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
const socialContract = contract(socialJSON)
const networkID = web3.eth.net.getId()
socialContract.setProvider(web3.currentProvider)
socialContract.setNetwork(networkID)



// Make Calls To Contract as you want


app.post('/login', async function (request, response) {
  async function validUser(){
    let accounts = await web3.eth.getAccounts()
    const socialContractInstance = await socialContract.deployed()
    var reg = await socialContractInstance.validateUser(request.body.address, {from: accounts[0]})
    console.log(reg)
    return reg;
  }

  try {
    let valid = await validUser()
    if(valid){
      console.log("Address", request.body.address)
      response.redirect("/home")
    }
    else {
      console.log("Address", request.body.address)
      // response.send("Thanks")

      // Async Function calls smart contract

      let accounts = await web3.eth.getAccounts()
      const socialContractInstance = await socialContract.deployed()
      let _ = await socialContractInstance.registerUser(request.body.address, {from: accounts[0]})
      console.log(_)

      response.redirect("/home")
    }


  } catch (err) {
    response.send("Error")
    console.log(err)
  }
})





app.get("/", function (req, res) {
  res.render("login", {

  })
});
app.get("/failure", function (req, res) {
  res.render("failure", {                                               // #use the failure page here
    // homeStartingContent: homeStartingContent,
    // posts: posts
  });


});
app.get("/home", function (req, res) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts
  });

});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContentkey: contactContent
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContentkey: aboutContent
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/failure", function (req, res) {
  res.render("login");
});


app.post("/compose", function (req, res) {

  const post = {
    title: req.body.txt1,
    content: req.body.txt2
  };


  posts.push(post);
  res.redirect("/");

});

app.get('/posts/:newPost', function (req, res) {
  const requestedTitle = _.lowerCase(req.params.newPost);

  posts.forEach(function (post) {
    const storedTitle = _.lowerCase(post.title);


    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });

    }
  });

});





app.listen(3000, function () {
  console.log("Server started on port 3000");
});







// ---------------------------------------------------------------------------------------------------------------------------------------

                                           // ETHEREUM started

// --------------------------------------------------------------------------------------------------------------------------------------------

// App = {
//   if (typeof web3 !== 'undefined') {
//   App.web3Provider = web3.currentProvider;
//   web3 = new Web3(web3.currentProvider);
// } else {
//   // If no injected web3 instance is detected, fallback to Ganache.
//   App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
//   web3 = new Web3(App.web3Provider);
// }
