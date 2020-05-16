import express , {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validURL} from './util/util';
import { fileURLToPath } from 'url';
import path from 'path';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user

  app.get( "/filteredimage/", 
  async ( req:Request, res:Response ) => 
  {
    let {image_url} = req.query;

    if(!validURL(image_url))
      return res.status(422).send({ message: 'Please provide a valid url'});

    if(!image_url)
        return res.status(400).send({ message: 'Image url is required or malformed' });
    
    const image =  await filterImageFromURL(image_url);
  
    if(!image)
      return res.status(500).send({ message: 'Failed to get the requested image'});

    res.status(200).sendFile(image)

    res.on("finish", ()=>{deleteLocalFiles([path.normalize(image)]);});
    
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();