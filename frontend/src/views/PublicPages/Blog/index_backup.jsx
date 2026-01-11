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
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Pagination,
  Skeleton,
  Paper,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PublicNavbar from 'component/PublicNavbar';

// Shared Components
import PageHeader from '../components/PageHeader';
import { useImageService } from '../../../services/imageService';

// Generate mock blogs with dynamic images
const generateMockBlogs = (blogImages) => {
  const blogData = [
    {
      id: 1,
      title: "Top 10 Tips for Landing Your Dream Internship",
      excerpt: "Discover the essential strategies that successful interns use to secure their ideal positions in competitive markets.",
      author: "Sarah Johnson",
      date: "December 20, 2024",
      readTime: "5 min read",
      category: "Career Tips",
      likes: 156,
      comments: 23
      tags: ["Internship", "Career", "Job Search"],
      likes: 156,
      comments: 23
    },
    {
      id: 2,
      title: "Building Your Professional Network as an Intern",
      excerpt: "Learn how to create meaningful professional relationships that will benefit your career long after your internship ends.",
      author: "Michael Chen",
      date: "December 18, 2024",
      readTime: "7 min read",
      category: "Networking",
      tags: ["Networking", "Professional", "Career Growth"],
      likes: 203,
      comments: 45
    },
    {
      id: 3,
      title: "Remote Internships: Pros, Cons, and Best Practices",
      excerpt: "Navigate the world of remote internships with confidence. Understand what works and what doesn't in virtual work environments.",
      author: "Emily Rodriguez",
      date: "December 15, 2024",
      readTime: "6 min read",
      category: "Remote Work",
      tags: ["Remote Work", "Internship", "Productivity"],
      likes: 142,
      comments: 31
    },
    {
      id: 4,
      title: "How to Make a Lasting Impact During Your Internship",
      excerpt: "Transform your temporary internship position into a stepping stone for permanent career opportunities.",
      author: "David Kim",
      date: "December 12, 2024",
      readTime: "8 min read",
      category: "Professional Development",
      tags: ["Professional Development", "Career", "Skills"],
      likes: 189,
      comments: 52
    },
    {
      id: 5,
      title: "The Future of Internships: AI and Technology Trends",
      excerpt: "Explore how artificial intelligence and emerging technologies are reshaping the internship landscape.",
      author: "Lisa Wang",
      date: "December 10, 2024",
      readTime: "10 min read",
      category: "Technology",
      tags: ["Technology", "AI", "Future", "Innovation"],
      likes: 267,
      comments: 78
    },
    {
      id: 6,
      title: "Mastering Virtual Interviews for Internships",
      excerpt: "Ace your virtual interviews with proven techniques and technical setup tips that impress recruiters.",
      author: "Alex Thompson",
      date: "December 8, 2024",
      readTime: "6 min read",
      category: "Interview Tips",
      tags: ["Interviews", "Virtual", "Tips", "Preparation"],
      likes: 178,
      comments: 34
    }
  ];

  // Assign images from the image service
  return blogData.map((blog, index) => ({
    ...blog,
    image: blogImages[index % blogImages.length]?.url || blogImages[0]?.url
  }));
};

const categories = ["All", "Career Tips", "Networking", "Remote Work", "Professional Development", "Technology", "Interview Tips"];

const BlogCard = ({ blog, index }) => {
  const theme = useTheme();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(0,0,0,0.08)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1px solid rgba(102, 126, 234, 0.3)'
          }
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <CardMedia
              component="img"
              height="220"
              image={blog.image}
              alt={blog.title}
              sx={{
                objectFit: 'cover',
                filter: 'brightness(0.95)'
              }}
            />
          </motion.div>
          
          {/* Overlay gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, transparent 0%, transparent 70%, rgba(0,0,0,0.3) 100%)'
            }}
          />
          
          {/* Category chip */}
          <Chip
            label={blog.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              color: theme.palette.primary.main
            }}
          />
          
          {/* Action buttons */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setBookmarked(!bookmarked);
              }}
              sx={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                color: bookmarked ? theme.palette.warning.main : theme.palette.grey[600],
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <BookmarkIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                color: theme.palette.grey[600],
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <ShareIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Stack spacing={2.5}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                lineHeight: 1.3,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              {blog.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.7,
                flexGrow: 1,
                fontSize: '0.95rem'
              }}
            >
              {blog.excerpt}
            </Typography>
            
            {/* Author info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                {blog.author.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {blog.author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {blog.date} • {blog.readTime}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            {/* Tags and engagement */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                <Chip 
                  key={index}
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.75rem',
                    height: '24px'
                  }}
                />
              ))}
            </Stack>
            
            <Button 
              variant="contained" 
              color="primary"
              sx={{
                mt: 2,
                borderRadius: '25px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Read More
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const BlogPage = () => {
  const theme = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const blogsPerPage = 6;

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setBlogs(mockBlogs);
      setFilteredBlogs(mockBlogs);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = blogs;
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredBlogs(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, blogs]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <PublicNavbar />
      
      <PageHeader
        title="InternShell Blog"
        subtitle="Discover insights, tips, and inspiring stories to help you navigate and succeed in your internship journey"
        center={true}
        badge="Latest Articles & Tips"
        breadcrumbItems={['Blog']}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '25px',
                      bgcolor: 'white',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  flexWrap="wrap"
                  sx={{ 
                    gap: 1,
                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    alignItems: 'center'
                  }}
                >
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => handleCategoryChange(category)}
                      color={selectedCategory === category ? "primary" : "default"}
                      variant={selectedCategory === category ? "filled" : "outlined"}
                      size="small"
                      sx={{
                        borderRadius: '20px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        margin: '4px',
                        minWidth: 'fit-content',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <Grid container spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={240} />
                  <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Box sx={{ mt: 2 }}>
                      <Skeleton variant="rectangular" width={80} height={32} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Grid container spacing={4}>
              {currentBlogs.map((blog, index) => (
                <Grid item xs={12} md={6} lg={4} key={blog.id}>
                  <BlogCard blog={blog} index={index} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '12px',
                        fontWeight: 600,
                      }
                    }}
                  />
                </Box>
              </motion.div>
            )}

            {/* No Results */}
            {filteredBlogs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h4" color="text.secondary" gutterBottom>
                    No articles found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adjusting your search or filter criteria
                  </Typography>
                </Box>
              </motion.div>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default BlogPage;