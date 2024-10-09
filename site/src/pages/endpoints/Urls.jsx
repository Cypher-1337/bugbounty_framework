import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import './endpoint.css';



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

        <button
          onClick={toggleExt}
          style={{
            marginLeft: '10px',
            padding: '8px',
            backgroundColor: filterExtActive ? 'blue' : '#333', // Green when filter is active
            color: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '0',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {filterExtActive ? 'Ext On' : 'Ext Off'}
        </button>
      </div>
    </GridToolbarContainer>
  );
}



function Urls({ initialUrls, domain, filter }) {
  const [urls, setUrls] = useState(initialUrls || []); // Ensure urls is initialized as an array
  const [page, setPage] = useState(1); // Keep using page state
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [exclude, setExclude] = useState(""); // State for exclusion input
  const [keywords, setKeywords] = useState([]); // State for keywords
  const [filterActive, setFilterActive] = useState(true);
  const [filterSubdomains, setFilterSubdomains] = useState([]);
  const [filterExtActive, setFilterExtActive] = useState(true);


  // Array of file extensions to filter (images and css)
  const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.css'];



  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };


  // Reset state on domain change
  useEffect(() => {
    setUrls([]);
    setPage(1); // Reset page
    setHasMore(true);

    if (domain) {
      loadMoreUrlsWithDomain(1); // Fetch first page of URLs for the new domain
    } else{
      loadMoreUrlsWithoutDomain(1);
    }
  }, [domain]);

  
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
  }, [filterActive, filter]);



  const loadMoreUrlsWithDomain = useCallback(async (currentPage) => {
    if (loading || !hasMore || !domain) return;
  
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/endpoints?domain=${domain}&page=${currentPage}&limit=5000`);
  
      if (!response.ok) {
        console.error('Network response was not ok:', response.statusText);
        setHasMore(false);
        return;
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let newUrls = [];
      let done = false;
  
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const decodedValue = decoder.decode(value, { stream: true });
        const ndjsonLines = decodedValue.trim().split('\n');
        ndjsonLines.forEach((line) => {
          try {
            const parsed = JSON.parse(line);
            newUrls.push(parsed.url);
          } catch (error) {
            console.error('Error parsing line:', line, error);
          }
        });
      }
  
      if (newUrls.length === 0) {
        setHasMore(false);
      } else {
        // Update the URLs and apply filtering immediately
        setUrls((prevUrls) => {
          const combinedUrls = currentPage === 1 ? newUrls : [...prevUrls, ...newUrls];
          applyFiltering(combinedUrls); // Apply filtering right here
          return combinedUrls; // Return the combined URLs
        });
      }
    } catch (error) {
      console.error('Error loading more URLs:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, domain]);





 // Function to load more URLs without domain and apply filtering immediately after loading
 const loadMoreUrlsWithoutDomain = useCallback(async (currentPage) => {
  if (loading || !hasMore) return;

  setLoading(true);
  try {
    const response = await fetch(`/api/v1/endpoints?page=${currentPage}&limit=5000`);

    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      setHasMore(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let newUrls = [];
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const decodedValue = decoder.decode(value, { stream: true });
      const ndjsonLines = decodedValue.trim().split('\n');
      ndjsonLines.forEach((line) => {
        try {
          const parsed = JSON.parse(line);
          newUrls.push(parsed.url);
        } catch (error) {
          console.error('Error parsing line:', line, error);
        }
      });
    }

    if (newUrls.length === 0) {
      setHasMore(false);
    } else {
      // Update the URLs and apply filtering immediately
      setUrls((prevUrls) => {
        const combinedUrls = currentPage === 1 ? newUrls : [...prevUrls, ...newUrls];
        applyFiltering(combinedUrls); // Apply filtering right here
        return combinedUrls; // Return the combined URLs
      });
    }
  } catch (error) {
    console.error('Error loading more URLs:', error);
  } finally {
    setLoading(false);
  }
}, [loading, hasMore]);



// New function to apply the filtering logic after more URLs are loaded
const applyFiltering = (newUrls) => {
  const excludeTerms = exclude.split(',').map(term => term.trim().toLowerCase());

  // Function to check if a URL has one of the specified file extensions, ignoring query parameters
  const hasFileExtension = (url, extensions) => {
    const urlWithoutQuery = url.split('?')[0].toLowerCase(); // Strip query parameters if present
    return extensions.some(ext => urlWithoutQuery.endsWith(ext));
  };

  // Filtering logic for exclusion terms and file extensions
  const filtered = newUrls.filter(url => {
    const lowerCaseUrl = url.toLowerCase();

    // Check if the URL matches any exclusion terms
    const shouldExcludeByTerm = excludeTerms.length > 0 && excludeTerms[0] !== ""
      ? excludeTerms.some(term => lowerCaseUrl.includes(term))
      : false;

    // Check if the URL matches the filterActive state (subdomains and filters)
    const shouldExcludeByFilter = filterActive
      ? filterSubdomains.some(({ subdomain, filter }) => {
          const subdomainInUrl = lowerCaseUrl.includes(subdomain.toLowerCase());
          const filterInUrl = lowerCaseUrl.includes(filter.toLowerCase());
          return subdomainInUrl && filterInUrl;
        })
      : false;

    // Check if the URL contains any of the specified file extensions (ignoring query parameters)
    const shouldExcludeByExt = filterExtActive
      ? hasFileExtension(lowerCaseUrl, fileExtensions)
      : false;

    return !(shouldExcludeByTerm || shouldExcludeByFilter || shouldExcludeByExt);
  });

  setFilteredUrls(filtered); // Apply the filtering logic
};



useEffect(() => {
  applyFiltering(urls); // Re-apply filtering when URLs or filter states change
}, [urls, exclude, filterActive, filterSubdomains, filterExtActive]);


// // Filtering is automatically applied when new exclude terms or filters are added
// useEffect(() => {
//   // This logic should apply filtering immediately when the exclude term changes or filterActive changes
//   const excludeTerms = exclude.split(',').map(term => term.trim().toLowerCase());

//   const filtered = urls.filter(url => {
//     const lowerCaseUrl = url.toLowerCase();

//     // Check if the URL matches any exclusion terms
//     const shouldExcludeByTerm = excludeTerms.length > 0 && excludeTerms[0] !== ""
//       ? excludeTerms.some(term => lowerCaseUrl.includes(term))
//       : false;

//     // Check if the URL matches the filterActive state (subdomains and filters)
//     const shouldExcludeByFilter = filterActive
//       ? filterSubdomains.some(({ subdomain, filter }) => {
//           const subdomainInUrl = lowerCaseUrl.includes(subdomain.toLowerCase());
//           const filterInUrl = lowerCaseUrl.includes(filter.toLowerCase());
//           return subdomainInUrl && filterInUrl;
//         })
//       : false;

//     return !(shouldExcludeByTerm || shouldExcludeByFilter);
//   });

//   setFilteredUrls(filtered); // Apply the filtering logic
// }, [urls, exclude, filterActive, filterSubdomains]);




  useEffect(() => {
    const loadKeyWords = async () => {
        try {
            const response = await fetch("/api/v1/endpoints/words"); // Updated URL
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); // Parse the JSON response
            setKeywords(data.map(item => item.word.toLowerCase())); // Map to an array of keywords
        } catch (error) {
            console.error("Error loading keywords:", error);
        }
    }

    loadKeyWords();
  }, []);

  // Infinite scroll effect (only increments page when the user scrolls)
  useEffect(() => {
  const handleScroll = debounce(() => {
    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
    if (virtualScroller) {
      const { scrollTop, scrollHeight, clientHeight } = virtualScroller;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && hasMore) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          if (domain) {
            loadMoreUrlsWithDomain(nextPage); // Fetch the next page for domain
          } else {
            loadMoreUrlsWithoutDomain(nextPage); // Fetch the next page without domain
          }
          return nextPage;
        });
      }
    }
  }, 200);

    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
    if (virtualScroller) {
      virtualScroller.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (virtualScroller) {
        virtualScroller.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, hasMore, domain, loadMoreUrlsWithDomain, loadMoreUrlsWithoutDomain]);

  // Map filtered URLs to rows for the DataGrid
  const rows = filteredUrls.map((url, index) => ({
    id: index + 1,
    url,
  }));

  const columns = [
    {
      field: 'url',
      headerName: 'Url',
      width: 1850,
      type: 'string',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      renderCell: (params) => {
        const lowerCaseUrl = params.value.trim().toLowerCase();
        
        // Check for a match with the keywords
        const matchedKeywords = keywords.filter(keyword => {
          const lowerCaseKeyword = keyword.trim().toLowerCase();
          return lowerCaseUrl.includes(lowerCaseKeyword);
        });
  
        const hasParams = lowerCaseUrl.includes('?');
  
        return (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column', // Stack elements vertically
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              backgroundColor: matchedKeywords.length > 0 ? '#6b1717' : 'transparent', // Set color to red if match
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
    },
  ];
  
  

  return (
    <div className="endpoint-content">
      <Helmet>
        <title>{domain}</title>
      </Helmet>

      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
        density="comfortable" // Set density to comfortable
        slotProps={{
          toolbar: {
            exclude,
            setExclude,
            toggleFilter,
            toggleExt,
            filterExtActive,
            filterActive,  // Pass the filter active state
            showQuickFilter: true,
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[100]}
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
            margin: '5px',
          },
          '& .css-1w53k9d-MuiDataGrid-overlay': {
            height: '2000px',
          },

          border: '1px solid var(--border-color)',
          height: '850px',
          width: '1808px',
          color: 'white',
        }}
      />
    </div>
  );
}

export default Urls;
