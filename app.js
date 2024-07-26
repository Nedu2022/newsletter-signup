const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const https = require("https");
const { url } = require('inspector');
const path = require('path');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html"); 
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
          }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/0f099e87bf";

  const options = {
    method: "POST",
    auth: "nnedu1:70e21a84f70869acb66edb231308fcc5-us17"
  }

  const request = https.request(url, options, function(response) {

    response.on('data', function (data) {
      const parsedData = JSON.parse(data);

      if (response.statusCode === 200 && parsedData.error_count === 0) {
        res.sendFile(path.join(__dirname, 'public', 'success.html'));
      } else {
        res.sendFile(path.join(__dirname, 'public', 'failure.html'));
      }

    });
  });

  request.write(jsonData);
  request.end();
  
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})


app.listen(3000, function() {
  console.log("server is running on port 3000")
})


//API KEY
//

//List ID
//
