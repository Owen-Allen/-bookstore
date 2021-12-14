How we deployed our app


1. Set up git repo

2. Set up heroku (with git option)
    -add other users as collaborators
    -make sure git repo owner is the owner of the app
    
3. Set up heroku-db, we used hobby-dev as it is free, it sets up a db attached to our current heroku repo which we can access from the node.js server file.
    -it will create an addon called db (heroku deals with specific access)

4. Create your DB in psql
    - You may need to set environment variables / .bash_profile (Mac)
        https://www.postgresql.org/docs/9.3/libpq-envars.html
        - emacs ~.bash_profile
        - Add these lines (or whichever you need)
            export PGUSER=postgres
            export PGDATABASE=university_database
    - Then to push your db to heroku use:
        heroku pg:push dbnamehere DATABASE_URL --app boppa-bat-bookstore
        heroku pg:push bookstore DATABASE_URL --app boppa-bat-bookstore
        - You change the dbnamehere.  DATABASE_URL is the environment variable that Heroku will use

    - To delete db so you can re-upload
        heroku login
        heroku pg:reset -a boppa-bat-bookstore
        boppa-bat-bookstore
        

5. Tested Access
    -once you import pg in your server.js file, you can connect to the client with the following simple code:
        //import the postgres library
        const { Client } = require('pg');
        //define the client
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        //open the connection
        client.connect();
    
    - all queries are done with client.query("stringrepresentingquery") like the example below:
        client.query('SELECT * FROM student;', (err, res) => {
            if (err) throw err;
            console.log(res);
            for (let row of res.rows) {
                console.log(JSON.stringify(row));
            }
        });

MAKING THE DB
RUN THE SQL FILES IN THE FOLLOWING ORDER
1. Make_Table.sql
2. Insert_Views.sql
3. CREATE_FUNCTIONS.sql
4. Insert_Values.sql