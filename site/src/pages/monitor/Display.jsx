import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { List, ListItemText, ListItem, Typography, Box, Paper, Button } from '@mui/material';
import { Helmet } from 'react-helmet';

function Display() {
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [folder, setFolder] = useState('');
  const [aiFile, setAiFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [note, setNote] = useState([]);
  const [clickedFile, setClickedFile] = useState('');  /* this is used to change the background when you click on the file */
  const [theFile, setTheFile] = useState('');
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
          setNote(response.data);

        })
        .catch(error => {
          console.error('Error fetching data from another endpoint:', error);
        });
    }
  }, [url]);

  const getFile = (file) => {
    setTheFile(file)
    axios.get(`/api/v1/monitor/display?url=${url}&file=${file}`)
      .then(response => {
        setFileContent(response.data.fileContent);
        setNewFiles(response.data.newFiles || []);
        setAiFile(response.data.aiFile);
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
    const count = note.filter(n => n.path.includes(fileName)).length;
    return count > 0 ? `(${count})` : ''; // Return count only if it's greater than zero
  };

  const deletePath = async (path) => {
    try {
      const encodedPath = encodeURIComponent(path);
      await axios.delete(`/api/v1/monitor/display/notifications?path=${encodedPath}`);
      setNote(prevNote => prevNote.filter(n => n.path !== path));


    } catch (error) {
      console.error('Error deleting path:', error);
    }
  };

  const handleFileClick = (file) => {
    getFile(file);


    if (note.some(n => n.path.includes(file))) {
      deletePath(file);
    }
  };

  const handleFileDownload = (file) => {
    const downloadUrl = `/api/v1/download?file=${file}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName(file)); // Set the download attribute with the filename
    document.body.appendChild(link);
    link.click();
    link.remove();
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

  const deleteNotif = async (url) => {
    try {
      const encodedUrl = encodeURIComponent(url);
      await axios.delete(`/api/v1/monitor/display/notifications/delete?url=${encodedUrl}`);

      // After deletion, fetch updated notifications to update the state
      const response = await axios.get(`/api/v1/monitor/display/notifications?url=${url}`);
      setNote(response.data);

    } catch (error) {
      console.error('Error deleting Url:', error);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, margin: '8px' }}>
      <Helmet>
          <title>{url}</title>
      </Helmet>
      <div className='display-header'>
        <Typography variant="h5" sx={{ mb: 2 }}>{fileName(clickedFile)}</Typography>
        <Button
              variant="outlined"
              color="error"  // You can customize the color as needed
              onClick={() => {deleteNotif(url)}}
              style={{ marginLeft: 'auto'}}
            >
              Del Notifications
            </Button>
      </div>
      <Box sx={{ display: 'flex', width: '100%', maxWidth: 2200 }}>
        
        <div>
          
          <Paper className='custom-scrollbar' sx={{ flex: 1, mr: 2, p: 2, overflow: 'auto', maxHeight: '90vh', backgroundColor: "var(--secondary-color)", color: 'white', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
            <List>
              {files.map((file, index) => (
                (fileName(file) === "html_endpoints.txt" || fileName(file) === "js_endpoints.txt") && (
                  <ListItem
                    key={index}
                    onClick={() => getFile(file)}
                    className={note.some(n => n.path.includes(fileName(file))) ? 'notification' : ''}
                    sx={{
                      backgroundColor: clickedFile === file ? 'var(--primary-color)' : 'inherit',
                      cursor: 'pointer',
                      padding: '2px 20px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '50px',
                      margin: '10px 0'
                    }}
                  >
                    <ListItemText primary={`${fileName(file)} ${countHighlighted(fileName(file))}`}  />
                  </ListItem>
                )
              ))}
            </List>
          </Paper>
          

          <Paper className='custom-scrollbar' sx={{ flex: 1, mr: 2, p: 2, overflow: 'auto', maxHeight: '90vh', backgroundColor: "var(--secondary-color)", color: 'white', border: '1px solid var(--border-color)' }}>
            <List>
              {files.map((file, index) => (
                fileName(file) !== "html_endpoints.txt" && fileName(file) !== "js_endpoints.txt" && (

                  <ListItem
                    key={index}
                    onClick={() => getFile(file)}
                    className={
                      note.some(n => n.ai > 0 && n.path.includes(fileName(file)))
                        ? 'notification_ai'
                        : note.some(n => n.path.includes(fileName(file)))
                        ? 'notification'
                        : ''
                    }
                    sx={{
                      backgroundColor: clickedFile === file ? 'var(--primary-color)' : 'inherit',
                      cursor: 'pointer',
                      padding: '2px 20px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '50px',
                      margin: '10px 0'
                    }}
                  >
                    <ListItemText primary={`${fileName(file)} ${countHighlighted(fileName(file))}`}  />
                  </ListItem>
                )))
                }
            </List>
          </Paper>

          
        </div>

        {fileContent && (
          <Paper className='custom-scrollbar' sx={{  backgroundColor:"grey", flex: 4, p: 3, fontSize: '18px',border: '1px solid var(--border-color)', backgroundColor: "var(--secondary-color)", color: 'white', overflow: "auto", maxHeight: '85vh', margin: "0 20px" }}>
            <Typography variant="h6">File Content </Typography>
            {fileContent === "[-] File too large" ? (
            <Button variant='contained' color='success' onClick={() => handleFileDownload(theFile)} >Download file</Button>  
            ):(

            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {renderHighlightedContent(fileContent)}
            </pre>

            )}
          </Paper>
        )}

        <div>
          { aiFile &&(
            <Paper className='custom-scrollbar' sx={{ flex: 2, mr: 2, p: 2, overflow: 'auto', maxHeight: '90vh', backgroundColor: "var(--secondary-color)", color: 'white', border: '1px solid var(--border-color)' }}>
                    <List>
                      {
                        <ListItem
                          onClick={() => handleFileClick(aiFile)}
                          className={
                            note.some(n => n.ai > 0 && n.path.includes(fileName(aiFile)))
                              ? 'notification_ai'
                              : note.some(n => n.path.includes(fileName(aiFile)))
                              ? 'notification'
                              : ''
                          }             
                          sx={{
                            backgroundColor: clickedFile === aiFile ? 'var(--primary-color)' : 'inherit',
                            cursor: 'pointer',
                            padding: '2px 20px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '50px',
                            margin: '10px 0'
                          }}
                        >
                          <ListItemText primary={fileName(aiFile)} sx={{ fontSize: '1px'}} />
                        </ListItem>
                      }
                    </List>
                  </Paper>
          )}


        <Paper className='custom-scrollbar' sx={{ flex: 2, mr: 2, p: 2, overflow: 'auto', maxHeight: '90vh', backgroundColor: "var(--secondary-color)", color: 'white', border: '1px solid var(--border-color)' }}>
          <List>
            {newFiles.slice().reverse().map((newFile, index) => (
              <ListItem
                key={index}
                onClick={() => handleFileClick(newFile)}
                className={
                  note.some(n => n.ai > 0 && n.path.includes(fileName(newFile)))
                    ? 'notification_ai'
                    : note.some(n => n.path.includes(fileName(newFile)))
                    ? 'notification'
                    : ''
                }             
                sx={{
                  backgroundColor: clickedFile === newFile ? 'var(--primary-color)' : 'inherit',
                  cursor: 'pointer',
                  padding: '2px 20px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50px',
                  margin: '10px 0'
                }}
              >
                <ListItemText primary={fileName(newFile)} sx={{ fontSize: '1px'}} />
              </ListItem>
            ))}
          </List>
        </Paper>
        
      </div>
      </Box>
    </Box>
  );
}

export default Display;
