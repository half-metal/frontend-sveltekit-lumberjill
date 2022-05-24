
<script>
    //*This provides page that calls various endpoints based on file name and parameters
    //TODO need to add in Infinite Scroll so 
    import { page } from '$app/stores';
    import {filteredLogContent} from '../../stores/logStore.js'
	import VirtualList from 'svelte-tiny-virtual-list';
    import InfiniteScroll from "svelte-infinite-scroll"
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
    
    let pageNumberParam = 0 // simple numeric pagination
	let nextUrl = '' // have to store a token to fetch the next page
	let data = []; // store all the data here.
	let newBatch = []; // store the new batch of data here.
    
    console.log ('param is',searchDirectoryParam)
    const sendQuery = async() => {
            try {
                    await console.log('@debug query location is:',`${searchAgentParam}/fileContents`)
                    console.time("timer1");
                    const response = await fetch(`${searchAgentParam}/fileContents`, { 
                        method: 'POST', 
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Connection' : 'keep-alive',
                            'Host' : 'localhost'
                        }, 
                        body: `{"fileName" : "${$page.params.fileName}", "searchDirectory" : "${searchDirectoryParam}", "searchFilter":"${searchFilterParam}","pageNumber":"${pageNumberParam}"}`
                    });
                    let dataResponse = await response.text();
                    console.timeEnd("timer1");
                    results = dataResponse.split('chunkDelimiter').reverse().join().split(/\r?\n/)
                    //newBatch = results //this could be used for infinite scroll
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
Number of Events with search filter: {$filteredLogContent.length} out of {resultsResponse.length} // *case sensitive
{/if}


{#if results === undefined && {searchFilterParam}}
            
Loading...
{:else if results.length == 0}
No rows returned
{:else}

<div class="mockup-code mx-2 my-2">
<VirtualList width="100%" height={600} itemCount={$filteredLogContent.length} itemSize={50}>
    <div slot="item" let:index let:style {style}>
        <!-- Letter: {$filteredLogContent[index]}, Row: #{index} -->
        <pre data-prefix={index}><code> {$filteredLogContent[index]}</code> </pre> 
      </div>

      <!-- <InfiniteScroll
      hasMore={newBatch.length}
      threshold={100}
      on:loadMore={() => {page++; sendQuery()}} />     -->
</VirtualList>
</div>


{/if}

</body>