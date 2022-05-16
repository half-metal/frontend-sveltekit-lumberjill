
<script>
    import { page } from '$app/stores';
    import {filteredLogContent} from '../../stores/logStore.js'
    let results
    let resultsResponse
    let headings
    let errorResponse
    let searchTerm
    let count
    console.log('$page.params.fileName', $page.params.fileName)
    const searchDirectoryParam = $page.url.searchParams.get('searchDirectory')
    const searchAgentParam = $page.url.searchParams.get('agent')
    const searchFilterParam = $page.url.searchParams.get('searchFilter')
    console.log ('param is',searchDirectoryParam)
    const sendQuery = async() => {
            
            try {
                    await console.log('@debug query location is:',`${searchAgentParam}/fileContents`)
                    const response = await fetch(`${searchAgentParam}/fileContents`, { 
                        method: 'POST', 
                        headers: {
                            'Accept': 'application/json',
                            'content-type': 'application/json'
                        }, 
                        body: `{"fileName" : "${$page.params.fileName}", "searchDirectory" : "${searchDirectoryParam}", "searchFilter":"${searchFilterParam}"}`
                    });
                    let dataResponse = await response.json();
                    dataResponse = dataResponse.response
                    count = dataResponse.countParsed
                    results = dataResponse.result
                    if (results.errno) {
                        errorResponse = results
                    } else if (results.errno === undefined){
                        resultsResponse = results
                    }
            }
                catch(err) {
                console.log(err)
                errorResponse = err
            }
            
            };
        sendQuery()

        $: {
		//filter logs with search terms
		if (searchTerm) {
            //console.log('in searchterm', $filteredLogContent)
            $filteredLogContent = resultsResponse.filter((logContents) => logContents.includes(searchTerm));
        } else {
            $filteredLogContent = resultsResponse
        }
    }
</script>
<body>
    

<input 
class="input input-bordered input-accent w-full max-w-xs mx-2 my-2"
    bind:value={searchTerm}
    type="text"
    placeholder="filter log contents"
/>

{#if results === undefined}
<div>
    File contents will load below here:
    
</div>
{:else if errorResponse}
{errorResponse}
<span class="bg-error"> Error: {JSON.stringify(results)}</span>
{:else}
Number of Events with url param filter: {$filteredLogContent.length} out of {resultsResponse.length} // without url param filter: {count} // *case sensitive
{/if}


{#if results === undefined && {searchFilterParam}}
            
Loading...
{:else if results.length == 0}
No rows returned
{:else}
<div class="mockup-code mx-2 my-2">
{#each $filteredLogContent as filteredLogLine, i}
    
<pre data-prefix={i}><code> {filteredLogLine}</code> </pre> 
  
{/each}
</div>



{/if}

</body>