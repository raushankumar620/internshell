import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight:'100vh',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      bgcolor:'#020617',
      position:'relative',
      overflow:'hidden'
    }}>

      {/* SVG BLUR BLOBS */}
      <svg style={{position:'absolute',width:800,height:800,top:-200,left:-200,filter:'blur(120px)',opacity:.6}}>
        <circle cx="400" cy="400" r="400" fill="#2563EB"/>
      </svg>
      <svg style={{position:'absolute',width:700,height:700,bottom:-200,right:-200,filter:'blur(120px)',opacity:.6}}>
        <circle cx="350" cy="350" r="350" fill="#EC4899"/>
      </svg>

      <Container maxWidth="sm">
        <motion.div initial={{scale:.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:1}}>
          <Box sx={{
            textAlign:'center',
            p:6,
            borderRadius:5,
            backdropFilter:'blur(25px)',
            bgcolor:'rgba(255,255,255,0.08)',
            border:'1px solid rgba(255,255,255,0.2)',
            boxShadow:'0 25px 50px rgba(0,0,0,0.4), 0 0 100px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}>
            {/* 404 Image */}
            <motion.img
              src="/404.png"
              alt="404 Error"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{
                width: '100%',
                maxWidth: '450px',
                marginBottom: '24px',
                display: 'block',
                margin: '0 auto 24px auto'
              }}
            />

            <Typography variant="h4" sx={{color:'#fff',mb:1}}>Lost in Space 🚀</Typography>
            <Typography sx={{color:'#94A3B8',mb:4}}>
              The page drifted into another galaxy.
            </Typography>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button onClick={()=>navigate('/')} sx={{
                bgcolor:'#3B82F6',
                px:4,py:1.4,
                borderRadius:99,
                color:'#fff',
                fontWeight:600,
                '&:hover':{bgcolor:'#2563EB'}
              }}>Home</Button>
              <Button onClick={()=>navigate(-1)} sx={{
                color:'#fff',
                border:'1px solid rgba(255,255,255,.3)',
                px:4,py:1.4,
                borderRadius:99
              }}>Back</Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFound;