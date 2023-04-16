const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

client.setConfig({
    apiKey: process.env.API_KEY,
    server: "us21"
  });

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
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

    const run = async () => {
        const response = await client.lists.batchListMembers(process.env.NEWSLETTER_LIST_ID, data);
        if(response.error_count > 0){
            res.sendFile(__dirname + "/failure.html");
        }
        else{
            res.sendFile(__dirname + "/success.html");
        }
      };
      
    run();
})

app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running on port 3000");
});
