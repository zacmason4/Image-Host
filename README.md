# MongoDB-Image-Example
Example uploading images to a static directory and making an entry into a MongoDB database.  Example code for CSCI 277: Application Development I, Drury University.  This code was assembled from various online examples.

## Directions
1. Clone the repo to your local machine.
2. In the working directory of your local repo install the node
project with the command: `npm install`
3. If the MongoDB service is not started, start it with the command:
```
mongod -dbpath <<absolute path to your data directory>>
```
4. Using the MongoDB command line tool (mongo), create the database imageDB and add the image public/images/SSDLC_Pedal_View.png to a collection called images.  The following command sequence can be used:
  * mongo
  * use imageDB
  * create the following document:
  ```
  image = {
    "filename" : "SSDLC_Pedal_View.png", 
    "photo_name" : "Security Touchpoints in Pedal",
    "album" : "tech drawings", 
    "upload_date" : ISODate()
  }
  ```
  * exit
5. Open a terminal (command shell) and change directory to the working directory of your project.
6. Start the web server with either the command `npm start` or `node start`.
7. To run the app
  * point your browser http://localhost:3000,
  * choose an image and complete the form, and
  * upload the image.
8. ~~(**Current Version**) Pointing your browser to http://localhost:3000/getImages will return a JSON array of images you have saved in the database.~~

**Note 1:** You may check the images whether your images have uploaded at any time using the MongoDB command line tool, mongo.  The command to use is `db.images.find()`.

~~**Note 2:** The next version of this example will illustrate using an AJAX call to process the array of image information returned by the /getImages route.~~
