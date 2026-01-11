import React from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Template3 = ({ data, skills, educations = [], experiences = [], projects = [] }) => {
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <Box
      sx={{
        width: '210mm',
        height: '297mm',
        bgcolor: '#e3e3e3',
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: '0 auto',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        p: '20px'
      }}
    >
      {/* LEFT COLUMN */}
      <Box sx={{ pr: 2.5, display: 'flex', flexDirection: 'column' }}>
        {/* NAME HEADER */}
        <Box sx={{ mb: 2, textAlign: 'left' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              fontSize: '34px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              mb: 0.5,
              color: '#1a1a1a'
            }}
          >
            {data.fullName?.split(' ')[0] || 'Your'}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: '38px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              color: '#1a1a1a'
            }}
          >
            {data.fullName?.split(' ').slice(1).join(' ') || 'Name'}
          </Typography>
        </Box>

        {/* JOB TITLE & SUMMARY */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              mb: 1,
              color: '#1a1a1a'
            }}
          >
            Professional
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '10px', lineHeight: 1.6, color: '#333' }}>
            {data.summary}
          </Typography>
        </Box>

        {/* EXPERIENCE SECTION */}
        {experiences && experiences.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                borderBottom: '1px solid #1a1a1a',
                pb: 0.5,
                mb: 0.8
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#1a1a1a'
                }}
              >
                Experience
              </Typography>
              <Typography sx={{ fontSize: '18px', color: '#ccc', fontWeight: 300, lineHeight: 0.8 }}>
                +
              </Typography>
            </Box>
            {experiences.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '10px', color: '#1a1a1a' }}>
                      {exp.jobTitle}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '9px', color: '#666' }}>
                      {exp.company}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontSize: '9px', color: '#999', fontWeight: 500 }}>
                    {exp.duration}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '9px', lineHeight: 1.5, color: '#333' }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* PROJECTS SECTION */}
        {projects && projects.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                borderBottom: '1px solid #1a1a1a',
                pb: 0.5,
                mb: 0.8
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#1a1a1a'
                }}
              >
                Projects
              </Typography>
              <Typography sx={{ fontSize: '18px', color: '#ccc', fontWeight: 300, lineHeight: 0.8 }}>
                +
              </Typography>
            </Box>
            {projects.map((proj, idx) => (
              <Box key={idx} sx={{ mb: 0.8 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '10px', color: '#1a1a1a', mb: 0.2 }}>
                  {proj.projectName}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '9px', lineHeight: 1.5, mb: 0.2, color: '#333' }}>
                  {proj.projectDescription}
                </Typography>
                {proj.projectTech && (
                  <Typography variant="caption" sx={{ fontSize: '9px', color: '#666' }}>
                    <strong>Tech:</strong> {proj.projectTech}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* EDUCATION SECTION */}
        {educations && educations.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                borderBottom: '1px solid #1a1a1a',
                pb: 0.5,
                mb: 0.8
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#1a1a1a'
                }}
              >
                Education
              </Typography>
              <Typography sx={{ fontSize: '18px', color: '#ccc', fontWeight: 300, lineHeight: 0.8 }}>
                +
              </Typography>
            </Box>
            {educations.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 0.8 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '10px', color: '#1a1a1a' }}>
                  {edu.degree}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '9px', color: '#666', display: 'block' }}>
                  {edu.university}
                </Typography>
                {edu.graduationYear && (
                  <Typography variant="caption" sx={{ fontSize: '9px', color: '#999', display: 'block' }}>
                    {edu.graduationYear}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* RIGHT COLUMN */}
      <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
        {/* CONTACT INFO */}
        <Box sx={{ mb: 2.5, p: 1.5, bgcolor: 'rgba(200,200,200,0.4)', borderRadius: '4px' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '9px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              mb: 1,
              color: '#1a1a1a'
            }}
          >
            Contact
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, fontSize: '8px' }}>
            {data.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <PhoneIcon sx={{ fontSize: '12px', color: '#1a1a1a' }} />
                <Typography variant="caption" sx={{ color: '#333', fontSize: '8px', wordBreak: 'break-word' }}>
                  {data.phone}
                </Typography>
              </Box>
            )}
            {data.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <EmailIcon sx={{ fontSize: '12px', color: '#1a1a1a' }} />
                <Typography variant="caption" sx={{ color: '#333', fontSize: '8px', wordBreak: 'break-word' }}>
                  {data.email}
                </Typography>
              </Box>
            )}
            {data.location && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
                <LocationOnIcon sx={{ fontSize: '12px', color: '#1a1a1a', mt: 0.2 }} />
                <Typography variant="caption" sx={{ color: '#333', fontSize: '8px', wordBreak: 'break-word' }}>
                  {data.location}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* PHOTO */}
        <Avatar
          sx={{
            width: '100%',
            height: 'auto',
            aspectRatio: '1',
            bgcolor: '#ccc',
            fontSize: '40px',
            fontWeight: 700,
            mb: 2.5,
            border: '2px solid #999',
            filter: 'grayscale(100%)'
          }}
          src={data.profileImage}
        >
          {getInitials(data.fullName)}
        </Avatar>

        {/* SKILLS */}
        {skills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '9px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #1a1a1a',
                pb: 0.5,
                mb: 0.8,
                color: '#1a1a1a'
              }}
            >
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
              {skills.map((skill, idx) => (
                <Typography key={idx} variant="caption" sx={{ fontSize: '9px', color: '#333' }}>
                  • {skill}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {/* PORTFOLIO */}
        {data.portfolio && (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '9px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #1a1a1a',
                pb: 0.5,
                mb: 0.5,
                color: '#1a1a1a'
              }}
            >
              Portfolio
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '9px', color: '#0066cc', fontWeight: 500, wordBreak: 'break-word' }}>
              {data.portfolio}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Template3;
