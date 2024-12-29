import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, IconButton } from '@mui/material';
import { Helmet } from 'react-helmet';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import './display.css';

function Display() {
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [folder, setFolder] = useState('');
  const [aiFile, setAiFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [note, setNote] = useState([]);
  const [clickedFile, setClickedFile] = useState('');
  const [theFile, setTheFile] = useState('');
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const url = query.get('url');

  useEffect(() => {
    if (url) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/v1/monitor/display?url=${url}`);
          setFolder(response.data.savedFolder);
          setFiles(response.data.files);
        } catch (error) {
          console.error('Error fetching data:', error);
        }

        try {
          const notificationResponse = await axios.get(`/api/v1/monitor/display/notifications?url=${url}`);
          setNote(notificationResponse.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
      fetchData();
    }
  }, [url]);

  const getFile = async (file) => {
    setTheFile(file);
    setClickedFile(file);
    try {
      const response = await axios.get(`/api/v1/monitor/display?url=${url}&file=${file}`);
      setFileContent(response.data.fileContent);
      setNewFiles(response.data.newFiles || []);
      setAiFile(response.data.aiFile);
    } catch (error) {
      console.error(`Error Getting file ${file}`, error);
      setFileContent(`Error loading file: ${error.message}`);
    }
  };

  const fileName = (filePath) => filePath.split('/').pop();

  const countHighlighted = (fileName) => {
    const count = note.filter(n => n.path.includes(fileName)).length;
    return count > 0 ? <span className="fantastic-notification-badge">{count}</span> : '';
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
    link.setAttribute('download', fileName(file));
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderHighlightedContent = (content) => {
    if (!content) return null;

    return content.split('\n').map((line, index) => {
      if (line.startsWith('+')) {
        return <div key={index} className="fantastic-file-content-line-add">{line}</div>;
      } else if (line.startsWith('-')) {
        return <div key={index} className="fantastic-file-content-line-remove">{line}</div>;
      } else {
        return <div key={index}>{line}</div>;
      }
    });
  };

  const deleteNotif = async (url) => {
    try {
      const encodedUrl = encodeURIComponent(url);
      await axios.delete(`/api/v1/monitor/display/notifications/delete?url=${encodedUrl}`);
      const response = await axios.get(`/api/v1/monitor/display/notifications?url=${url}`);
      setNote(response.data);
    } catch (error) {
      console.error('Error deleting Url:', error);
    }
  };

  return (
    <Box className="fantastic-display-container">
      <Helmet>
        <title>{url}</title>
      </Helmet>
      <Box className="fantastic-display-header">
        <Typography variant="h5" component="h2">
          {fileName(clickedFile) || 'Select a File'}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => deleteNotif(url)}
        >
          Clear Notifications
        </Button>
      </Box>

      <Box className="fantastic-file-lists">
        <div className="fantastic-file-list-card">
          <h3>Endpoints</h3>
          <ul className="fantastic-file-list">
            {files.map((file, index) => (
              (fileName(file) === 'html_endpoints.txt' || fileName(file) === 'js_endpoints.txt') && (
                <li
                  key={index}
                  className={`fantastic-file-list-item ${clickedFile === file ? 'active' : ''} ${note.some(n => n.path.includes(fileName(file))) ? 'notification' : ''}`}
                  onClick={() => getFile(file)}
                >
                  {fileName(file)} {countHighlighted(fileName(file))}
                  {note.some(n => n.path.includes(fileName(file))) && <WarningAmberIcon color="warning" />}
                </li>
              )
            ))}
          </ul>
        </div>

        <div className="fantastic-file-list-card">
          <h3>Other Files</h3>
          <ul className="fantastic-file-list">
            {files.map((file, index) => (
              fileName(file) !== 'html_endpoints.txt' && fileName(file) !== 'js_endpoints.txt' && (
                <li
                  key={index}
                  className={`fantastic-file-list-item ${clickedFile === file ? 'active' : ''} ${note.some(n => n.ai > 0 && n.path.includes(fileName(file))) ? 'notification_ai' : note.some(n => n.path.includes(fileName(file))) ? 'notification' : ''}`}
                  onClick={() => getFile(file)}
                >
                  {fileName(file)} {countHighlighted(fileName(file))}
                  {note.some(n => n.ai > 0 && n.path.includes(fileName(file))) ? (
                    <span className="fantastic-ai-badge">AI</span>
                  ) : (note.some(n => n.path.includes(fileName(file))) && <WarningAmberIcon color="warning" />)}
                </li>
              )
            ))}
          </ul>
        </div>
      </Box>

      <Box className="fantastic-file-content">
        <Box className="fantastic-file-content-header">
          <Typography variant="h6" component="h3">
            {theFile ? fileName(theFile) : 'No File Selected'}
          </Typography>
          <div className="fantastic-file-actions">
            {theFile && (
              <IconButton aria-label="download" onClick={() => handleFileDownload(theFile)}>
                <CloudDownloadIcon color="inherit" />
              </IconButton>
            )}
          </div>
        </Box>
        {fileContent === '[-] File too large' ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={() => handleFileDownload(theFile)}
          >
            Download File
          </Button>
        ) : (
          renderHighlightedContent(fileContent)
        )}
      </Box>

      <Box className="fantastic-ai-files">
        {aiFile && (
          <div className="fantastic-file-list-card">
            <h3>AI Generated File</h3>
            <ul className="fantastic-file-list">
              <li
                className={`fantastic-file-list-item ${clickedFile === aiFile ? 'active' : ''} ${note.some(n => n.ai > 0 && n.path.includes(fileName(aiFile))) ? 'notification_ai' : note.some(n => n.path.includes(fileName(aiFile))) ? 'notification' : ''}`}
                onClick={() => handleFileClick(aiFile)}
              >
                {fileName(aiFile)}
                {note.some(n => n.ai > 0 && n.path.includes(fileName(aiFile))) ? (
                  <span className="fantastic-ai-badge">AI</span>
                ) : (note.some(n => n.path.includes(fileName(aiFile))) && <WarningAmberIcon color="warning" />)}
              </li>
            </ul>
          </div>
        )}

        <div className="fantastic-file-list-card">
          <h3>Recently Modified</h3>
          <ul className="fantastic-file-list">
            {newFiles.slice().reverse().map((newFile, index) => (
              <li
                key={index}
                className={`fantastic-file-list-item ${clickedFile === newFile ? 'active' : ''} ${note.some(n => n.ai > 0 && n.path.includes(fileName(newFile))) ? 'notification_ai' : note.some(n => n.path.includes(fileName(newFile))) ? 'notification' : ''}`}
                onClick={() => handleFileClick(newFile)}
              >
                {fileName(newFile)}
                {note.some(n => n.ai > 0 && n.path.includes(fileName(newFile))) ? (
                  <span className="fantastic-ai-badge">AI</span>
                ) : (note.some(n => n.path.includes(fileName(newFile))) && <WarningAmberIcon color="warning" />)}
              </li>
            ))}
          </ul>
        </div>
      </Box>
    </Box>
  );
}

export default Display;