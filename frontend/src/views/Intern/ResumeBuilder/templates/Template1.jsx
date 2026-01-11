import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Template1 = ({ data, skills, educations = [], experiences = [], projects = [] }) => {
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box
      sx={{
        width: '210mm',
        height: '297mm',
        display: 'grid',
        gridTemplateColumns: '30% 70%',
        p: 0,
        overflow: 'hidden',
        bgcolor: '#fff',
        boxShadow: '0 2px 20px rgba(0,0,0,0.15)',
        m: 'auto',
        fontSize: '11px',
        fontFamily: '"Times New Roman", Times, serif'
      }}
    >
      {/* LEFT SIDEBAR */}
      <Box
        sx={{
          bgcolor: '#1a3a52',
          color: '#fff',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          borderRight: '3px solid #d4af37'
        }}
      >
        {/* Avatar */}
        {data?.profileImage ? (
          <Box
            sx={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '4px solid #d4af37',
              overflow: 'hidden',
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
          >
            <img src={data.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        ) : (
          <Avatar
            sx={{
              width: 90,
              height: 90,
              mx: 'auto',
              mb: 3,
              bgcolor: '#0f2337',
              fontSize: '32px',
              fontWeight: 700,
              border: '4px solid #d4af37',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
          >
            {getInitials(data?.fullName)}
          </Avatar>
        )}

        {/* Contact Info */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, mb: 1.2, textTransform: 'uppercase', letterSpacing: '1px', color: '#d4af37', borderBottom: '2px solid #d4af37', pb: 0.5 }}>
            Contact
          </Typography>
          {data?.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.7, fontSize: '10px' }}>
              <PhoneIcon sx={{ fontSize: '13px', color: '#d4af37' }} />
              <span>{data.phone}</span>
            </Box>
          )}
          {data?.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.7, fontSize: '10px' }}>
              <EmailIcon sx={{ fontSize: '13px', color: '#d4af37' }} />
              <span style={{ wordBreak: 'break-word' }}>{data.email}</span>
            </Box>
          )}
          {data?.location && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8, mb: 0.7, fontSize: '10px' }}>
              <LocationOnIcon sx={{ fontSize: '13px', mt: 0.3, color: '#d4af37' }} />
              <span>{data.location}</span>
            </Box>
          )}
        </Box>

        {/* Social Links with Icons */}
        {(data?.linkedIn || data?.github || data?.portfolio) && (
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, mb: 1.2, textTransform: 'uppercase', letterSpacing: '1px', color: '#d4af37', borderBottom: '2px solid #d4af37', pb: 0.5 }}>
              Links
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {data?.linkedIn && (
                <a href={data.linkedIn} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <LinkedInIcon sx={{ fontSize: '18px', color: '#d4af37', '&:hover': { opacity: 0.8, transform: 'scale(1.1)' }, transition: 'all 0.3s ease' }} />
                </a>
              )}
              {data?.github && (
                <a href={data.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <GitHubIcon sx={{ fontSize: '18px', color: '#d4af37', '&:hover': { opacity: 0.8, transform: 'scale(1.1)' }, transition: 'all 0.3s ease' }} />
                </a>
              )}
              {data?.portfolio && (
                <a href={data.portfolio} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <LanguageIcon sx={{ fontSize: '18px', color: '#d4af37', '&:hover': { opacity: 0.8, transform: 'scale(1.1)' }, transition: 'all 0.3s ease' }} />
                </a>
              )}
            </Box>
          </Box>
        )}

        {/* Education */}
        {educations && educations.length > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, mb: 1.2, textTransform: 'uppercase', letterSpacing: '1px', color: '#d4af37', borderBottom: '2px solid #d4af37', pb: 0.5 }}>
              Education
            </Typography>
            {educations.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#d4af37' }}>
                  {edu.degree}
                </Typography>
                <Typography sx={{ fontSize: '9px', mb: 0.3, color: '#fff' }}>{edu.university}</Typography>
                {edu.graduationYear && <Typography sx={{ fontSize: '9px', color: '#ddd' }}>{edu.graduationYear}</Typography>}
                {edu.cgpa && <Typography sx={{ fontSize: '9px', color: '#ddd' }}>CGPA: {edu.cgpa}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, mb: 1.2, textTransform: 'uppercase', letterSpacing: '1px', color: '#d4af37', borderBottom: '2px solid #d4af37', pb: 0.5 }}>
              Skills
            </Typography>
            {skills.map((skill, idx) => (
              <Typography key={idx} sx={{ fontSize: '10px', mb: 0.6, color: '#fff' }}>
                • {skill}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      {/* RIGHT CONTENT */}
      <Box sx={{ p: 2.5, overflowY: 'auto' }}>
        {/* Header */}
        <Typography
          sx={{
            fontSize: '26px',
            fontWeight: 700,
            color: '#1a3a52',
            mb: 0.3,
            borderBottom: '3px solid #d4af37',
            pb: 1,
            letterSpacing: '0.5px'
          }}
        >
          {data?.fullName || 'Your Name'}
        </Typography>

        {/* Summary */}
        {data?.summary && (
          <Box sx={{ mb: 1.8 }}>
            <Typography sx={{ fontSize: '10px', lineHeight: 1.6, color: '#333', fontStyle: 'italic' }}>
              {data.summary}
            </Typography>
          </Box>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <Box sx={{ mb: 1.8 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1a3a52', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #d4af37', pb: 0.5 }}>
              Experience
            </Typography>
            {experiences.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 1.2, pl: 0, position: 'relative' }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#1a3a52', mb: 0.2 }}>
                  {exp.jobTitle}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#555', mb: 0.3, fontWeight: 600 }}>
                  {exp.company} • {exp.duration}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#333', lineHeight: 1.5 }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <Box sx={{ mb: 1.8 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1a3a52', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #d4af37', pb: 0.5 }}>
              Projects
            </Typography>
            {projects.map((proj, idx) => (
              <Box key={idx} sx={{ mb: 1.2 }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#1a3a52', mb: 0.2 }}>
                  {proj.projectName}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#333', lineHeight: 1.5, mb: 0.3 }}>
                  {proj.projectDescription}
                </Typography>
                {proj.projectTech && (
                  <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#1a3a52' }}>
                    <strong>Tech:</strong> {proj.projectTech}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Template1;
