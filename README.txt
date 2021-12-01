Lucas Colwell #101102212

To run properly:

ensure proper directory
run npm install
run npm start (or node server.js)
navigate to localhost:3000 in your browser
testing should be straightforward, as pages are available with straightforward instruction.

Design decisions:

I did not use pug partials, and instead pasted the header (confirmed this was okay with prof).
I have four views in pug: home, restaurant, addPage and restaurants.
I used one client.js file with different functionalities for both addPage and restaurant, both described by comments.

server.js contains all the get, post, and put behaviours, and holds an array of the restaurants in RAM, as well as a 
list of IDs for computational ease.

client.js contains all the referenced functions from my pug pages, and holds a current restaurant value (for local
updates on modify restaurant), as well as a ticking ID which determines the new ID to place, so all are different.
I checked with prof and can assume the ID iterates from what we were initially, so as long as ID's start at 0 (confirmed)
then my code will generate new ID's no issue.

Otherwise, functions are straightforward and each function has a comment explaining its purpose.

