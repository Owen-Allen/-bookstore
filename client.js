let currentRestaurant;
let currentCats = [];
let currWorkingID;

//for MODIFYING RESTAURANT

function init(){
    let req = new XMLHttpRequest();

    //read JSON data and update page accordingly.
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            currentRestaurant= JSON.parse(this.responseText)
            console.log(currentRestaurant)
            //make currentCats array
            for ( key in currentRestaurant.restaurant.menu){
                currentCats.push(key)
            }
            //get working ID for later use
            getLatestID();
        }
	}
	

	//Send a GET request for data
    //get id from page
    let restID = document.getElementById("restID").value
    console.log(restID)
	req.open("get", `/restaurants/${restID}`);
    req.setRequestHeader("Content-Type", "application/json")
	req.send();
}

function save(){
    //get values if anything changed for name, delivfee or min order
    let restName = document.getElementById("name").value
    let delivFee = document.getElementById("delivery_fee").value
    let minOrder= document.getElementById("min_order").value
    //ensure valid input
    if(restName && minOrder&& (!isNaN(minOrder)) && delivFee && (!isNaN(delivFee))){
        //redefine restaurant
        restaurantToSend= currentRestaurant.restaurant;
        restaurantToSend.name = restName;
        restaurantToSend.min_order = minOrder;
        restaurantToSend.delivery_fee=delivFee;
        console.log(restaurantToSend)
        //send restaurant data to server:
        let req = new XMLHttpRequest();
        //let
        req.onreadystatechange = function() {
            if(this.readyState==4 && this.status==200){
                alert("Changes Saved! Redirecting to Restaurants view")
                window.location.replace(`https://boppa-bat-bookstore.herokuapp.com/restaurants`);
            }
        }

        //open and send
        req.open("PUT", `/restaurants/${restaurantToSend.id}`);
        req.setRequestHeader("Content-Type", "application/json")
	    req.send(JSON.stringify(restaurantToSend));

    }else{//if input invalid
        alert("Error in filling out fields, please ensure all fields are filled and valid. Restaurant Data (if changed) must be valid")
    }

}

function addNewItem(){
    //get values from html and perform server check
    currWorkingID++;
    let newID = currWorkingID;
    let newItemName = document.getElementById("itemName").value
    let newItemDesc = document.getElementById("itemDescription").value
    let newItemPrice = document.getElementById("itemPrice").value
    let newItemCat = document.getElementById("catDropDown").value
    if (newItemName && newItemDesc && (newItemPrice) && (!isNaN(newItemPrice))){//if the data is valid, proceed
        let itemToPost ={
            name: newItemName,
            description: newItemDesc,
            price: parseInt(newItemPrice)
        }
        //console.log(itemToPost)
        //add item to restaurant
        currentRestaurant.restaurant.menu[newItemCat][newID] = itemToPost;
        //update the menu list
        updateMenuList();
        document.getElementById("itemName").value=''
        document.getElementById("itemDescription").value=''
        document.getElementById("itemPrice").value=''
        //console.log(currentRestaurant.restaurant)
    }else{//alert if entry invalid
        alert("Invalid Entry! Ensure name, description and price are filled out, and that price is a number")
    }
}
//function to ensure new ID generated is unique
function getLatestID(){
    highestNum = 0;
    Object.keys(currentRestaurant.restaurant.menu).forEach(category=>{
        Object.keys(currentRestaurant.restaurant.menu[category]).forEach(menuID=>{
            if(menuID > highestNum){
                highestNum = menuID;
            }
        })
    })
    currWorkingID = highestNum;
    currWorkingID++;
    console.log(currWorkingID)
}

//function to update menuList
function updateMenuList(){
    let newResult = '<ul>';
    currentCats = [];
    for ( key in currentRestaurant.restaurant.menu){
        newResult += `<li>${key}</li><ul>`
        currentCats.push(key)//add the category to the currentCats array for later use
        for (key2 in currentRestaurant.restaurant.menu[key]){
            //ID: ${key}, Name: ${menuItems[key].name} Description: ${menuItems[key].description} Price: ${menuItems[key].price}`
            newResult += `<li> ID: ${key2}, Name: ${currentRestaurant.restaurant.menu[key][key2].name} Description: ${currentRestaurant.restaurant.menu[key][key2].description} Price: ${currentRestaurant.restaurant.menu[key][key2].price} </li>`
        }
        newResult+=`</ul>`
    }
    newResult+= `</ul>`
    document.getElementById("menu").innerHTML = newResult;//set new categories and menu display
}

function addNewCat(){//add new category 
    let newCat=document.getElementById("newCat").value;//get cat value
    //console.log(currentCats)
    let checker = false;
    for (catName in currentCats){
        //console.log(`Comparing ${currentCats[catName]} to ${newCat}`)
        if (currentCats[catName].toLowerCase() === newCat.toLowerCase()){
            checker = true;
        }
    }
    
    if (checker){
        alert("This category already exists, try something else")
        console.log(`This already exists`)
    }else{//if no matches, add the restaurant
        console.log("This is a new item")
        currentRestaurant.restaurant.menu[newCat]={}
        console.log(currentRestaurant.restaurant)
        updateMenuList();
        //console.log(currentCats)
        //update dropdown menu
        let catDropDownResult = `<label for="dropperForCat">Select Category:</label><select name= 'dropperForCat' id = 'catDropDown'>`
        for (catName in currentCats){
            catDropDownResult += `<option value= ${currentCats[catName]}>${currentCats[catName]}</option>`
        }
        catDropDownResult += '</select>'
        //set HTML values
        document.getElementById("categoryDropper").innerHTML = catDropDownResult;
        document.getElementById("newCat").value='';
    }
}


//FOR ADDING RESTAURANT

//submit the new restaurant
function submit(){
    //get names for use
    let restName = document.getElementById("name").value
    let delivFee = document.getElementById("delivery_fee").value
    let minOrder= document.getElementById("min_order").value
    //build JSON object to send
    let restToSend = {name: restName, delivery_fee: delivFee, min_order: minOrder}
    console.log(restToSend)
    let req = new XMLHttpRequest();

    //read JSON data and update page accordingly.
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            IdItem= JSON.parse(this.responseText)
			window.location.replace(`https://boppa-bat-bookstore.herokuapp.com/restaurants/${IdItem.restaurant.id}`);//redirect to proper page
		}else if (this.readyState==4 && this.status==400){
            alert("Error in filling out fields, please ensure all fields are filled and valid.")
            window.location.replace(`https://boppa-bat-bookstore.herokuapp.com/addrestaurant`)
        }
	}
	

	//Send a GET request for data
	req.open("POST", `/restaurants`);
    req.setRequestHeader("Content-Type", "application/json")
	req.send(JSON.stringify(restToSend));
}