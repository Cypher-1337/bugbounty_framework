import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './endpoint.css';

function Urls({ initialUrls, domain }) {
  const [urls, setUrls] = useState(initialUrls || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Function to load more URLs
  const loadMoreUrls = useCallback(async () => {
    if (loading || !hasMore || !domain) return; // Ensure domain is defined
  
    setLoading(true);
  
    try {
      const response = await fetch(`/api/v1/endpoints?domain=${domain}&page=${page}&limit=50`);
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
            const parsed = JSON.parse(line); // Ensure parsing is safe
            newUrls.push(parsed.url);
          } catch (error) {
            console.error('Error parsing line:', line, error);
          }
        });
      }
  
      if (newUrls.length === 0) {
        setHasMore(false);
      }
  
      setUrls((prevUrls) => [...prevUrls, ...newUrls]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading more URLs:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, domain]);
  

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreUrls();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreUrls]);

   // Fetch new URLs when the domain changes
  useEffect(() => {
    if (domain) {
      setUrls([]);  // Reset URLs
      setPage(1);   // Reset page count
      setHasMore(true); // Allow more URL fetches
      loadMoreUrls(); // Fetch new URLs for the selected domain
    }
  }, [domain]);  // This effect depends on domain
  // Map URLs to rows for the DataGrid
  const rows = urls.map((url, index) => ({
    id: index + 1,
    url,
  }));

  const columns = [
    {
      field: 'url',
      headerName: 'Url',
      width: 1750,
      type: 'string',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      renderCell: (params) => {
        const hasParams = params.value.includes('?');
        return (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a
              style={{
                textDecoration: 'none',
                color: hasParams ? 'yellow' : 'white',
              }}
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
            >
              {params.value}
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <div className="endpoint-content">
      <Helmet>
        <title>Endpoints</title>
      </Helmet>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        pageSizeOptions={[50]}
        sx={{
          '& .MuiDataGrid-withBorderColor': {
            border: '1px solid var(--border-color)',
          },
          '& .MuiDataGrid-cell': {
            color: 'white',
            fontSize: '16px',
            border: '1px solid var(--border-color)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#1d1d1d',
            color: 'white',
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
          border: '1px solid var(--border-color)',
        }}
      />
      {loading && <div style={{ color: 'white', textAlign: 'center' }}>Loading more URLs...</div>}
      {!hasMore && <div style={{ color: 'white', textAlign: 'center' }}>No more URLs to load.</div>}
    </div>
  );
}

export default Urls;
