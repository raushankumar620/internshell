import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Template5 = ({ data, skills, educations = [], experiences = [], projects = [] }) => {
  // Helper function to get initials
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Section Title Component
  const SectionTitle = ({ title }) => (
    <Typography
      variant="h6"
      sx={{
        fontSize: '13px',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: '#fff',
        bgcolor: '#2c3e50',
        p: '8px 12px',
        mb: 1.5,
        mt: 2,
        fontFamily: 'sans-serif',
        borderRadius: '2px'
      }}
    >
      {title}
    </Typography>
  );

  return (
    <Box
      sx={{
        width: '210mm',
        height: '297mm',
        p: '40px',
        bgcolor: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        margin: '0 auto',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        lineHeight: 1.5
      }}
    >
      {/* --- HEADER WITH BACKGROUND --- */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3 }}>
          {/* Left - Name and Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '28px',
                fontWeight: 900,
                mb: 0.3,
                color: '#2c3e50',
                fontFamily: 'sans-serif'
              }}
            >
              {data?.fullName?.toUpperCase() || 'YOUR NAME'}
            </Typography>
            
            {data?.title && (
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  mb: 0.8,
                  color: '#3498db',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {data.title}
              </Typography>
            )}

            {/* Contact Info with Icons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
              {data?.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <LocationOnIcon sx={{ fontSize: '14px', color: '#3498db' }} />
                  <Typography sx={{ fontSize: '11px', color: '#555' }}>
                    {data.location}
                  </Typography>
                </Box>
              )}
              {data?.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <EmailIcon sx={{ fontSize: '14px', color: '#3498db' }} />
                  <Typography sx={{ fontSize: '11px', color: '#555' }}>
                    {data.email}
                  </Typography>
                </Box>
              )}
              {data?.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <PhoneIcon sx={{ fontSize: '14px', color: '#3498db' }} />
                  <Typography sx={{ fontSize: '11px', color: '#555' }}>
                    {data.phone}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {data?.linkedIn && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    bgcolor: '#3498db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <LinkedInIcon sx={{ fontSize: '16px', color: '#fff' }} />
                </Box>
              )}
              {data?.github && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    bgcolor: '#2c3e50',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <GitHubIcon sx={{ fontSize: '16px', color: '#fff' }} />
                </Box>
              )}
              {data?.portfolio && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    bgcolor: '#27ae60',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <LanguageIcon sx={{ fontSize: '16px', color: '#fff' }} />
                </Box>
              )}
            </Box>
          </Box>

          {/* Right - Profile Photo */}
          {data?.profileImage ? (
            <Box
              sx={{
                width: '140px',
                height: '140px',
                flexShrink: 0,
                borderRadius: '8px',
                border: '3px solid #3498db',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img src={data.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ) : (
            <Avatar
              sx={{
                width: 140,
                height: 140,
                flexShrink: 0,
                border: '3px solid #3498db',
                fontSize: '48px',
                fontWeight: 700,
                bgcolor: '#ecf0f1'
              }}
            >
              {getInitials(data?.fullName)}
            </Avatar>
          )}
        </Box>

        {/* Divider */}
        <Box sx={{ height: '2px', bgcolor: '#3498db', my: 2 }} />
      </Box>

      {/* --- PROFILE SUMMARY --- */}
      {data?.summary && (
        <Box sx={{ mb: 2 }}>
          <SectionTitle title="Professional Summary" />
          <Typography sx={{ fontSize: '11px', lineHeight: 1.8, color: '#444', textAlign: 'justify', pl: 1 }}>
            {data.summary}
          </Typography>
        </Box>
      )}

      {/* --- TECHNICAL SKILLS --- */}
      {skills && skills.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <SectionTitle title="Technical Skills" />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.8,
              pl: 1
            }}
          >
            {skills.map((skill, index) => (
              <Box
                key={index}
                sx={{
                  px: 1,
                  py: 0.4,
                  bgcolor: '#ecf0f1',
                  border: '1px solid #bdc3c7',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#2c3e50'
                }}
              >
                {skill}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* --- WORK EXPERIENCE --- */}
      {experiences && experiences.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <SectionTitle title="Work Experience" />
          <Box sx={{ pl: 1 }}>
            {experiences.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 1.2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#2c3e50' }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography sx={{ fontSize: '10px', color: '#7f8c8d', fontStyle: 'italic' }}>
                    {exp.duration}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '10px', color: '#3498db', fontWeight: 600, mb: 0.3 }}>
                  {exp.company}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#555', lineHeight: 1.6 }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* --- EDUCATION --- */}
      {educations && educations.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <SectionTitle title="Education" />
          <Box sx={{ pl: 1 }}>
            {educations.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#2c3e50' }}>
                    {edu.degree}
                  </Typography>
                  <Typography sx={{ fontSize: '10px', color: '#7f8c8d' }}>
                    ({edu.graduationYear})
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '10px', color: '#3498db', fontWeight: 600 }}>
                  {edu.university}
                </Typography>
                {edu.cgpa && (
                  <Typography sx={{ fontSize: '9px', color: '#7f8c8d', mt: 0.2 }}>
                    CGPA: {edu.cgpa}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* --- PROJECTS --- */}
      {projects && projects.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <SectionTitle title="Projects" />
          <Box sx={{ pl: 1 }}>
            {projects.map((proj, idx) => (
              <Box key={idx} sx={{ mb: 1.2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '11px', color: '#2c3e50', mb: 0.2 }}>
                  {proj.projectName}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#555', lineHeight: 1.6, mb: 0.3 }}>
                  {proj.projectDescription}
                </Typography>
                {proj.projectTech && (
                  <Typography sx={{ fontSize: '9px', color: '#3498db', fontWeight: 600 }}>
                    <strong>Tech:</strong> {proj.projectTech}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Template5;
