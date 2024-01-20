const connection = require('../db/mysql');

const createNotification = async (type, message) => {
  try {
    await connection.execute(
      'INSERT INTO notifications (type, message) VALUES (?, ?)',
      [type, message]
    );
    console.log('Notification created successfully');
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = createNotification;
