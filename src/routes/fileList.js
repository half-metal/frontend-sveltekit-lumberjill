import { promises as fs } from 'fs';
import path from "path"
import ip from "ip"
//import { constants } from 'node:fs/promises';
//import { access } from 'node:fs/promises';
let res
let errResponse
let results
let readAccess
let date1, date2
let serverIp = ip.address()
let appName =  `Lumberjill`
let version =  `0.1`
console.log (`appName:${appName} version:${version} hosted at:${serverIp}`)
var responseHeaders = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type,Last-modified,Connection,Access-Control-Allow-Origin,Access-Control-Allow-Methods,Date',
                     'Access-Control-Expose-Headers': 'Content-Type,Last-modified,Connection,Access-Control-Allow-Origin,Access-Control-Allow-Methods,Date'
                 };

export async function post({request}) {
    console.log('try to get IP',request)
    let host = request.headers.get("host")
    let protocol = request.headers.get("protocol")
    console.log("🚀 ~ file: fileList.js ~ line 30 ~ post ~ protocol", protocol)
    let hostUrl = `http://${host}`
    console.log('hostUrl', hostUrl)
    let body = await request.json()
        async function getDirectory(route) {
            console.log('body is',body)
            res = []
            try {
                const files = await fs.readdir(`${body.searchDirectory}`, 'utf8');
                for (let file of files) {
                    const extension = path.extname(file);
                    const fileStat = await fs.stat(route + "/" + file);
                    // ways to access file
                    // fs.access(route + "/" + file, fs.X_OK)
                    // .then(() => readAccess = 'Y')
                    // .catch(() => readAccess = 'N');  
                    console.log('accessResult is:', readAccess)
                    res = [...res, { name: file, extension: extension, size: fileStat.size, cdtm: fileStat.birthtime, mdtm: fileStat.mtime, serverIp, hostUrl }];
                    }
                console.log('res:',res);
                res.sort(function(x, y){
                    date1 = new Date(x.mdtm);
                    date2 = new Date(y.mdtm);
                    return date2 - date1;
                })
                return res
            } catch (error) {
                
                errResponse = error
                console.log(errResponse)
                return error
            }

        }
        results = await getDirectory(body.searchDirectory)

return {

    body:{results},
    headers: responseHeaders
    };

        

  
}