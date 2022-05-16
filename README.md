

## Creating a project

git clone or whichever method you prefer to download to host. Then run whichever method you prefer 

```bash
# npm install for any updates
# dev mode
npm run dev
# prod build
npx run build

```

# scan the directory for files
Once you are up and running, you'll have a route 'search-logs-all' which pulls in data from a route with dynamic parameters [`/filterContents`]. If on your localhost and just running default port you will be on
http://localhost:3060/search-logs-all, otherwise use the host ip

# configure your agents
each agent needs to be deployed on the host. You can either deploy this sveltekit or deploy the node backend.
[https://github.com/half-metal/lumberjill-backend-node](https://github.com/half-metal/lumberjill-backend-node)
Then you need to configure the connection details at the lib/components/agentConnections.js file.
 ``` {env:"sveltekit non-prod",location:"http://{ip}:{port}",user:"user",pw:"pw"}```


## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
