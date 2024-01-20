import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Display() {
    const [savedHtml, setSavedHtml] = useState('');
    const [latestDifferences, setLatestDifferences] = useState('');
    // Get All diff_files that exist
    const [diffFiles, setDiffFiles] = useState([]);
    const location = useLocation();

    const [fileName, setFileName] = useState('');
    const urlParam = new URLSearchParams(location.search).get('url');
  
    const fetchData = async (file) => {
        try {
            if (!urlParam) {
                console.error('URL parameter is not defined.');
                // Handle the case where urlParam is not defined, e.g., set default values, display an error message, etc.
                return;
            }
            
            let apiUrl = `/api/v1/monitor/display?url=${decodeURIComponent(urlParam)}`;

            // Append file parameter if provided
            if (file) {
                apiUrl += `&file=${encodeURIComponent(file)}`;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            if(file){
                // replace the latest file with the one that you click 
                setLatestDifferences(data.getFile)
                setFileName(file)
            }else{
                setSavedHtml(data.savedHtml);
                setLatestDifferences(data.latestDifferences);
                
            }
            setDiffFiles(data.diffFileNames);


        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [urlParam]);

    const handleFetchAgain = () => {
        fetchData();
    };


    const highlightWords = (html) => {
        // Define the words to highlight
        const wordsToHighlight = ['username', 'admin', 'test', 'apikey'];
        
        // Create a regular expression to match the words globally and case-insensitively
        const regex = new RegExp(`\\b(${wordsToHighlight.join('|')})\\b`, 'gi');
        
        // Replace the matched words with a span tag for styling within a <pre> tag
        const highlightedHtml = html.replace(regex, (match) => `<span style="color: red">${match}</span>`);
        
        return highlightedHtml;
      };
      


  return (
    <div>
        <div style={{margin: 'auto', width: '60%', display: 'flex', justifyContent: 'space-around'}}>

            <h2>{urlParam}</h2>
            
            <Button
            variant="outlined"
            color="warning"  // You can customize the color as needed
            style={{ marginLeft: 'auto' }}
            onClick={handleFetchAgain}
            >
                Fetch Again
            </Button>

        </div>

        <div style={{ display: 'flex', height: '80vh', width: "1600px", border: '1px solid white'}}>

            
            {/*Differences */}
            <div style={{ flex: 1, overflowY: 'scroll', padding: '10px' }}>
                <h3 style={{ color: 'yellow' }}>{fileName}</h3>
                {/* Display the HTML source code with highlighted words within a <pre> tag */}
                <pre style={{ whiteSpace: 'pre-wrap' }}>{highlightWords(latestDifferences)}</pre>
            </div>
            
            {/*Saved HTML */}
            <div style={{ flex: 1, overflowY: 'scroll', padding: '10px' }}>
                <h3 style={{color: 'yellow'}}>Saved HTML:</h3>
                <pre>{savedHtml}</pre>
            </div>
        </div>

        <div>
            <h2>{diffFiles.length}</h2>
            {diffFiles.map((diffFile, index) => {
                // Parse the date from the filename
                const datePart = diffFile.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2})/);
                const formattedDate = datePart ? datePart[0].replace('T', ' ') : '';

                return (
                    <div key={index}>
                        <Button
                            color='success'
                            onClick={() => fetchData(diffFile)}
                        >{formattedDate} </Button>
                    </div>
                );
            })}
 
        </div>
    </div>
  )
}

export default Display





