console.log("I was run for some reason")
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
    searchCondition = document.getElementById("searchCondition").value
    console.log(searchCondition);
	//Send a get request for new data so we can access the db
	req.open("GET", `/bookSearch/${searchCondition}`);
    req.setRequestHeader("Content-Type", "text/html")
	req.send();
}
    //console.log("search sent to server")