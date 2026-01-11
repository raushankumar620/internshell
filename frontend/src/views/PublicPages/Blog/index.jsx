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
import PublicFooter from 'component/PublicFooter';

// Shared Components
import PageHeader from '../components/PageHeader';
// import { useImageService } from '../../../services/imageService';

// Mock blog data with static images for now
const mockBlogs = [
  {
    id: 1,
    title: "Top 10 Tips for Landing Your Dream Internship",
    excerpt: "Discover the essential strategies that successful interns use to secure their ideal positions in competitive markets.",
    author: "Sarah Johnson",
    date: "December 20, 2024",
    readTime: "5 min read",
    category: "Career Tips",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    tags: ["Interviews", "Virtual", "Tips", "Preparation"],
    likes: 178,
    comments: 34
  }
];

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
                {blog.tags.slice(0, 2).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      height: '22px',
                      borderRadius: '11px',
                      borderColor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      backgroundColor: 'rgba(102, 126, 234, 0.08)',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light,
                        color: 'white'
                      }
                    }}
                  />
                ))}
                {blog.tags.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{blog.tags.length - 2} more
                  </Typography>
                )}
              </Stack>
              
              {/* Engagement metrics */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLiked(!liked);
                    }}
                    sx={{
                      color: liked ? theme.palette.error.main : theme.palette.grey[500],
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.2)'
                      }
                    }}
                  >
                    <FavoriteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {blog.likes + (liked ? 1 : 0)}
                  </Typography>
                </Stack>
                
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {blog.comments} comments
                </Typography>
              </Stack>
            </Stack>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<ArticleIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                mt: 2,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              Read Full Article
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const BlogPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  
  // Use static blog data for now
  const [blogs] = useState(mockBlogs);
  
  const blogsPerPage = 6;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and search logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = sortedBlogs.slice(startIndex, startIndex + blogsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <PublicNavbar />
      
      {/* Page Header */}
      <PageHeader
        title="Our Blog"
        subtitle="Insights, tips, and resources for your career success"
        backgroundImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
        {loading ? (
          <Grid container spacing={4}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ borderRadius: '20px' }}>
                  <Skeleton variant="rectangular" height={220} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="text" width="80%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {/* Enhanced Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: 4,
                  mb: 6,
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Search articles, authors, or topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '16px',
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          '&:hover': {
                            border: `1px solid ${theme.palette.primary.main}`,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}20`
                          },
                          '&.Mui-focused': {
                            border: `2px solid ${theme.palette.primary.main}`,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}30`
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                      <Button
                        variant={sortBy === 'date' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => setSortBy('date')}
                        sx={{ borderRadius: '20px', textTransform: 'none' }}
                      >
                        Latest
                      </Button>
                      <Button
                        variant={sortBy === 'popular' ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<TrendingUpIcon />}
                        onClick={() => setSortBy('popular')}
                        sx={{ borderRadius: '20px', textTransform: 'none' }}
                      >
                        Popular
                      </Button>
                      <IconButton
                        size="small"
                        sx={{
                          border: '1px solid',
                          borderColor: theme.palette.divider,
                          borderRadius: '20px'
                        }}
                      >
                        <FilterListIcon />
                      </IconButton>
                    </Stack>
                  </Grid>
                </Grid>
                
                {/* Category filters */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                    Filter by category:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {categories.map((category) => (
                      <motion.div
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Chip
                          label={category}
                          onClick={() => setSelectedCategory(category)}
                          variant={selectedCategory === category ? 'filled' : 'outlined'}
                          sx={{
                            borderRadius: '16px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            ...(selectedCategory === category ? {
                              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                              color: 'white',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                            } : {
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.light,
                                color: 'white'
                              }
                            })
                          }}
                        />
                      </motion.div>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </motion.div>

            {/* Blog Grid with enhanced animations */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 6 }}>
                <AnimatePresence mode="wait">
                  {currentBlogs.map((blog, index) => (
                    <Grid item xs={12} md={6} lg={4} key={blog.id}>
                      <BlogCard blog={blog} index={index} />
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
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
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        },
                        '&.Mui-selected': {
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          color: 'white'
                        }
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
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '20px' }}>
                  <Typography variant="h4" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>
                    No articles found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adjusting your search or filter criteria
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    sx={{ mt: 2, borderRadius: '20px' }}
                  >
                    Clear Filters
                  </Button>
                </Paper>
              </motion.div>
            )}
          </>
        )}
      </Container>
      
      <PublicFooter />
    </Box>
  );
};

export default BlogPage;