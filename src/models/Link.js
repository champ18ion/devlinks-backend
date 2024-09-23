const connection = require('../config/database');
const { upvoteStatus, getPublicLinks } = require('../controllers/linkController');

const Link = {
  create: (userId, title, url, description, category, isPublic, callback) => {
    const query = 'INSERT INTO links (user_id, title, url, description, category, is_public) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [userId, title, url, description, category, isPublic], callback);
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
  },
  hasUpvoted: (userId, linkId, callback) => {
    const sql = "SELECT * FROM upvotes WHERE user_id = ? AND link_id = ?";
    connection.query(sql, [userId, linkId], callback);
  },
  
  upvote: (userId, linkId, callback) => {
    // First, insert the upvote into the 'upvotes' table
    const sqlInsertUpvote = "INSERT INTO upvotes (user_id, link_id) VALUES (?, ?)";
    connection.query(sqlInsertUpvote, [userId, linkId], (err, result) => {
      if (err) {
        return callback(err);  // Handle error
      }
  
      // After inserting into 'upvotes', update the 'links' table
      const sqlUpdateUpvotes = "UPDATE links SET upvotes = upvotes + 1 WHERE id = ?";
      connection.query(sqlUpdateUpvotes, [linkId], callback);
    });
  },

  downvote: (userId,linkId,callback) => {

    // 
    const sqlRemove = "DELETE FROM upvotes WHERE user_id = ? AND link_id = ?";
    connection.query(sqlRemove,[userId,linkId],(err,result)=>{
      if(err){
        return callback(err);
      }
    });

    const sqlDownvote = "UPDATE links SET upvotes = upvotes - 1 WHERE id = ?";
    connection.query(sqlDownvote,[linkId],callback);

  },

  upvoteStatus:(userId,callback)=>{
    const sql = "SELECT link_id FROM upvotes WHERE user_id = ?"
    connection.query(sql,[userId],callback)
  },

  getPublicLinks: (userId, filterType, callback) => {
    // Base query for fetching public links
    let sql = `
      SELECT 
        links.id, 
        links.title, 
        links.url, 
        links.description, 
        links.category, 
        links.upvotes, 
        links.created_at, 
        CASE WHEN upvotes.user_id IS NOT NULL THEN 1 ELSE 0 END AS userUpvoted
      FROM links
      LEFT JOIN upvotes ON links.id = upvotes.link_id AND upvotes.user_id = ?
      WHERE links.is_public = 1
    `;

    // Apply filters based on the selected filter type
    if (filterType === 'latest') {
      sql += ' ORDER BY links.created_at DESC';  // Latest links first
    } else if (filterType === 'trending') {
      // For "trending", we can calculate the number of upvotes in the last 7 days
      sql += `
        AND upvotes.created_at >= NOW() - INTERVAL 7 DAY
        GROUP BY links.id
        ORDER BY COUNT(upvotes.id) DESC
      `;
    } else if (filterType === 'popular') {
      // For "most upvoted", simply order by the total upvotes
      sql += ' ORDER BY links.upvotes DESC';
    } else {
      // Default ordering (e.g., latest)
      sql += ' ORDER BY links.created_at DESC';
    }

    // Run the query
    connection.query(sql, [userId], (err, results) => {
      if (err) {
        return callback(err); // Handle error
      }

      callback(null, results); // Return results
    });
  },
};



module.exports = Link;
