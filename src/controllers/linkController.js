const Link = require('../models/Link');

exports.createLink = (req, res) => {
  const userId = req.user.userId; // Get user ID from the request object
  const { title, url, description, category } = req.body;

  Link.create(userId, title, url, description, category, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating link' });
    }
    res.status(201).json({ message: 'Link created successfully', linkId: result.insertId });
  });
};

exports.getAllLinks = (req, res) => {
  const userId = req.user.userId;
  Link.findAllByUser(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching links' });
    }
    res.json(results);
    console.log(results);
  });
};

exports.getLinksByCategory = (req, res) => {
  const userId = req.user.userId;
  const { category } = req.params;

  Link.findByCategory(userId, category, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching links' });
    }
    res.json(results);
  });
};

exports.updateLink = (req, res) => {
  const userId = req.user.userId;
  const { linkId } = req.params;
  const { title, url, description, category } = req.body;

  Link.update(userId, linkId, title, url, description, category, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating link' });
    }
    res.json({ message: 'Link updated successfully', result });
  });
};

exports.deleteLink = (req, res) => {
  const userId = req.user.userId;
  const { linkId } = req.params;

  Link.delete(userId, linkId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting link' });
    }
    res.json({ message: 'Link deleted successfully' });
  });
};

exports.searchLinks = (req, res) => {
    const userId = req.user.userId;
    const { query } = req.body;

    Link.search(userId, query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error searching links' });
        }
        res.json(results);
    });
}
