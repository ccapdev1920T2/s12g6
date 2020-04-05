# Anispark
Members: 
DALAN, Gerald   
LUA, Matthew  
PARK, Se Hyun  
  
Note: DALAN, Gerald (silentrald) is not a member of the Githubteam

#### Requirements:
* `.env` file
* `images` folder

Link to download the files will be sent since they are secrets(.env) and heavy to the repository(images)

#### File Structure
```
main_folder
└───client
│   └───...
└───generate_db
│   └───...
└───server
    |   ...
    |   images
    |   |   chats
    |   |   deleted
    |   └───users
    |   ...
    |   .env
    └───...
```
#### To Run
Open 2 terminals, one's directory is on client and on the other one is on server then run these commands
```
> .../client$ npm run serve
> .../server$ npm run dev
```
HOST: **localhost/127.0.0.1**
PORT: client: **8080**, server: **8000**

Once both are running successfully you can go to **http://localhost:8080**

------
##### **_#IF_** MONGO FAILS TO CONNECT TO CLOUD SERVER#
* Restart server command
* **_If server still can't connect or the connection is too slow_**, there is a `generate_db` folder located in the main folder and follow the generate_db section

##### generate_db
**Windows Users**
Just double click on the `generate_db.bat` file
**Mac/Linux Users**
Go to the terminal and go to the generate_db folder and run the following command
```
> .../generate_db$ sh ./generate.sh
```

then in `.env` file just change the DB_ENV from **server** to **local** then rerun the server.

##### drop_db (to remove the local db once testing is done)
**Windows Users**
Just double click on the `drop_db.bat` file
**Mac/Linux Users**
```
> .../generate_db$ sh ./drop.sh
```
----

#### User Accounts
|usertype|user|gender|gender preference|
|---|---|---|---|
|admin|admin|none|none|
|user|park_park@dlsu.edu.ph|male|female
|user|jillian_destinee@dlsu.edu.ph|female|male
|user|dexter_mason@dlsu.edu.ph|gay|male/gay
|user|cyntia_senona@dlsu.edu.ph|lesbian|female/lesbian
|user|geoffrey_tangco@dlsu.edu.ph|bi|male/female/bi

Password for all: **`Asdf1234?`**