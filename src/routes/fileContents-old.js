//import fs from "fs";
import { promises as fs } from 'fs';
//import { createReadStream } from 'node:fs';
let response = [3]
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
            const countParsed = parsedFileContents.length
            const filteredFileContents = parsedFileContents.filter((x) => x.includes(searchFilter));
            filteredFileContents.sort(function(x, y){
                date1 = new Date(x.mtime);
                date2 = new Date(y.mtime);
                return date1 - date2 ;
            })
            const countFiltered = filteredFileContents.length
            response = fileContents
            return {countFiltered: countFiltered, countParsed: countParsed, result: filteredFileContents}
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