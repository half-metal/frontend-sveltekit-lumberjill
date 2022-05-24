<script>
    import {filteredLogNames} from '../stores/logStore.js'
    import {searchDirectory} from '../stores/logStore.js'
    import {searchAgent} from '../stores/logStore.js'
    import {agentConnections} from '$lib/agentConnections.js'
    import {queryFlag} from '../stores/queryStore.js'
    let fileList
    let i
    let errResponse
    let results
    let headings = []
    let ip
    let date1, date2
    let searchTerm //searchTerm to allow filtering
    let searchFilter = '' //starts searchFilter as string
    let resultsResponse = []
    $searchDirectory = "/var/log" //default directory, can be configured
    let selectedAgent = agentConnections[1]
    const sendQuery = async() => {
        console.log("endpoint: selectedAgent/fileList:",`${selectedAgent.location}/fileList`)
        resultsResponse = [] // clear cache when next search
            try {
                for (i in agentConnections) {
                console.log('@debug iteration:',i)
                const response = await fetch(`${agentConnections[i].location}/fileList`, { 
                    method: 'POST', 
                    headers: {
                        'Accept': 'application/json',
                        'content-type': 'application/json'
                    }, 
                    body: `{"searchDirectory" : "${$searchDirectory}"}`
                });
                console.log('body being sent:', `{"searchDirectory" : "${$searchDirectory}"}`)
                const dataResponse = await response.json();
                results = dataResponse.results
                console.log('dataResponse in try is:',dataResponse)
                resultsResponse = resultsResponse.concat(results)
                console.log('@debug resultsResponse is:', resultsResponse)
                headings = Object.keys(dataResponse.results[0])
                console.log('headings is',headings)
            } //end of for loop iterating through agents

            }
                catch(err) {
                console.log(err)
                errResponse = err
            }

    };
        sendQuery()
        
//& this allows clicking on a row to open up page to see log
        const handleDblClick = async(fileName, agent) => {
            console.log('double clicked')
            location.href = `/logs/${fileName}?searchDirectory=${$searchDirectory}&agent=${agent}&searchFilter=${searchFilter}`
        }

		//& reactive filter logs with search terms
        $: {

		if (searchTerm) {
            console.log('in searchterm', $filteredLogNames)
            $filteredLogNames = resultsResponse.filter((logName) => logName.name.includes(searchTerm));
            $filteredLogNames.sort(function(x, y){
                    date1 = new Date(x.mdtm);
                    date2 = new Date(y.mdtm);
                    return date2 - date1;
                })
        } else {
            $filteredLogNames = [...resultsResponse]
            $filteredLogNames.sort(function(x, y){
                    date1 = new Date(x.mdtm);
                    date2 = new Date(y.mdtm);
                    return date2 - date1;
                })
        }
    }

    </script>
    

    <form on:submit|preventDefault={sendQuery}>
        <input type="text" placeholder="Type here" class="input input-bordered input-secondary w-full max-w-3xl my-2 mx-1" bind:value={$searchDirectory}>
        <select class="select input-secondary select-bordered mx-1 outline  outline-secondary py-2 my-2" bind:value={selectedAgent}>{selectedAgent} on:click={() => $queryFlag = 'true'}>
            {#each agentConnections as agentConnection }
            <option value={agentConnection}>{agentConnection.location} {agentConnection.env}</option>
            {/each}
        </select>
        <!-- <input type="text" placeholder="Type here" class="input input-bordered input-secondary w-full max-w-3xl my-2 mx-1" bind:value={$searchAgent}> -->
        <button type="submit" class="button btn btn-secondary">
            Search Directory
        </button>

    </form>

    <input 
    class="input input-bordered input-accent w-full max-w-xs mx-2 my-2"
        bind:value={searchTerm}
        type="text"
        placeholder="filter log by name"
    /> Number of Logs: {$filteredLogNames.length} out of {resultsResponse.length}
    <input 
    class="input input-bordered input-accent w-full max-w-xs mx-2 my-2"
        bind:value={searchFilter}
        type="text"
        placeholder="pre-filter log contents"
    /> Double-click any row to see log contents
    <div class="overflow-x-auto h-5/6">
        <table class="table table-compact w-full ">
          <thead class="bg-accent">
            
            {#if results === undefined}
            
            Submit a query...
            {:else if results.length == 0}
            No rows returned
            {:else}
            {#each headings as heading}
            <th class="bg-secondary top-0 sticky hover:bg-accent "> {heading} </th> 
            
            {/each}
            {/if}
        
          </thead> 
          <tbody class="bg-accent">
            {#if results === undefined}
            When rows are loaded this will update, the initial query may take up to 15 seconds due to new connection...
            {:else}

        {#each $filteredLogNames as file, i}
       <tr class="hover bg-accent text-black" on:dblclick={handleDblClick(file.name, file.hostUrl)}>
                {#each headings as heading, i}
                <td class="bg-accent text-black w-40"  >{file[heading]}</td>
                {/each}
       </tr>
        {/each}
        {/if}
          </tbody> 
          <tfoot>
            <tr>
    
            </tr>
          </tfoot>
        </table>
      </div>