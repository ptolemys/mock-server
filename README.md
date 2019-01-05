# mock-server
Simple implementation to mock API responses 

**Ingredients used \:**
* Front end : HTML / CSS
* Backend   : NodeJS 
* Database  : MongoDB 

**Using the service locally \:**

* Clone the project using : 

  `git clone https://github.com/ptolemys/mock-server.git` 

* Download and unzip MongoDB from [here](https://www.mongodb.com/download-center). To start MongoDB, use : 

  `/absolute_path_to_mongo_unzipped_directory/bin/mongod --dbpath /any_directory_on_your_system`

* Create a file named .env in the root directory of mock-server project and define the following keys : 

  ```
   PORT=80
   MONGO_DB_URL=mongodb://localhost:27017/MockModel
   ENDPOINT_URL=http://localhost
  ```
  
* Open terminal and navigate to the project's root directory, then use the following : 

  ```
   terminal_prompt $ npm install
   terminal_prompt $ node app.js
  ``` 
    
 * Open browser and navigate to http://localhost:80. 
   
