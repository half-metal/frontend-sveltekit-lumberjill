<<<<<<< HEAD
//TODO this needs to be revamped with streaming. Right now it opens the entire file into memory
//TODO avoid using until fixed and use nodejs file with hyperStream.js
=======
//This endpoint allows opening and parsing contents of a file on the host server
//Some files may not have permissions, good idea to test with file that allowed to access
>>>>>>> 6f46ea3fa2541866537e43c439d0da910cbbc5a1
import { promises as fs } from 'fs';
//import { createReadStream } from 'node:fs'; //& todo - use readStream for large files over certain size to take less memory
let response = []
let parsedFileContents
let fileContents
let date1, date2

var responseHeaders = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type,Last-modified,Connection,Access-Control-Allow-Origin,Access-Control-Allow-Methods,Date',
                    'Access-Control-Expose-Headers': 'Content-Type,Last-modified,Connection,Access-Control-Allow-Origin,Access-Control-Allow-Methods,Date'
                 };

export async function post(req) {
   // let ipAddress = location.hostname
    let body = await req.request.json()
    let searchDirectory = body.searchDirectory
    let searchFilter = await body.searchFilter
    let fileName = body.fileName


  async function queryFileContents() {
        try {
          console.log('@debug fileContents.js - verify file path and name', `${searchDirectory}/${fileName}`)
            fileContents = await fs.readFile(`${searchDirectory}/${fileName}`, "utf8");
            parsedFileContents = fileContents.split(/\r?\n/)
            //const countParsed = parsedFileContents.length
            const filteredFileContents = parsedFileContents.filter((x) => x.includes(searchFilter));
            filteredFileContents.sort(function(x, y){
                date1 = new Date(x.mtime);
                date2 = new Date(y.mtime);
                return date1 - date2 ;
            })
            //const countFiltered = filteredFileContents.length
            response = fileContents
            return filteredFileContents
            } catch (error) {
              console.log(error)
              return error
            }
          }
          response = await queryFileContents()

    return {
        
        body:{response},
        headers: responseHeaders
        };
        

  
}
