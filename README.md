# SINF

### Intall Node
```
sudo apt update
sudo apt install nodejs
sudo apt install npm

nodejs -v 

```
### Install Mongodb
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition-using-deb-packages

### Run app
```
cd app
npm install
sudo service mongod start
npm start

```
localhost:3000


### Manage Mongodb database
```
mongo
use tech4u
db.users.find()
db.users.remove({})
db.dropDatabase()
```

