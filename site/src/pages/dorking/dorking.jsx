import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';



function CustomToolbar({ exclude, setExclude, toggleFilter, filterActive, toggleExt, filterExtActive }) {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
        <input
          type="text"
          value={exclude}
          onChange={(e) => setExclude(e.target.value)}
          placeholder="Exclude URLs containing... (comma-separated)"
          style={{
            width: '300px',
            padding: '8px',
            fontSize: '16px',
            marginLeft: '10px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '0',
          }}
        />
        <div>
          <button
            onClick={toggleFilter}
            style={{
              marginLeft: '10px',
              padding: '8px',
              backgroundColor: filterActive ? 'green' : '#333', // Green when filter is active
              color: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: '0',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {filterActive ? 'Filter On' : 'Filter Off'}
         </button>
        </div>
      </GridToolbarContainer>
    );
  }

const getUrls = async () => {

    let response = await fetch("api/v1/dorking")

    if(!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`);
    }


    let reader = response.body.getReader()
    let decoder = new TextDecoder('utf-8')
    let ndjson = ''
    let urls = []

    while(true){

        const {value, done} = await reader.read()
        if (done) break

        ndjson += decoder.decode(value, {stream: true})

        const lines = ndjson.split("\n")

        ndjson = lines.pop()

        lines.forEach((line) => {
            if (line.trim()){
                try {
                    urls.push(line.trim())
                } catch (error) {
                    console.error("Invalid JSON line:", line);
                }
            }
        })
    }


    return urls.reverse()
}

function Dorking() {

    const [urls, setUrls] = useState([])
    const [keywords, setKeywords] = useState([])
    const [exclude, setExclude] = useState(""); // State for exclusion input
    const [filterActive, setFilterActive] = useState(true);
    const [filterSubdomains, setFilterSubdomains] = useState([]);
    const [filterExtActive, setFilterExtActive] = useState(true);
    const [filteredUrls, setFilteredUrls] = useState([]);






    // Toggle filter activation
    const toggleFilter = () => {
        setFilterActive((prevState) => !prevState);
    };

    // Toggle Ext filter activation
    const toggleExt = () => {
        setFilterExtActive((prevState) => !prevState);
    };
  


    // Fetch filtered subdomains when filter is active
    useEffect(() => {
        const fetchFilterSubdomains = async () => {
        if (!filterActive) return;
    
        try {
            const response = await fetch('/api/v1/endpoints/filter');
            const data = await response.json();
            setFilterSubdomains(data); // Store the full data array with subdomain and filter
        } catch (error) {
            console.error('Error fetching filtered subdomains:', error);
        }
        };
    
        fetchFilterSubdomains();
    }, [filterActive]);

    


    useEffect(()=>{
        const fetchData = async () =>{
            try {
                const urlsData = await getUrls()
                setUrls(urlsData)
            } catch (error) {
                console.error("Error fetching URLs:", error);
            }
        }

        const loadKeyWords = async () => {

            try {
                const response = await fetch("api/v1/endpoints/words")
                const data = await response.json()

                setKeywords(data.map(item => item.word.toLowerCase()))

            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
        loadKeyWords()
    }, [])

    



    // Re-run filtering every time URLs or filter settings change
    useEffect(() => {
        applyFiltering(urls);
    }, [urls, exclude, filterActive, filterSubdomains, filterExtActive]);


    const applyFiltering = (urls) => {

        const excludeTerm = exclude.split(",").map(term => term.trim().toLowerCase())

        const filtered = urls.filter(url => {
            const lowerCaseUrl = url.toLowerCase()

            const shouldExcludeByTerm = excludeTerm.length > 0 && excludeTerm[0] !== ""
            ? excludeTerm.some( term => lowerCaseUrl.includes(term))
            : false;

            // Check if the URL matches the filterActive state (subdomains and filters)
            const shouldExcludeByFilter = filterActive
            ? filterSubdomains.some(({ subdomain, filter }) => {
                const subdomainInUrl = lowerCaseUrl.includes(subdomain.toLowerCase());
                const filterInUrl = lowerCaseUrl.includes(filter.toLowerCase());
                return subdomainInUrl && filterInUrl;
            })
            : false;


            return !(shouldExcludeByTerm || shouldExcludeByFilter );
        })

        setFilteredUrls(filtered); // Apply the filtering logic

    }


    const rows = filteredUrls.map((url, index) => ({
        id: index +1,
        url,
    }))

    const columns = [
        {
            field: 'url',
            headerName: 'url',
            width: 1850,
            type: 'string',
            headerAlign: 'center',
            renderCell: (params) => {
                const lowerCaseUrl = params.value.trim().toLowerCase()

                // Check for a match with the keywords
                const matchedKeywords = keywords.filter(keyword => {
                    const lowerCaseKeyword = keyword.trim().toLowerCase();
                    return lowerCaseUrl.includes(lowerCaseKeyword);
                });
                
                const hasParams = lowerCaseUrl.includes('?')

                return (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column', // Stack elements vertically
                        alignItems: 'flex-start',
                        backgroundColor: matchedKeywords.length > 0 ? '#6b1717' : 'transparent', // Set color to red if match
                        justifyContent: 'flex-start',
                        padding: '8px', // Add some padding for better spacing
                        fontSize: '19px'
                      }}
                    className={matchedKeywords.length > 0 ? 'MuiDataGrid-cell--withRenderer' : ''}

                    >
                      <a
                        style={{
                          textDecoration: 'none',
                          color: hasParams ? 'yellow' : 'inherit', // Keep the parent color
                          width: '100%', // Ensure the anchor takes the full width
                        }}
                        href={params.value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {params.value}
                      </a>
                        {matchedKeywords.length > 0 && (
                            <div style={{ color: 'white', marginTop: '4px' }}>
                                {matchedKeywords.join(', ')} {/* Display matched keywords */}
                            </div>
                        )}  
                      
                    </div>
                  );

            }
        }
    ]
    
    return (
        <div className='dorking-main'>
            <Helmet>Dorking Urls</Helmet>

            <DataGrid
                rows={rows}
                columns={columns}
                density='comfortable'
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        exclude,
                        setExclude,
                        toggleFilter,
                        toggleExt,
                        filterExtActive,
                        filterActive,  // Pass the filter active state
                    }
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 100,
                        },
                    },
                }}
                sx={{
                    '& .MuiDataGrid-withBorderColor': {
                        border: '1px solid var(--border-color)',
                    },
                    '& .MuiDataGrid-cell': {
                        color: 'white',
                        fontSize: '18px',
                        padding: '0',
                        border: '1px solid var(--border-color)',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#1d1d1d',
                        color: 'white',
                    },
                    '& .css-v4u5dn-MuiInputBase-root-MuiInput-root': {
                        background: 'white',
                        color: 'black',
                    },
                    '& .MuiButtonBase-root': {
                        color: 'white',
                    },
                    '& .MuiToolbar-root': {
                        color: 'white',
                    },
                    '& .MuiDataGrid-root': {
                        backgroundColor: '#333',
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                        display: 'flex',
                        justifyContent: 'space-between',
                    },
                    '& .css-1w53k9d-MuiDataGrid-overlay': {
                        height: '2000px',
                    },
            
                    border: '1px solid var(--border-color)',
                    height: '910px',
                    width: '1808px',
                    color: 'white',
                }}
            />            
        </div>
    )
}

export default Dorking