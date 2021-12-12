const express = require('express');
const session = require('express-session');
const pug = require('pug');
//partials = require('express-partials')

let app = express();
app.use(express.json());
const fs = require("fs");
//use session api
app.use(session({ secret: 'some secret here'}))
//View engine
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true})); 
app.use(express.static("public"));
app.get('/',serveHome)
app.get('/bookSearch',serveBookSearchPage)
app.get('/insertBook',serveBookInsert)
app.get('/home',serveHome)
app.get('/deleteBooks',serveBookDeletionPage)
//serves for the searchParams
app.get('/bookSearchTitle/:search',searchByTitleServe)
app.get('/bookSearchGenre/:search',searchByGenreServe)
app.get('/bookSearchAuthor/:search',searchByAuthorServe)
app.get('/bookSearchPrice/:min/max/:max',searchByPriceServe)
//other gets
app.get('/bookRedirect/:isbn',sendToBookPage)
app.get('/client.js',sendClient);
app.get('/style.css',sendCSS);
app.get('/currentCart',serveCurrentCartPage);
app.get('/reports',serveReportsPage);
app.get('/login',serveLoginPage)
app.get('/logout',logout)
app.get('/register',serveRegisterPage)
//gets and posts for reports
app.get('/reports/genre', serveGenreReport)
app.get('/reports/author', serveAuthorReport)
app.get('/reports/saleDates',serveSaleDateReport)
app.post('/reports/dateRange', serveDateRangeReport)
app.post('/reports/dateRangeWithBook', serveDateRangeReportWithBook)
//posts
app.post('/insertBook', addBookToDB)
app.post('/orderBook',addBookToCart)
app.post('/deleteBook',deleteBookFromDB)
app.post('/login',login);
app.post('/register',register);
app.post('/placeOrder',placeOrder)
app.post('/placeOrderWithSaved',placeOrderWithSaved)

currentCart=[];

//connect to pg
const { Client } = require('pg');
const { query } = require('express');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
//open the server
openServer();


function placeOrderWithSaved(req,res,next){
    newOrderID = Math.floor(Math.random() * 100000000);
    newOrderID = newOrderID.toString()
    console.log(newOrderID)
    //generate the Date
    let theDate = new Date()
    theDate = theDate.toISOString().split('T')[0]
    console.log(theDate);

    client.query(`SELECT * FROM user_account where user_id = '${req.session.userID}';`)
    .then(queryResult => {
        shn=queryResult.rows[0].shipping_house_number,
        ssn=queryResult.rows[0].shipping_street	
        scn=queryResult.rows[0].shipping_city 
        spn=queryResult.rows[0].shipping_province 
        spc=queryResult.rows[0].shipping_postal_code
        bhn=queryResult.rows[0].billing_house_number
        bsn=queryResult.rows[0].billing_street	
        bcn=queryResult.rows[0].billing_city 
        bpn=queryResult.rows[0].billing_province 
        bpc=queryResult.rows[0].billing_postal_code
    })
    .then(()=>{
        client.query(`insert into user_order values('${req.session.userID}','${newOrderID}','${theDate}','124','Shipping Avenue','Bracebridge','QC','W3R3T3','${bhn}','${bsn}','${bcn}','${bpn}','${bpc}','${shn}','${ssn}','${scn}','${spn}','${spc}');`)
        .then(queryResult => {
            //loop over every item in cart
            currentCart.forEach(bookOrder =>{
                //insert the item in cart
                client.query(`insert into order_object values('${newOrderID}','${bookOrder.isbn}','${bookOrder.quantity}');`)
                .then(()=>{
                    console.log(`Added book ${bookOrder.isbn}.`)
                })
                //query insert into order object
                //query call function orderBooks
            })
        //once code has fully run
        })
        .then(()=>{
            //clear current cart
            currentCart = [];
            res.render("home",{session: req.session})
        })
    })
}

function placeOrder(req,res,next){
    //generate the orderID
    newOrderID = Math.floor(Math.random() * 100000000);
    newOrderID = newOrderID.toString()
    console.log(newOrderID)
    //generate the Date
    let theDate = new Date()
    theDate = theDate.toISOString().split('T')[0]
    console.log(theDate);

    shn=req.body.shn;
    ssn=req.body.ssn;
    scn=req.body.scn;
    spn=req.body.spn;
    spc=req.body.spc;

    bhn=req.body.bhn;
    bsn=req.body.bsn;
    bcn=req.body.bcn;
    bpn=req.body.bpn;
    bpc=req.body.bpc;

    console.log(req.session)
    //insert into user account
    client.query(`insert into user_order values('${req.session.userID}','${newOrderID}','${theDate}','124','Shipping Avenue','Bracebridge','QC','W3R3T3','${bhn}','${bsn}','${bcn}','${bpn}','${bpc}','${shn}','${ssn}','${scn}','${spn}','${spc}');`)
    .then(queryResult => {
        //loop over every item in cart
        currentCart.forEach(bookOrder =>{
            //insert the item in cart
            client.query(`insert into order_object values('${newOrderID}','${bookOrder.isbn}','${bookOrder.quantity}');`)
            .then(()=>{
                console.log(`Added book ${bookOrder.isbn}.`)
            })
            //query insert into order object
            //query call function orderBooks
        })
    //once code has fully run
    })
    .then(()=>{
        //clear current cart
        currentCart = [];
        res.render("home",{session: req.session})
    })
}

function register(req,res,next){
    //generate the random user ID
    specifierChar = 'U'
    newUserID = Math.floor(Math.random() * 10000000);
    newUserID = newUserID.toString()
    newUserID = specifierChar.concat(newUserID)
    console.log(newUserID);
    //get the values from the form
    userName = req.body.username;

    shn=req.body.shn;
    ssn=req.body.ssn;
    scn=req.body.scn;
    spn=req.body.spn;
    spc=req.body.spc;

    bhn=req.body.bhn;
    bsn=req.body.bsn;
    bcn=req.body.bcn;
    bpn=req.body.bpn;
    bpc=req.body.bpc;
    //insert the user
    client.query(`insert into user_account values('${newUserID}','${userName}', false,'${shn}','${ssn}','${scn}','${spn}','${spc}','${bhn}','${bsn}','${bcn}','${bpn}','${bpc}');`, (err, queryResult) => {
        if (err) throw err;
        //log the user in
        req.session.loggedin = true;
        req.session.username = userName;
        req.session.userID = newUserID;
        req.session.isAdmin = false;
        res.render('home',{session: req.session})
    });

}

function serveRegisterPage(req,res,next){
    res.render("register")
}

//function to logout the user
function logout(req,res,next){
    if(req.session.loggedin){
        currentCart = []
		req.session.loggedin = false;
        req.session.username = undefined;
        req.session.userID = undefined;
        req.session.isAdmin = false;
		res.render("home",{session: req.session});
	}else{
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}

//function to login the user
function login(req,res,next){

	let username = req.body.username;
	let userID = req.body.userID;

  console.log("Logging in a user with credentials:");
  console.log("Username: " + req.body.username);
  console.log("userID: " + req.body.userID);

  client.query(`SELECT * FROM user_account where name = '${username}' and user_id = '${userID}';`)
    .then(queryResult => {
        //if rowCount = 1, then the user exists.
        if (queryResult.rowCount == 1){
            req.session.loggedin = true;
            req.session.username = username;
            req.session.userID = userID;
            req.session.isAdmin = queryResult.rows[0].isadmin
            //console.log(req,session.isAdmin)
            res.render("home",{session: req.session})
        }//if the rowcount is not 1, wrong auths
        else{
            errorMessage = {
                error: true,
                session: req.session
            }
            res.render("login",errorMessage)
        }
    })
   
}

function serveLoginPage(req,res,next){
    errorMessage = {
        error: false,
        session: req.session
    }
    if(req.session.loggedin){
        console.log()
		res.render("home",{session: req.session})
        return;
	}else{
        res.render("login",errorMessage)
        return
    }
}

function deleteBookFromDB(req,res,next){
    isbn = req.body.isbn;
    console.log("About to Delete")
    client.query(`delete from book where isbn = '${isbn}'`, (err, queryResult) => {
        if (err) throw err;
        console.log(queryResult);
        console.log("should be deleted")
        res.render('home',{session: req.session});
    });
}

function serveBookDeletionPage(req,res,next){
    res.render('bookDeletion');
}

//function to serve genre report
function serveGenreReport(req,res,next){
    //define reportName
    reportName="Sales by Genre";
    //access the view
    client.query(`select * from genre_sales;`, (err, queryResult) => {
        if (err) throw err;
        let toSend = {
            rows: queryResult.rows,
            reportName: reportName,
            session: req.session
        }
        res.render('genreReport',toSend);
    });
}
//function to serve author report
function serveAuthorReport(req,res,next){
      //define reportName
      reportName="Sales by Author";
      //access the view
      client.query(`select * from author_sales;`, (err, queryResult) => {
          if (err) throw err;
          let toSend = {
              rows: queryResult.rows,
              reportName: reportName
          }
          res.render('authorReport',toSend);
      });
    
}

//function to serve sale date report
function serveSaleDateReport(req,res,next){
    //define reportName
    reportName="Sales by Date";
    //access the view
    client.query(`select * from sales_by_date_book;`, (err, queryResult) => {
        if (err) throw err;
        let toSend = {
            rows: queryResult.rows,
            reportName: reportName,
            session: req.session
        }
        res.render('saleDateReport',toSend);
    });
  
}

//function to serve date range report
function serveDateRangeReport(req,res,next){
    startDate = req.body.startDate;
    endDate= req.body.endDate;
    //console.log(startDate);
    //console.log(endDate);
    client.query(`select * from sales_between_dates('${startDate}','${endDate}');`, (err, queryResult) => {
        if (err) throw err;
        let toSend = {
            result: queryResult.rows[0],
            startDate: startDate,
            endDate: endDate,
            session: req.session
        }
        res.render("dateRangeReport",toSend)
    });
}

//function to serve date range report on a specific book
function serveDateRangeReportWithBook(req,res,next){
    startDate = req.body.startDateBook;
    endDate= req.body.endDateBook;
    isbn = req.body.isbn;
    client.query(`select * from book_sales_between_dates('${startDate}','${endDate}','${isbn}');`, (err, queryResult) => {
        if (err) throw err;
        let toSend = {
            result: queryResult.rows[0],
            startDate: startDate,
            endDate: endDate,
            isbn: isbn,
            session: req.session
        }
        res.render("dateRangeReportBook",toSend)
    });
}



function serveCurrentCartPage(req,res,next){
    res.render('cart',{cart: currentCart});
}

//function to serve the reports page
function serveReportsPage(req,res,next){
    //change to render reports
    res.render('reports');
}

//function to process adding a book to cart
function addBookToCart(req,res,next){
    isbn = req.body.isbn;
    quantity = parseInt(req.body.quantity);
    title = req.body.title;

    console.log(isbn)
    console.log(quantity)
    console.log(title);

    let found = false
    let done = false;
    let sentAlready = false;
    let bookStock;
    client.query(`SELECT * FROM book where isbn = '${isbn}';`)
    .then(queryResult => {
        //should only return one row, but we need to access iteratively
        queryResult.rows.forEach(book=>{bookStock = book.stock})
    })
    .then(()=>{
        currentCart.forEach(bookOrder=>{
            //if they are the same book
            if (bookOrder.isbn == isbn){
                //check to see if adding this will order too many books (i.e newQuantity becomes greater than stock)
                let newQuantity= bookOrder.quantity + quantity;
                if (bookStock < newQuantity){
                    console.log("STOCK TOO LOW");
                    //to ensure no double send of error message
                    sentAlready = true;
                    res.send("NOT ENOUGH BOOK STOCK TO COMPLETE THIS ORDER. (ONE ALREADY EXISTS, devnote)");
                    return;
                }
                else{
                    //if the code gets to this point, the stock is okay, so update the bookOrder in cart to have the newQuantity
                    console.log("I ADDED THE QUANTITY")
                    bookOrder.quantity = newQuantity;
                    found = true;
                    done = true;
                    console.log("found inside loop is")
                    console.log(found)
                    console.log("rendering new page")
                    res.render('cart',{cart: currentCart});
                    return;
                }
            }
        })
    })
    .then(()=>{
        if(sentAlready == false){
            console.log("found outside function loop is")
            console.log(found)
            if (found == false){
                //if code reaches here, the book is NOT already in the cart, so we check quantity, then add it
                let bookOrderToAdd = {
                    isbn: isbn,
                    quantity: quantity,
                    title: title
                }
                //check the stock
                if (bookStock < quantity){
                    console.log("STOCK TOO LOW");
                    res.send("NOT ENOUGH BOOK STOCK TO COMPLETE THIS ORDER.");
                }else{
                    console.log("I ADDED THE OBJECT")
                    currentCart.push(bookOrderToAdd)
                    res.render('cart',{cart: currentCart});
                }
            }
        }
    })
}



//serve the book search page:
function serveBookSearchPage(req,res,next){
     //make a query for the whole page
     client.query(`SELECT * FROM book;`, (err, queryResult) => {
        res.render('bookSearch',queryResult);
    });
}


//function to insert a book into db
function addBookToDB(req,res,next){
    //two ways to get ISBN, one is to increment by one for each book, so get the "max" ISBN from the db
    //other is to just make a random number:
    let isbn = Math.floor(Math.random() * 100000000000);
    isbn = isbn.toString();
    //get the rest of the parameters.
    let title = req.body.title;
    let genre = req.body.genre;
    let price = parseFloat(req.body.price);
    let stock = parseInt(req.body.stock);
    let num_pages = parseInt(req.body.num_pages);
    let pub_cut = parseFloat(req.body.pub_cut);
    let authors = req.body.author_id.split(",");
    let publishers = req.body.publisher_id.split(",");

    //add the book to db
    client.query(`insert into book values('${isbn}','${title}','${genre}',${price},${stock},${num_pages},${pub_cut})`), (err, queryResult) => {
        if (err) throw err;
    }
    //add the book to wrote:
    authors.forEach(author=>{
        console.log(author)
        client.query(`insert into wrote values('${isbn}','${author}')`), (err, queryResult) => {
            if (err) throw err;
        }
    })
     //add the book to published:
     publishers.forEach(publisher=>{
        console.log(publisher)
        client.query(`insert into published values('${isbn}','${publisher}')`), (err, queryResult) => {
            if (err) throw err;
        }
    })
    
    
    //redirect to the book's page
    client.query(`SELECT * FROM book where isbn = '${isbn}';`, (err, queryResult) => {
        res.render('book',queryResult);
    });
}
//serve the book insert page
function serveBookInsert(req,res,next){
    res.render("insertBook");
}


//send to a book page based on the isbn received from link
function sendToBookPage(req,res,next){
    let isbnToSearch = req.params.isbn;
    client.query(`SELECT * FROM book where isbn = '${isbnToSearch}';`, (err, queryResult) => {
        res.render('book',queryResult);
    });
}

//BOOK SEARCHES

//rerender the bookSearch page based on a title search query received from client
function searchByTitleServe(req,res,next){
    let titleToSearch = req.params.search;
    client.query(`SELECT * FROM book where title = '${titleToSearch}';`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/bookSearch.pug",queryResult));
    });
}

//rerender the home page based on a genre search query received from client
function searchByGenreServe(req,res,next){
    let genreToSearch = req.params.search;
    client.query(`SELECT * FROM book where genre = '${genreToSearch}';`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/bookSearch.pug",queryResult));
    });
}

//rerender the home page based on a author search query received from client
function searchByAuthorServe(req,res,next){
    let authorToSearch = req.params.search;
    client.query(`SELECT * FROM book natural join wrote natural join author where name = '${authorToSearch}';`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/bookSearch.pug",queryResult));
    });
}

//rerender the home page based on a price search query received from client
function searchByPriceServe(req,res,next){
    let minToSearch = req.params.min;
    let maxToSearch = req.params.max;
    client.query(`SELECT * FROM book where price >= ${minToSearch} and price <= ${maxToSearch};`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/bookSearch.pug",queryResult));
    });
}


//function to serve the home page
function serveHome(req,res,next){
    res.render('home');
}

//open the server
function openServer(){
    app.listen(process.env.PORT || 3000);
    client.connect();
    console.log("Server listening at http://localhost:3000");
}

//read and send the js file for use
function sendClient(req,res,next){
	fs.readFile("client.js", function(err, data){
		if(err){
			res.status(500).send("Error.");
			return;
		}
		res.status(200).send(data)
	});
}

//read and send the js file for use
function sendCSS(req,res,next){
	fs.readFile("style.css", function(err, data){
		if(err){
			res.status(500).send("Error.");
			return;
		}
		res.status(200).send(data)
	});
}



/*function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }*/

