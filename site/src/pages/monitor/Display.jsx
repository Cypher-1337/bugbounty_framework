  import React, { useState, useEffect } from 'react';
  import { useLocation } from 'react-router-dom';
  import axios from 'axios';
  import { List, ListItemText, ListItem, Typography, Box, Paper } from '@mui/material';

  function Display() {
    const [files, setFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [folder, setFolder] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [note, setNote] = useState([]);
    const [clickedFile, setClickedFile] = useState('');  /* this is used to change the background when you click on the file */

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const url = query.get('url');

    useEffect(() => {
      if (url) {
        axios.get(`/api/v1/monitor/display?url=${url}`)
          .then(response => {
            setFolder(response.data.savedFolder);
            setFiles(response.data.files);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });

        // getting notifications 
        axios.get(`/api/v1/monitor/display/notifications?url=${url}`)
          .then(response => {
            setNote(response.data.map(item => item.path));
          })
          .catch(error => {
            console.error('Error fetching data from another endpoint:', error);
          });
      }
    }, [url]);

    const getFile = (file) => {
      axios.get(`/api/v1/monitor/display?url=${url}&file=${file}`)
        .then(response => {
          setFileContent(response.data.fileContent);
          setNewFiles(response.data.newFiles || []);
        })
        .catch(error => {
          console.error(`Error Getting file ${file}`, error);
        });
        setClickedFile(file);

    };

    const fileName = (filePath) => {
      return filePath.split('/').pop();
    };

    // Function to count highlighted items in newFiles
    const countHighlighted = (fileName) => {
      const count = note.filter(n => n.includes(fileName)).length;
      return count > 0 ? `(${count})` : ''; // Return count only if it's greater than zero
    };

    const deletePath = async (path) => {
      try {
        const encodedPath = encodeURIComponent(path);
        await axios.delete(`/api/v1/monitor/display/notifications?path=${encodedPath}`);
        setNote(prevNote => prevNote.filter(n => n !== path));

      } catch (error) {
        console.error('Error deleting path:', error);
      }
    };

    const handleFileClick = (file) => {
      getFile(file);


      if (note.some(n => n.includes(file))) {
        deletePath(file)
      }
    };


    // hightlight add content + and removed content - 
    const renderHighlightedContent = (content) => {
      if (!content) return null;

      return content.split('\n').map((line, index) => {
        if (line.startsWith('+')) {
          return <span key={index} style={{ backgroundColor: 'green' }}>{line}<br /></span>;
        } else if (line.startsWith('-')) {
          return <span key={index} style={{ backgroundColor: 'red' }}>{line}<br /></span>;
        } else {
          return <span key={index}>{line}<br /></span>;
        }
      });
    };


    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, margin: '8px' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Files in {folder}</Typography>
        <Box sx={{ display: 'flex', width: '100%', maxWidth: 2200 }}>
          
          <Paper className='custom-scrollbar' sx={{ flex: 1, mr: 2, p: 2, overflow: 'auto', maxHeight: '90vh', backgroundColor: "var(--secondary-color)", color: 'white', border: '1px solid var(--primary-color)' }}>
            <List>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  onClick={() => getFile(file)}
                  className={note.some(n => n.includes(fileName(file))) ? 'notification' : ''}
                  sx={{
                    backgroundColor: clickedFile === file ? 'var(--primary-color)' : 'inherit',
                    cursor: 'pointer',
                    padding: '2px 20px',
                    border: '1px solid var(--primary-color)',
                    borderRadius: '50px',
                    margin: '10px 0'
                  }}
                >
                  <ListItemText primary={`${fileName(file)} ${countHighlighted(fileName(file))}`}  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {fileContent && (
            <Paper className='custom-scrollbar' sx={{ flex: 4, p: 3, fontSize: '18px',border: '1px solid var(--primary-color)', backgroundColor: "var(--secondary-color)", color: 'white', overflow: "auto", maxHeight: '85vh', margin: "0 20px" }}>
              <Typography variant="h6">File Content </Typography>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {renderHighlightedContent(fileContent)}
              </pre>
            </Paper>
          )}

          <Paper className='custom-scrollbar' sx={{ flex: 2, mr: 2, p: 2, overflow: 'auto', maxHeight: '90vh', backgroundColor: "var(--secondary-color)", color: 'white', border: '1px solid var(--primary-color)' }}>
            <List>
              {newFiles.map((newFile, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleFileClick(newFile)}
                  className={note.includes(newFile) ? 'notification' : ''}
                  sx={{
                    backgroundColor: clickedFile === newFile ? 'var(--primary-color)' : 'inherit',
                    cursor: 'pointer',
                    padding: '2px 20px',
                    border: '1px solid var(--primary-color)',
                    borderRadius: '50px',
                    margin: '10px 0'
                  }}
                >
                  <ListItemText primary={fileName(newFile)} sx={{ fontSize: '1px'}} />
                </ListItem>
              ))}
            </List>
          </Paper>

        </Box>
      </Box>
    );
  }

  export default Display;
