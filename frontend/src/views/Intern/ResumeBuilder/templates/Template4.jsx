import React from 'react';
import { Box, Typography, Avatar, Divider, List, ListItem } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Template4 = ({ data, skills, educations = [], experiences = [], projects = [] }) => {
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
        bgcolor: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: '0 auto',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'grid',
        gridTemplateColumns: '32% 68%',
        fontFamily: 'Cambria, serif'
      }}
    >
      {/* --- LEFT SIDEBAR --- */}
      <Box
        sx={{
          p: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          bgcolor: '#ffffff'
        }}
      >
        {/* Header & Photo */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#6b85a3',
              lineHeight: 1.1,
              mb: 0.5
            }}
          >
            {data.fullName || 'Your Name'}
          </Typography>
          <Typography
            sx={{
              fontSize: '15px',
              color: '#999',
              letterSpacing: '0.05em',
              mb: 2,
              textTransform: 'uppercase'
            }}
          >
            Professional
          </Typography>
          <Avatar
            sx={{
              width: 180,
              height: 180,
              bgcolor: '#e0e0e0',
              fontSize: '64px',
              fontWeight: 700,
              margin: '0 auto',
              mb: 2,
              border: '3px solid #f5f5f5'
            }}
            src={data.profileImage}
          >
            {getInitials(data.fullName)}
          </Avatar>
        </Box>

        {/* Contact */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#555',
              mb: 1.5,
              textTransform: 'uppercase',
              borderBottom: '1px solid #ccc',
              pb: 0.8
            }}
          >
            Contact
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: '16px', color: '#637d9b' }} />
                <Typography variant="caption" sx={{ fontSize: '11px', color: '#666', wordBreak: 'break-word' }}>
                  {data.phone}
                </Typography>
              </Box>
            )}
            {data.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: '16px', color: '#637d9b' }} />
                <Typography variant="caption" sx={{ fontSize: '11px', color: '#666', wordBreak: 'break-word' }}>
                  {data.email}
                </Typography>
              </Box>
            )}
            {data.location && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: '16px', color: '#637d9b', mt: 0.3 }} />
                <Typography variant="caption" sx={{ fontSize: '11px', color: '#666', wordBreak: 'break-word' }}>
                  {data.location}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Profile Summary */}
        {data.summary && (
          <Box>
            <Typography variant="h6"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#555',
                mb: 1.5,
                textTransform: 'uppercase',
                borderBottom: '1px solid #ccc',
                pb: 0.8
              }}
            >
              Profile
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.6, color: '#666', textAlign: 'justify' }}>
              {data.summary}
            </Typography>
          </Box>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#555',
                mb: 1.5,
                textTransform: 'uppercase',
                borderBottom: '1px solid #ccc',
                pb: 0.8
              }}
            >
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {skills.map((skill, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box
                    sx={{
                      width: '6px',
                      height: '6px',
                      bgcolor: '#637d9b',
                      borderRadius: '50%',
                      flexShrink: 0
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '11px', color: '#666' }}>
                    {skill}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* --- RIGHT CONTENT --- */}
      <Box
        sx={{
          p: '30px 25px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          overflow: 'auto'
        }}
      >
        {/* Education */}
        {educations && educations.length > 0 && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#555',
                mb: 1.5,
                textTransform: 'uppercase',
                borderBottom: '1px solid #ccc',
                pb: 0.8
              }}
            >
              Education
            </Typography>
            <Box sx={{ position: 'relative', pl: 2.5, borderLeft: '2px solid #8fa0b5' }}>
              {educations.map((edu, idx) => (
                <Box key={idx} sx={{ mb: 0.5, position: 'relative' }}>
                  {/* Timeline Dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '-12.5px',
                      top: '6px',
                      width: '12px',
                      height: '12px',
                      bgcolor: '#7da0c4',
                      borderRadius: '50%',
                      border: '3px solid white'
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', color: '#333' }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '10px', color: '#999' }}>
                      {edu.graduationYear}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontSize: '11px', color: '#637d9b', fontStyle: 'italic' }}>
                    {edu.university}
                  </Typography>
                  {edu.cgpa && (
                    <Typography variant="caption" sx={{ fontSize: '10px', color: '#999', display: 'block' }}>
                      {edu.cgpa}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#555',
                mb: 1.5,
                textTransform: 'uppercase',
                borderBottom: '1px solid #ccc',
                pb: 0.8
              }}
            >
              Experience
            </Typography>
            <Box sx={{ position: 'relative', pl: 2.5, borderLeft: '2px solid #8fa0b5' }}>
              {experiences.map((exp, idx) => (
                <Box key={idx} sx={{ mb: 1, position: 'relative' }}>
                  {/* Timeline Dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '-12.5px',
                      top: '6px',
                      width: '12px',
                      height: '12px',
                      bgcolor: '#7da0c4',
                      borderRadius: '50%',
                      border: '3px solid white'
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', color: '#333' }}>
                      {exp.jobTitle}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '10px', color: '#999' }}>
                      {exp.duration}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontSize: '11px', color: '#637d9b', fontStyle: 'italic', display: 'block', mb: 0.5 }}>
                    {exp.company}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.5, color: '#555' }}>
                    {exp.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#555',
                mb: 1.5,
                textTransform: 'uppercase',
                borderBottom: '1px solid #ccc',
                pb: 0.8
              }}
            >
              Projects
            </Typography>
            <Box sx={{ borderLeft: '4px solid #7da0c4', pl: 2 }}>
              {projects.map((proj, idx) => (
                <Box key={idx} sx={{ mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px', color: '#333', mb: 0.3 }}>
                    {proj.projectName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.5, mb: 0.3, color: '#555' }}>
                    {proj.projectDescription}
                  </Typography>
                  {proj.projectTech && (
                    <Typography variant="caption" sx={{ fontSize: '10px', color: '#999' }}>
                      <strong>Technologies:</strong> {proj.projectTech}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Template4;
