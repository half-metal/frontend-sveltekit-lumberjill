


## Getting started with LumberJill

Git clone or use whichever method you prefer to download to host. Then run the app with whichever method you prefer 

```bash
# for any updates
npm install
# dev mode run
npm run dev
# prod build run
npx run build

```

# Configure your agents
Each agent needs to be deployed on the host. For now, deploy the node backend.
[https://github.com/half-metal/lumberjill-backend-node](https://github.com/half-metal/lumberjill-backend-node)
Then you need to configure the connection details at the lib/components/agentConnections.js file.
 ``` {env:"sveltekit non-prod",location:"http://{ip}:{port}",user:"user",pw:"pw"}```
 LumberJill will query all agents configured.
 
 TODO - revamp the Sveltekit Endpoint to handle chunked streaming. Chunked streaming is still not mature in Sveltekit.

# Scan the directory for files
Once you are up and running, you'll have a route ```search-logs-all``` which pulls in data from a route with dynamic parameters [`/filterContents`]. If on your localhost and just running with the default port, then you can use the app at the following:
http://localhost:3060/search-logs-all, otherwise replace the host ip




## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

![image](https://user-images.githubusercontent.com/58837299/168538663-eeaf6d0b-ac52-4702-829f-e357cccd71be.png)
