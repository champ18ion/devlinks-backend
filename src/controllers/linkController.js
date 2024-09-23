const Link = require('../models/Link');

exports.createLink = (req, res) => {
  const userId = req.user.userId; // Get user ID from the request object
  const { title, url, description, category, isPublic} = req.body;

  Link.create(userId, title, url, description, category, isPublic, (err, result) => {
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

exports.getPublicLinks = (req, res) => {
  const userId = req.user.userId || null;
  const filterType = req.query.filter || 'latest';

  Link.getPublicLinks(userId,filterType, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching public links' });
    }
    res.json(results);
  });
}

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

exports.upvoteLink = (req, res) => {
    const userId = req.user.userId;
    const { linkId } = req.params;
    if(!Link.hasUpvoted(userId, linkId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error upvoting link' });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: 'Link already upvoted' });
        }
        Link.upvote(userId, linkId, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error upvoting link' });
            }
            res.json({ message: 'Link upvoted successfully', result });
        });
    }));
  }

  exports.downvoteLink = (req, res) => {
    const userId = req.user.userId;
    const { linkId } = req.params;
  
    // First, check if the user has upvoted the link
    Link.hasUpvoted(userId, linkId, (err, hasUpvoted) => {
      if (err) {
        return res.json({ error: 'Error fetching upvote status' });
      }
  
      // If the user has not upvoted, they cannot downvote
      if (!hasUpvoted) {
        return res.json({ error: 'Cannot downvote link because you have not upvoted it' });
      }
  
      // Proceed with downvoting since the user has upvoted
      Link.downvote(userId, linkId, (err, result) => {
        if (err) {
          return res.json({ error: 'Error downvoting link' });
        }
        res.json(result); // Success
      });
    });
  };
  

  exports.upvoteStatus = (req,res) => {
    const userId = req.user.userId;
    Link.upvoteStatus(userId,(err,result)=>{
        if(err){
            return res.status(500).json({ error: 'Error fetching upvote status' });
        }
        const links = result.map(link => {
            const { link_id, upvotes } = link;
            return link_id;
        });
        res.json(links);
    })
  }