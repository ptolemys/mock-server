# mock-server
Simple implementation to mock API responses (JSON)

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
 



**Features walkthrough \:**

Once you successfully create a JSON mock using the HTML form, you will get a message similar to : 

`Mock created at : http://localhost:80/getmock?id=5c305d89678a1e651103c8d7`

You may then hit the above URL using the same HTTP method (GET POST PUT etc) defined in the created mock. The response will be the JSON response submitted while creating the mock along with the defined HTTP status code. 
Suggested tools for use : [Postman](https://www.getpostman.com/apps) [Insomnia](https://insomnia.rest/download/) [curl](https://curl.haxx.se/download.html)

 * Using the delay query param :
 
    To have a delay between request and getting a response, you may add delay=milliseconds query parameter to the URL. For example, if the mock URL is 
    `http://localhost:80/getmock?id=5c305d89678a1e651103c8d7` and a delay of 2 seconds is required before response is delivered, then mock URL would be : 
  
    `http://localhost:80/getmock?id=5c305d89678a1e651103c8d7&delay=2000`
    
  * Using the mirror query param :
  
     Mocks are defined with JSON response body and HTTP status codes. In cases where you want a different body in response (say you want to check how a webpage will behave with an error response body), the query param mirror=1 will bring the JSON body (send with the request) back as a response. This is useful for cases where you want to check the behavior for some limited responses but don't want to create new mocks for them.
     
    `http://localhost:80/getmock?id=5c305d89678a1e651103c8d7&mirror=1`
    
   * Check mock details : 
  
     To get complete details about a mock, use the GET `/getdetails` API with the mock id. 
     For example : for some pre-defined mock 
     `http://localhost:80/getmock?id=5c305d89678a1e651103c8d7`, calling 
     
     `GET http://localhost:80/getdetails?id=5c305d89678a1e651103c8d7` 
     
     will return the following details : 
     
     ```
                {
                "_id": "5c305d89678a1e651103c8d7",
                "mockResponse": {
                    "description": "Some description entered while creating mock",
                    "verb": "POST",
                    "statusCode": 200,
                    "response_body": {
                        "somekey": "JSONresponse entered while creating mock"
                    }
                },
                "__v": 0
                }
     ```
  
   
