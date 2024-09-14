const connection = require('../config/database');

const Link = {
  create: (userId, title, url, description, category, callback) => {
    const query = 'INSERT INTO links (user_id, title, url, description, category) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [userId, title, url, description, category], callback);
  },
  
  findAllByUser: (userId, callback) => {
    const query = 'SELECT * FROM links WHERE user_id = ?';
    connection.query(query, [userId], callback);
  },

  findByCategory: (userId, category, callback) => {
    const query = 'SELECT * FROM links WHERE user_id = ? AND category = ?';
    connection.query(query, [userId, category], callback);
  },
  update: (userId, linkId, title, url, description, category, callback) => {
    const query = 'UPDATE links SET title = ?, url = ?, description = ?, category = ? WHERE id = ? AND user_id = ?';
    connection.query(query, [title, url, description, category, linkId, userId], callback);
  },
  delete: (userId, linkId, callback) => {
    const query = 'DELETE FROM links WHERE id = ? AND user_id = ?';
    connection.query(query, [linkId, userId], callback);
  },
  search: (userId, query, callback) => {
    const sql = 'SELECT * FROM links WHERE user_id = ? AND (title LIKE ? OR description LIKE ? OR url LIKE ?)';
    connection.query(sql, [userId, `%${query}%`, `%${query}%`, `%${query}%`], callback);
  }
};

module.exports = Link;
