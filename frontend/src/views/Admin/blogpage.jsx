import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Avatar,
  Fab,
  Snackbar,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CloudUpload as CloudUploadIcon,
  PhotoLibrary as PhotoLibraryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import AdminLayout from './AdminLayout';

// Shared image storage - this will be used by both admin and about page
const sharedImages = {
  hero: [
    { id: 1, url: '/home4.png', title: 'Hero Image 1', category: 'hero' },
    { id: 2, url: '/home3.png', title: 'Hero Image 2', category: 'hero' },
    { id: 3, url: '/home2.png', title: 'Hero Image 3', category: 'hero' }
  ],
  blog: [
    { id: 4, url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Internship Tips', category: 'blog' },
    { id: 5, url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Networking', category: 'blog' },
    { id: 6, url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Remote Work', category: 'blog' }
  ],
  about: [
    { id: 7, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Team Work', category: 'about' },
    { id: 8, url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', title: 'Innovation', category: 'about' }
  ]
};

// Mock blog data for admin management
const initialBlogs = [
  {
    id: 1,
    title: "Top 10 Tips for Landing Your Dream Internship",
    excerpt: "Discover the essential strategies that successful interns use to secure their ideal positions in competitive markets.",
    author: "Sarah Johnson",
    date: "2024-12-20",
    category: "Career Tips",
    image: sharedImages.blog[0].url,
    tags: ["Internship", "Career", "Job Search"],
    published: true,
    content: "Full blog content here..."
  },
  {
    id: 2,
    title: "Building Your Professional Network as an Intern",
    excerpt: "Learn how to create meaningful professional relationships that will benefit your career long after your internship ends.",
    author: "Michael Chen",
    date: "2024-12-18",
    category: "Networking",
    image: sharedImages.blog[1].url,
    tags: ["Networking", "Professional", "Career Growth"],
    published: true,
    content: "Full blog content here..."
  },
  {
    id: 3,
    title: "Remote Internships: Pros, Cons, and Best Practices",
    excerpt: "Navigate the world of remote internships with confidence. Understand what works and what doesn't in virtual work environments.",
    author: "Emily Rodriguez",
    date: "2024-12-15",
    category: "Remote Work",
    image: sharedImages.blog[2].url,
    tags: ["Remote Work", "Internship", "Productivity"],
    published: false,
    content: "Full blog content here..."
  }
];

const categories = ["Career Tips", "Networking", "Remote Work", "Professional Development", "Technology", "Interview Tips"];

const BlogManagementPage = () => {
  const theme = useTheme();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [images, setImages] = useState(sharedImages);
  const [openDialog, setOpenDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCategory, setImageCategory] = useState('blog');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newBlog, setNewBlog] = useState({
    title: '',
    excerpt: '',
    author: '',
    category: '',
    image: '',
    tags: [],
    published: false,
    content: ''
  });
  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState({
    url: '',
    title: '',
    category: 'blog'
  });

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setNewBlog({ ...blog, tags: [...blog.tags] });
    } else {
      setEditingBlog(null);
      setNewBlog({
        title: '',
        excerpt: '',
        author: '',
        category: '',
        image: '',
        tags: [],
        published: false,
        content: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
  };

  const handleSaveBlog = () => {
    if (!newBlog.title || !newBlog.excerpt || !newBlog.author || !newBlog.category) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    if (editingBlog) {
      // Update existing blog
      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog.id === editingBlog.id ? { ...newBlog, id: blog.id } : blog
        )
      );
      setSnackbar({
        open: true,
        message: 'Blog updated successfully!',
        severity: 'success'
      });
    } else {
      // Create new blog
      const id = Math.max(...blogs.map(b => b.id), 0) + 1;
      const currentDate = new Date().toISOString().split('T')[0];
      setBlogs(prevBlogs => [
        ...prevBlogs,
        { ...newBlog, id, date: currentDate }
      ]);
      setSnackbar({
        open: true,
        message: 'Blog created successfully!',
        severity: 'success'
      });
    }

    handleCloseDialog();
  };

  const handleDeleteBlog = (blogId) => {
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
    setSnackbar({
      open: true,
      message: 'Blog deleted successfully!',
      severity: 'success'
    });
  };

  const handleTogglePublish = (blogId) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === blogId ? { ...blog, published: !blog.published } : blog
      )
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newBlog.tags.includes(newTag.trim())) {
      setNewBlog(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageSelect = (imageUrl) => {
    setNewBlog(prev => ({ ...prev, image: imageUrl }));
    setSelectedImage(imageUrl);
  };

  const handleAddImage = () => {
    if (!newImage.url || !newImage.title) {
      setSnackbar({
        open: true,
        message: 'Please provide both image URL and title',
        severity: 'error'
      });
      return;
    }

    const id = Math.max(...Object.values(images).flat().map(img => img.id), 0) + 1;
    const imageToAdd = { ...newImage, id };

    setImages(prev => ({
      ...prev,
      [newImage.category]: [...prev[newImage.category], imageToAdd]
    }));

    setNewImage({ url: '', title: '', category: 'blog' });
    setSnackbar({
      open: true,
      message: 'Image added successfully! It will be available across all pages.',
      severity: 'success'
    });
  };

  const handleDeleteImage = (imageId, category) => {
    setImages(prev => ({
      ...prev,
      [category]: prev[category].filter(img => img.id !== imageId)
    }));
    setSnackbar({
      open: true,
      message: 'Image deleted successfully!',
      severity: 'success'
    });
  };

  return (
    <AdminLayout title="Blog Management">
      <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}
          >
            Blog Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage blog posts and shared images for your website
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<PhotoLibraryIcon />}
            onClick={() => setOpenImageDialog(true)}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              borderColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: 'white'
              }
            }}
          >
            Manage Images
          </Button>
          <Fab
            color="primary"
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
              }
            }}
          >
            <AddIcon />
          </Fab>
        </Stack>
      </Box>

      {/* Blogs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: theme.shadows[8] }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                  <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow
                    key={blog.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.grey[50]
                      }
                    }}
                  >
                    <TableCell>
                      <Avatar
                        src={blog.image}
                        variant="rounded"
                        sx={{ width: 60, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, maxWidth: 200 }}>
                        {blog.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {blog.excerpt.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>
                      <Chip
                        label={blog.category}
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.dark
                        }}
                      />
                    </TableCell>
                    <TableCell>{new Date(blog.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={blog.published}
                            onChange={() => handleTogglePublish(blog.id)}
                            color="primary"
                          />
                        }
                        label={blog.published ? 'Published' : 'Draft'}
                        sx={{ margin: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(blog)}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteBlog(blog.id)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </motion.div>

      {/* Blog Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Excerpt *"
                  multiline
                  rows={3}
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Author *"
                      value={newBlog.author}
                      onChange={(e) => setNewBlog(prev => ({ ...prev, author: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category *</InputLabel>
                      <Select
                        value={newBlog.category}
                        label="Category *"
                        onChange={(e) => setNewBlog(prev => ({ ...prev, category: e.target.value }))}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags</Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                    {newBlog.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} variant="outlined" size="small">
                      Add
                    </Button>
                  </Stack>
                </Box>

                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={8}
                  value={newBlog.content}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog content here..."
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={newBlog.published}
                      onChange={(e) => setNewBlog(prev => ({ ...prev, published: e.target.checked }))}
                    />
                  }
                  label="Publish immediately"
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: '12px' }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Featured Image</Typography>
                
                {newBlog.image && (
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={newBlog.image}
                      alt="Selected"
                      style={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                  </Box>
                )}

                <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>
                  Choose from available images:
                </Typography>
                
                <ImageList cols={2} gap={8}>
                  {images.blog.map((image) => (
                    <ImageListItem
                      key={image.id}
                      sx={{
                        cursor: 'pointer',
                        border: selectedImage === image.url ? `2px solid ${theme.palette.primary.main}` : 'none',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                      onClick={() => handleImageSelect(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        loading="lazy"
                        style={{ height: 60, objectFit: 'cover' }}
                      />
                      <ImageListItemBar
                        title={image.title}
                        sx={{
                          '& .MuiImageListItemBar-title': {
                            fontSize: '0.7rem'
                          }
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveBlog}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
              }
            }}
          >
            {editingBlog ? 'Update' : 'Create'} Blog
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Management Dialog */}
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Manage Shared Images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Images managed here will be available across all pages (Blog, About, etc.)
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '12px', backgroundColor: theme.palette.grey[50] }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Add New Image
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={newImage.url}
                    onChange={(e) => setNewImage(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Image Title"
                    value={newImage.title}
                    onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newImage.category}
                      label="Category"
                      onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <MenuItem value="blog">Blog</MenuItem>
                      <MenuItem value="about">About</MenuItem>
                      <MenuItem value="hero">Hero</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddImage}
                    startIcon={<CloudUploadIcon />}
                    sx={{ height: '56px' }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Image Categories */}
          {Object.entries(images).map(([category, categoryImages]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textTransform: 'capitalize' }}>
                {category} Images ({categoryImages.length})
              </Typography>
              <ImageList cols={4} gap={16}>
                {categoryImages.map((image) => (
                  <ImageListItem key={image.id}>
                    <img
                      src={image.url}
                      alt={image.title}
                      loading="lazy"
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                    <ImageListItemBar
                      title={image.title}
                      actionIcon={
                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                          onClick={() => handleDeleteImage(image.id, category)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              {categoryImages.length === 0 && (
                <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: theme.palette.grey[50] }}>
                  <Typography color="text.secondary">
                    No images in {category} category
                  </Typography>
                </Paper>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </AdminLayout>
  );
};

export default BlogManagementPage;
