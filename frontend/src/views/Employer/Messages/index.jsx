import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
  Badge,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  Fade,
  Skeleton,
  useMediaQuery
} from '@mui/material';

// project import
import { gridSpacing } from 'config.js';
import { messageAPI, profileAPI } from '../../../services/api';

// assets
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import InboxIcon from '@mui/icons-material/Inbox';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

// ==============================|| EMPLOYER MESSAGES - ENHANCED ||============================== //

const EmployerMessages = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const messagesEndRef = useRef(null);
  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newRecipient, setNewRecipient] = useState(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      console.log('📨 Fetching conversations...');
      const response = await messageAPI.getConversations();
      console.log('📬 Conversations response:', response);
      
      if (response.success) {
        const validConversations = response.data.filter(conv => conv.user && conv.user._id);
        console.log('✅ Valid conversations:', validConversations);
        setConversations(validConversations);
        
        // Auto-select first conversation if available
        if (validConversations.length > 0 && !selectedChat && !newRecipient) {
          setSelectedChat(validConversations[0].user);
        }
      } else {
        console.error('❌ Conversations API returned success: false', response);
        setError('Failed to load conversations');
      }
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Error loading conversations: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle navigation with recipientId
  useEffect(() => {
    if (location.state?.recipientId) {
      const { recipientId } = location.state;
      const existingConversation = conversations.find(conv => conv.user._id === recipientId);
      
      if (existingConversation) {
        setSelectedChat(existingConversation.user);
      } else {
        fetchUserDetails(recipientId);
      }
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [conversations, location.state, navigate]);

  // Fetch user details for new conversation
  const fetchUserDetails = async (userId) => {
    try {
      const response = await profileAPI.getUserById(userId);
      if (response.success) {
        setNewRecipient(response.data);
        setSelectedChat(response.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (selectedChat && !newRecipient) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat, newRecipient]);

  const fetchMessages = async (userId) => {
    try {
      setMessagesLoading(true);
      console.log('📩 Fetching messages for user:', userId);
      const response = await messageAPI.getConversation(userId);
      console.log('📬 Messages response:', response);
      if (response.success) {
        console.log('✅ Messages loaded:', response.data.length);
        setMessages(response.data);
      } else {
        console.error('❌ Messages API returned success: false');
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      setSending(true);
      const messageData = {
        receiver: selectedChat._id,
        message: message.trim()
      };

      const response = await messageAPI.sendMessage(messageData);
      
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setMessage('');
        
        // Update conversations list
        setConversations(prev => {
          return prev.map(conv => {
            if (conv.user._id === selectedChat._id) {
              return {
                ...conv,
                lastMessage: {
                  message: response.data.message,
                  createdAt: response.data.createdAt,
                  isRead: false
                }
              };
            }
            return conv;
          });
        });

        // If this was a new conversation, add it to the list
        if (newRecipient) {
          const newConversation = {
            user: selectedChat,
            lastMessage: {
              message: response.data.message,
              createdAt: response.data.createdAt,
              isRead: false
            },
            unreadCount: 0
          };
          setConversations(prev => [newConversation, ...prev]);
          setNewRecipient(null);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  // Helper function to determine if a message is from the current user
  const isOwnMessage = (msg) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return msg.sender._id === user._id;
    } catch (error) {
      return false;
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => {
    if (!conv.user) return false;
    const name = conv.user?.name || conv.user?.email || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getAvatarColor = (name) => {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
      '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const msgDate = new Date(date);
    
    if (today.toDateString() === msgDate.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === msgDate.toDateString()) {
      return 'Yesterday';
    }
    
    return msgDate.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return msgDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  // Conversation List Item Component
  const ConversationItem = ({ conv, isSelected, onClick }) => (
    <ListItem
      button
      selected={isSelected}
      onClick={onClick}
      sx={{
        py: 1.5,
        px: 2,
        borderRadius: 2,
        mx: 1,
        mb: 0.5,
        transition: 'all 0.2s ease',
        '&.Mui-selected': {
          bgcolor: alpha(theme.palette.primary.main, 0.12),
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.18),
          }
        },
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.06),
        }
      }}
    >
      <ListItemAvatar>
        <Badge 
          badgeContent={conv.unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              height: 18,
              minWidth: 18,
            }
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: getAvatarColor(conv.user?.name),
              width: 48,
              height: 48,
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: isSelected ? `0 0 0 2px ${theme.palette.primary.main}` : 'none',
              transition: 'box-shadow 0.2s ease'
            }}
          >
            {conv.user?.name?.charAt(0)?.toUpperCase() || conv.user?.email?.charAt(0)?.toUpperCase() || '?'}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        sx={{ ml: 1 }}
        primary={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography 
              variant="subtitle1" 
              fontWeight={conv.unreadCount > 0 ? 700 : 500}
              sx={{ 
                color: conv.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {conv.user?.name || conv.user?.email || 'Unknown'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: conv.unreadCount > 0 ? 'primary.main' : 'text.disabled',
                fontWeight: conv.unreadCount > 0 ? 600 : 400,
                fontSize: '0.7rem'
              }}
            >
              {conv.lastMessage?.createdAt ? getRelativeTime(conv.lastMessage.createdAt) : ''}
            </Typography>
          </Box>
        }
        secondary={
          <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
            {conv.user?.role === 'intern' && (
              <PersonIcon sx={{ fontSize: 12, color: 'secondary.main' }} />
            )}
            <Typography 
              variant="body2" 
              sx={{
                color: conv.unreadCount > 0 ? 'text.primary' : 'text.disabled',
                fontWeight: conv.unreadCount > 0 ? 500 : 400,
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem'
              }}
            >
              {conv.lastMessage?.message || 'No messages yet'}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );

  // Message Bubble Component
  const MessageBubble = ({ msg, isOwn, showDate, prevMsg }) => {
    const showAvatar = !isOwn && (!prevMsg || isOwnMessage(prevMsg));
    
    return (
      <>
        {showDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2.5, px: 2 }}>
            <Divider sx={{ flex: 1, borderColor: alpha(theme.palette.divider, 0.5) }} />
            <Chip
              label={formatDate(msg.createdAt)}
              size="small"
              sx={{
                mx: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontWeight: 500,
                height: 24
              }}
            />
            <Divider sx={{ flex: 1, borderColor: alpha(theme.palette.divider, 0.5) }} />
          </Box>
        )}
        
        <Fade in timeout={300}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: isOwn ? 'flex-end' : 'flex-start',
              mb: 1,
              px: 2,
              alignItems: 'flex-end',
              gap: 1
            }}
          >
            {!isOwn && (
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.75rem',
                  bgcolor: showAvatar ? getAvatarColor(msg.sender?.name) : 'transparent',
                  visibility: showAvatar ? 'visible' : 'hidden'
                }}
              >
                {msg.sender?.name?.charAt(0)?.toUpperCase() || '?'}
              </Avatar>
            )}
            
            <Box
              sx={{
                maxWidth: { xs: '80%', sm: '70%', md: '60%' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwn ? 'flex-end' : 'flex-start'
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  px: 2,
                  py: 1.25,
                  borderRadius: isOwn 
                    ? '18px 18px 4px 18px' 
                    : '18px 18px 18px 4px',
                  bgcolor: isOwn 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : alpha(theme.palette.grey[100], 0.9),
                  background: isOwn 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : alpha(theme.palette.grey[100], 0.9),
                  color: isOwn ? 'white' : 'text.primary',
                  boxShadow: isOwn
                    ? '0 4px 15px rgba(102, 126, 234, 0.25)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  position: 'relative'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.5,
                    fontSize: '0.9rem'
                  }}
                >
                  {msg.message}
                </Typography>
              </Paper>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  mt: 0.5,
                  px: 0.5
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    color: 'text.disabled'
                  }}
                >
                  {formatTime(msg.createdAt)}
                </Typography>
                {isOwn && (
                  msg.isRead ? (
                    <DoneAllIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                  ) : (
                    <DoneIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  )
                )}
              </Box>
            </Box>
          </Box>
        </Fade>
      </>
    );
  };

  // Loading Skeleton for conversations
  const ConversationSkeleton = () => (
    <Box sx={{ px: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1.5, gap: 2 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="80%" height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  // Empty State Component
  const EmptyState = ({ icon: Icon, title, subtitle }) => (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center'
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3
        }}
      >
        <Icon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.4) }} />
      </Box>
      <Typography variant="h5" color="text.secondary" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 300 }}>
        {subtitle}
      </Typography>
    </Box>
  );

  return (
    <Grid container spacing={gridSpacing}>
      {/* Header */}
      <Grid item xs={12}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: 'none',
            boxShadow: 'none'
          }}
        >
          <CardContent sx={{ py: 2.5 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <MessageIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    Messages
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} • 
                    {conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0)} unread
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={() => fetchConversations(true)}
                  disabled={refreshing}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <RefreshIcon 
                    sx={{ 
                      animation: refreshing ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} 
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Chat Container */}
      <Grid item xs={12}>
        <Card 
          sx={{ 
            height: { xs: 'calc(100vh - 220px)', md: 'calc(100vh - 240px)' },
            display: 'flex',
            overflow: 'hidden',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
          }}
        >
          {/* Conversations Sidebar */}
          <Box
            sx={{
              width: { xs: '100%', md: 360 },
              height: { xs: selectedChat ? '0' : '100%', md: '100%' },
              display: { xs: selectedChat ? 'none' : 'flex', md: 'flex' },
              borderRight: { md: `1px solid ${alpha(theme.palette.divider, 0.1)}` },
              flexDirection: 'column',
              bgcolor: alpha(theme.palette.background.paper, 0.5)
            }}
          >
            {/* Search */}
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.grey[100], 0.5),
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover': {
                      bgcolor: alpha(theme.palette.grey[100], 0.8),
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }
                }}
              />
            </Box>

            {/* Error Alert */}
            {error && (
              <Box sx={{ px: 2, pb: 2 }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
              </Box>
            )}

            {/* Conversations List */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {loading ? (
                <ConversationSkeleton />
              ) : filteredConversations.length === 0 ? (
                <EmptyState
                  icon={InboxIcon}
                  title="No conversations"
                  subtitle="Start a conversation with interns to see them here"
                />
              ) : (
                <List sx={{ p: 0 }}>
                  {filteredConversations.map((conv) => (
                    <ConversationItem
                      key={conv.user._id}
                      conv={conv}
                      isSelected={selectedChat?._id === conv.user._id}
                      onClick={() => setSelectedChat(conv.user)}
                    />
                  ))}
                </List>
              )}
            </Box>
          </Box>

          {/* Chat Area */}
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              minHeight: 0,
              bgcolor: 'white'
            }}
          >
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'white'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <IconButton 
                      sx={{ display: { xs: 'flex', md: 'none' } }}
                      onClick={() => setSelectedChat(null)}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: '#22c55e',
                            border: '2px solid white'
                          }}
                        />
                      }
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: getAvatarColor(selectedChat?.name),
                          width: 44,
                          height: 44
                        }}
                      >
                        {selectedChat?.name?.charAt(0)?.toUpperCase() || '?'}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {selectedChat?.name || selectedChat?.email || 'Unknown'}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {selectedChat?.role === 'intern' ? (
                          <Chip
                            icon={<PersonIcon sx={{ fontSize: '14px !important' }} />}
                            label="Intern"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              color: 'secondary.main',
                              '& .MuiChip-icon': { ml: 0.5 }
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            Online
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {/* Messages Area */}
                <Box 
                  sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    py: 2,
                    bgcolor: alpha(theme.palette.grey[50], 0.5),
                    backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.03)} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    minHeight: 0
                  }}
                >
                  {messagesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress size={40} />
                    </Box>
                  ) : messages.length === 0 ? (
                    <EmptyState
                      icon={ChatBubbleOutlineIcon}
                      title="No messages yet"
                      subtitle="Start the conversation by sending a message"
                    />
                  ) : (
                    <>
                      {messages.map((msg, index) => {
                        const isOwn = isOwnMessage(msg);
                        const showDate = index === 0 || 
                          new Date(messages[index - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
                        
                        return (
                          <MessageBubble
                            key={msg._id}
                            msg={msg}
                            isOwn={isOwn}
                            showDate={showDate}
                            prevMsg={messages[index - 1]}
                          />
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </Box>

                {/* Message Input */}
                <Box 
                  sx={{ 
                    p: 2, 
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    bgcolor: 'white'
                  }}
                >
                  <Box 
                    display="flex" 
                    gap={1.5} 
                    alignItems="flex-end"
                    sx={{
                      bgcolor: alpha(theme.palette.grey[100], 0.5),
                      borderRadius: 3,
                      p: 1,
                      transition: 'all 0.2s ease',
                      '&:focus-within': {
                        bgcolor: 'white',
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                      }
                    }}
                  >
                    <Tooltip title="Emoji">
                      <IconButton size="small" sx={{ color: 'text.disabled' }}>
                        <EmojiEmotionsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Attach file">
                      <IconButton size="small" sx={{ color: 'text.disabled' }}>
                        <AttachFileIcon />
                      </IconButton>
                    </Tooltip>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      multiline
                      maxRows={4}
                      disabled={sending}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'transparent',
                          '& fieldset': {
                            border: 'none'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1,
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sending}
                      sx={{
                        minWidth: 48,
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        },
                        '&.Mui-disabled': {
                          background: theme.palette.grey[300],
                          boxShadow: 'none'
                        }
                      }}
                    >
                      {sending ? (
                        <CircularProgress size={22} sx={{ color: 'white' }} />
                      ) : (
                        <SendIcon sx={{ fontSize: 20 }} />
                      )}
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 3,
                  p: 4,
                  bgcolor: alpha(theme.palette.grey[50], 0.3)
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MarkEmailReadIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: alpha(theme.palette.primary.main, 0.3)
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="text.secondary" fontWeight={600}>
                  Select a conversation
                </Typography>
                <Typography variant="body1" color="text.disabled" textAlign="center" sx={{ maxWidth: 350 }}>
                  Choose a conversation from the list to view messages and start chatting with interns
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EmployerMessages;
