import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const Template2 = ({ data, skills, educations = [], experiences = [], projects = [] }) => {
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
        bgcolor: '#f8f9fa',
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        p: '0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Times New Roman", Times, serif'
      }}
    >
      {/* HEADER - Profile Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1.5, pb: 1.5, borderBottom: '3px solid #2c5aa0', bgcolor: '#fff', p: 2 }}>
        {/* Profile Photo */}
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: '#2c5aa0',
            fontSize: '32px',
            fontWeight: 700,
            flexShrink: 0,
            border: '3px solid #2c5aa0',
            boxShadow: '0 4px 12px rgba(44, 90, 160, 0.3)'
          }}
          src={data.profileImage}
        >
          {getInitials(data.fullName)}
        </Avatar>

        {/* Contact Info */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#2c5aa0',
              fontSize: '32px', // Increased from 26px
              mb: 0.5,
              lineHeight: 1.1,
              letterSpacing: '0.5px'
            }}
          >
            {data.fullName || 'Your Name'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
            {data.email && (
              <Typography variant="caption" sx={{ color: '#555', fontSize: '11px' }}> {/* Increased from 9.5px */}
                <strong>Email:</strong> {data.email}
              </Typography>
            )}
            {data.phone && (
              <Typography variant="caption" sx={{ color: '#555', fontSize: '11px' }}>
                <strong>Phone:</strong> {data.phone}
              </Typography>
            )}
            {data.location && (
              <Typography variant="caption" sx={{ color: '#555', fontSize: '11px' }}>
                <strong>Location:</strong> {data.location}
              </Typography>
            )}
            {data.portfolio && (
              <Typography variant="caption" sx={{ color: '#555', fontSize: '11px' }}>
                <strong>Portfolio:</strong> {data.portfolio}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* SUMMARY */}
      {data.summary && (
        <Box sx={{ mb: 1, px: 2, py: 0.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '14px', // Increased from 10.5px
              color: '#fff',
              textTransform: 'uppercase',
              bgcolor: '#2c5aa0',
              px: 1,
              py: 0.5,
              mb: 0.8,
              letterSpacing: '0.8px',
              borderRadius: '2px'
            }}
          >
            Professional Summary
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.6, color: '#444', textAlign: 'justify', fontStyle: 'italic' }}> {/* Increased from 9px */}
            {data.summary}
          </Typography>
        </Box>
      )}

      {/* WORK EXPERIENCE */}
      {experiences && experiences.length > 0 && (
        <Box sx={{ mb: 1, px: 2, py: 0.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '14px', // Increased
              color: '#fff',
              textTransform: 'uppercase',
              bgcolor: '#2c5aa0',
              px: 1,
              py: 0.5,
              mb: 0.8,
              letterSpacing: '0.8px',
              borderRadius: '2px'
            }}
          >
            Work Experience
          </Typography>
          {experiences.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 1, pb: 0.8, borderBottom: idx < experiences.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3, alignItems: 'flex-end' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', color: '#2c5aa0', mb: 0.1 }}> {/* Increased from 9.5px */}
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: '#333' }}> {/* Increased */}
                    {exp.company}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: '#2c5aa0', whiteSpace: 'nowrap', ml: 1 }}>
                  {exp.duration}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.5, color: '#444', mt: 0.3 }}>
                {exp.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* EDUCATION */}
      {educations && educations.length > 0 && (
        <Box sx={{ mb: 1, px: 2, py: 0.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              textTransform: 'uppercase',
              bgcolor: '#2c5aa0',
              px: 1,
              py: 0.5,
              mb: 0.8,
              letterSpacing: '0.8px',
              borderRadius: '2px'
            }}
          >
            Education
          </Typography>
          {educations.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 0.8, pb: 0.5, borderBottom: idx < educations.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', color: '#2c5aa0' }}>
                  {edu.degree}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: '#2c5aa0' }}>
                  {edu.graduationYear}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontSize: '11px', color: '#333', display: 'block', fontWeight: 500 }}>
                {edu.university}
              </Typography>
              {edu.cgpa && (
                <Typography variant="caption" sx={{ fontSize: '11px', color: '#666', display: 'block', mt: 0.2 }}>
                  GPA: {edu.cgpa}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <Box sx={{ mb: 1, px: 2, py: 0.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              textTransform: 'uppercase',
              bgcolor: '#2c5aa0',
              px: 1,
              py: 0.5,
              mb: 0.8,
              letterSpacing: '0.8px',
              borderRadius: '2px'
            }}
          >
            Projects
          </Typography>
          {projects.map((proj, idx) => (
            <Box key={idx} sx={{ mb: 0.8, pb: 0.5, borderBottom: idx < projects.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', color: '#2c5aa0', mb: 0.2 }}>
                {proj.projectName}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.5, mb: 0.2, color: '#444' }}>
                {proj.projectDescription}
              </Typography>
              {proj.projectTech && (
                <Typography variant="caption" sx={{ fontSize: '10.5px', color: '#2c5aa0', fontWeight: 600 }}>
                  <strong>Tech:</strong> {proj.projectTech}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <Box sx={{ mb: 1, px: 2, py: 0.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              textTransform: 'uppercase',
              bgcolor: '#2c5aa0',
              px: 1,
              py: 0.5,
              mb: 0.8,
              letterSpacing: '0.8px',
              borderRadius: '2px'
            }}
          >
            Technical Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {skills.map((skill, idx) => (
              <Typography key={idx} variant="caption" sx={{ fontSize: '11px', color: '#333', bgcolor: '#e8f1f8', px: 1, py: 0.4, borderRadius: '4px', fontWeight: 500 }}>
                {skill}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Template2;