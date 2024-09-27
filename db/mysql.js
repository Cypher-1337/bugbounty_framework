const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'scanner',
    password: 'scanner',
    database: 'bugbounty',
    connectTimeout: 10000 // Increase connection timeout
});

function handleDisconnect(connection) {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            setTimeout(() => handleDisconnect(connection), 2000); // Retry connection after 2 seconds
        } else {
            console.log('Connected to MySQL database');
            
            // Add ping mechanism here, once the connection is established
            setInterval(() => {
                connection.ping((err) => {
                    if (err) {
                        console.error('MySQL ping error:', err);
                    } else {
                        console.log('MySQL ping successful');
                    }
                });
            }, 3600000); // Ping every 1 hour
        }
    });

    connection.on('error', (err) => {
        console.error('MySQL connection error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
            handleDisconnect(connection); // Reconnect if connection is lost
        } else {
            throw err;
        }
    });
}

handleDisconnect(connection);

module.exports = connection;
