
function searchByTitle(){
    //console.log("IT searches")
    let req = new XMLHttpRequest();
    //read html data and update page accordingly.
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            console.log(this.response)
            document.body.innerHTML=this.response;
        }
	}
    searchCondition = document.getElementById("searchConditionTitle").value
    
	//Send a get request for new data so we can access the db
	req.open("GET", `/bookSearchTitle/${searchCondition}`);
    req.setRequestHeader("Content-Type", "text/html")
	req.send();
}

function searchByGenre(){
    let req = new XMLHttpRequest();
    //read html data and update page accordingly.
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            console.log(this.response)
            document.body.innerHTML=this.response;
        }
	}
    searchCondition = document.getElementById("searchConditionGenre").value
    
	//Send a get request for new data so we can access the db
	req.open("GET", `/bookSearchGenre/${searchCondition}`);
    req.setRequestHeader("Content-Type", "text/html")
	req.send();
}

function searchByAuthor(){
    let req = new XMLHttpRequest();
    //read html data and update page accordingly.
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            console.log(this.response)
            document.body.innerHTML=this.response;
        }
	}
    searchCondition = document.getElementById("searchConditionAuthor").value
    
	//Send a get request for new data so we can access the db
	req.open("GET", `/bookSearchAuthor/${searchCondition}`);
    req.setRequestHeader("Content-Type", "text/html")
	req.send();
}

function searchByPrice(){
    let req = new XMLHttpRequest();
    //read html data and update page accordingly.
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            console.log(this.response)
            document.body.innerHTML=this.response;
        }
	}
    searchConditionMin = document.getElementById("searchConditionMinPrice").value
    searchConditionMax = document.getElementById("searchConditionMaxPrice").value
	//Send a get request for new data so we can access the db
	req.open("GET", `/bookSearchPrice/${searchConditionMin}/max/${searchConditionMax}`);
    req.setRequestHeader("Content-Type", "text/html")
	req.send();
}
function searchByAll(){
    let req = new XMLHttpRequest();
    //read html data and update page accordingly.
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            console.log(this.response)
            document.body.innerHTML=this.response;
        }
	}
    //get all data
    searchConditionTitle = document.getElementById("searchConditionTitle").value
    if (searchConditionTitle == undefined||searchConditionTitle == null){
        searchConditionTitle = "WRONG"
    }
    searchConditionAuthor = document.getElementById("searchConditionAuthor").value
    if (searchConditionAuthor == undefined||searchConditionAuthor == null){
        searchConditionAuthor = "WRONG"
    }
    searchConditionGenre = document.getElementById("searchConditionGenre").value
    if (searchConditionGenre == undefined||searchConditionGenre == null){
        searchConditionGenre = "WRONG"
    }
    searchConditionMin = document.getElementById("searchConditionMinPrice").value
    if (searchConditionMin == undefined|| searchConditionMin ==null){
        searchConditionMin = -1
    }
    searchConditionMax = document.getElementById("searchConditionMaxPrice").value
    if (searchConditionMax == undefined || searchConditionMax == null){
        searchConditionMax = -1
    }
    
    let searchCondition={
        title: searchConditionTitle,
        author: searchConditionAuthor,
        genre: searchConditionGenre,
        min: searchConditionMin,
        max: searchConditionMax
    }
    
	//Send a get request for new data so we can access the db
	req.open("POST", `/bookSearchAll`);
    req.setRequestHeader("Content-Type", "application/json")
	req.send(JSON.stringify(searchCondition));
}
