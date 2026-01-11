import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Stack,
  Autocomplete,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import { debounce } from 'lodash';

// Comprehensive skills database for instant suggestions
const SKILLS_DATABASE = {
  // Programming Languages
  'R': ['React', 'React Native', 'Redux', 'Ruby', 'Rust', 'R Programming', 'REST API', 'Redis', 'RxJS', 'Razor'],
  'J': ['JavaScript', 'Java', 'jQuery', 'JSON', 'Jest', 'Jenkins', 'Jira', 'JWT', 'JAMStack', 'Jupyter'],
  'P': ['Python', 'PHP', 'PostgreSQL', 'Pandas', 'PyTorch', 'Postman', 'PowerBI', 'Photoshop', 'PWA', 'Prisma'],
  'N': ['Node.js', 'Next.js', 'NestJS', 'NumPy', 'NoSQL', 'Nginx', 'NPM', 'NativeScript', 'Nuxt.js', 'Neo4j'],
  'A': ['Angular', 'AWS', 'Azure', 'Android', 'Apache', 'API', 'Ajax', 'Axios', 'Apollo', 'Android Studio'],
  'V': ['Vue.js', 'Vuex', 'Visual Studio', 'VS Code', 'VirtualBox', 'Vim', 'Vite', 'VB.NET', 'Vuetify'],
  'S': ['SQL', 'Spring Boot', 'Swagger', 'SASS', 'Selenium', 'Svelte', 'Swift', 'Solidity', 'Spark', 'Stripe'],
  'T': ['TypeScript', 'TailwindCSS', 'TensorFlow', 'Three.js', 'Terraform', 'Tableau', 'Testing', 'Trello', 'Tkinter', 'Tailwind'],
  'M': ['MongoDB', 'MySQL', 'Material-UI', 'Machine Learning', 'MUI', 'Microservices', 'Mocha', 'Maven', 'Mongoose', 'Matlab'],
  'D': ['Docker', 'Django', 'D3.js', 'Database', 'DevOps', 'Data Science', 'Dart', 'DynamoDB', 'Debian', 'Deployment'],
  'C': ['CSS', 'C++', 'C#', 'C', 'Cypress', 'Cloud Computing', 'CI/CD', 'CMS', 'Cassandra', 'Chrome Extension'],
  'F': ['Flutter', 'Firebase', 'Flask', 'Figma', 'FastAPI', 'Frontend', 'Full Stack', 'Facebook API', 'Fedora', 'Flux'],
  'G': ['Git', 'GitHub', 'GitLab', 'GraphQL', 'Google Cloud', 'Gatsby', 'Go', 'Gradle', 'Gutenberg', 'GPU Computing'],
  'H': ['HTML', 'HTTP', 'Heroku', 'Hadoop', 'Hooks', 'Headless CMS', 'HubSpot', 'Haskell', 'Hibernate', 'HDFS'],
  'L': ['Laravel', 'Linux', 'Lambda', 'Less', 'Lighthouse', 'Lodash', 'Lua', 'Lerna', 'LDAP', 'Load Balancing'],
  'K': ['Kubernetes', 'Kotlin', 'Kafka', 'Keras', 'Koa.js', 'Kibana', 'Knex.js', 'Kubernetes', 'Kustomize', 'Key-Value Store'],
  'E': ['Express.js', 'Elasticsearch', 'Electron', 'ESLint', 'Ember.js', 'Enzyme', 'EC2', 'EJS', 'Ethereum', 'Excel'],
  'W': ['Webpack', 'WebGL', 'WebRTC', 'WordPress', 'WebAssembly', 'Web3', 'WebSocket', 'Wireshark', 'WooCommerce', 'WebStorm'],
  'I': ['iOS', 'IoT', 'IntelliJ', 'Illustrator', 'IndexedDB', 'Ionic', 'IIS', 'Infrastructure', 'Integration', 'Inkscape'],
  'B': ['Bootstrap', 'Babel', 'Backend', 'Blockchain', 'Blender', 'Bash', 'BigQuery', 'Bitbucket', 'Browserify', 'Bulma'],
  'O': ['OAuth', 'OpenAPI', 'Oracle', 'OOP', 'OpenCV', 'Objective-C', 'Office 365', 'OpenShift', 'OpenGL', 'Optimization'],
  'U': ['Unity', 'Ubuntu', 'UX/UI', 'Unit Testing', 'Unreal Engine', 'Unix', 'User Research', 'UML', 'Usability', 'USB'],
  'Y': ['Yarn', 'Yup', 'YAML', 'YouTube API', 'Yii', 'Yeoman', 'Yargs', 'YugabyteDB', 'Yellowbrick', 'Yandex']
};

// Category mapping for skills
const SKILL_CATEGORIES = {
  'Programming Languages': ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart'],
  'Frontend Frameworks': ['React', 'Angular', 'Vue.js', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'React Native', 'Flutter'],
  'Backend Frameworks': ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'NestJS', 'FastAPI', 'Koa.js'],
  'Databases': ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Firebase', 'DynamoDB', 'Cassandra', 'Neo4j', 'Oracle', 'SQLite'],
  'Cloud Platforms': ['AWS', 'Azure', 'Google Cloud', 'Heroku', 'Netlify', 'DigitalOcean', 'Firebase', 'Supabase'],
  'DevOps & Tools': ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'CI/CD', 'Terraform', 'Ansible', 'Nginx'],
  'Design Tools': ['Figma', 'Adobe Photoshop', 'Illustrator', 'Sketch', 'Adobe XD', 'InVision', 'Canva', 'Blender'],
  'Testing': ['Jest', 'Cypress', 'Selenium', 'Mocha', 'JUnit', 'PyTest', 'Testing Library', 'Postman', 'Swagger'],
  'Mobile Development': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Xamarin', 'Ionic'],
  'Data Science & AI': ['Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'Tableau', 'Power BI']
};

const InstantSkillsInput = ({ 
  skills = [], 
  onSkillsChange, 
  label = "Required Skills",
  placeholder = "Type to search skills (e.g., React, Python, JavaScript)..."
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // All skills for search
  const allSkills = useMemo(() => {
    const skillsSet = new Set();
    
    // Add skills from database
    Object.values(SKILLS_DATABASE).forEach(skillList => {
      skillList.forEach(skill => skillsSet.add(skill));
    });
    
    // Add skills from categories
    Object.values(SKILL_CATEGORIES).forEach(skillList => {
      skillList.forEach(skill => skillsSet.add(skill));
    });
    
    return Array.from(skillsSet).sort();
  }, []);

  // Get instant suggestions based on input
  const getInstantSuggestions = useCallback((input) => {
    if (!input || input.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = input.toLowerCase();
    const firstLetter = input.charAt(0).toUpperCase();
    
    // Get suggestions starting with first letter
    const letterSuggestions = SKILLS_DATABASE[firstLetter] || [];
    
    // Get all matching skills
    const matchingSuggestions = allSkills.filter(skill => 
      skill.toLowerCase().includes(query) && !skills.includes(skill)
    );

    // Combine and prioritize
    const combinedSuggestions = [
      ...letterSuggestions.filter(skill => 
        skill.toLowerCase().includes(query) && !skills.includes(skill)
      ),
      ...matchingSuggestions.filter(skill => 
        !letterSuggestions.includes(skill)
      )
    ];

    // Limit to 12 suggestions for better UX
    const limitedSuggestions = combinedSuggestions.slice(0, 12);
    
    setSuggestions(limitedSuggestions);
    setShowSuggestions(limitedSuggestions.length > 0);
  }, [skills, allSkills]);

  // Debounced suggestion function
  const debouncedGetSuggestions = useCallback(
    debounce(getInstantSuggestions, 100),
    [getInstantSuggestions]
  );

  // Handle input change
  const handleInputChange = (event, value) => {
    setInputValue(value);
    if (value && value.trim()) {
      getInstantSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle skill selection
  const handleSkillSelect = (event, skill) => {
    if (skill && !skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle manual skill addition
  const handleAddSkill = () => {
    const skill = inputValue.trim();
    if (skill && !skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  // Handle key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (suggestions.length > 0) {
        handleSkillSelect(null, suggestions[0]);
      } else {
        handleAddSkill();
      }
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Get category for a skill
  const getSkillCategory = (skill) => {
    for (const [category, skillList] of Object.entries(SKILL_CATEGORIES)) {
      if (skillList.includes(skill)) {
        return category;
      }
    }
    return null;
  };

  // Group suggestions by category
  const groupedSuggestions = useMemo(() => {
    const groups = {};
    suggestions.forEach(skill => {
      const category = getSkillCategory(skill) || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(skill);
    });
    return groups;
  }, [suggestions]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        {label} {skills.length > 0 && `(${skills.length})`}
      </Typography>

      {/* Input Field */}
      <TextField
        fullWidth
        value={inputValue}
        onChange={(e) => handleInputChange(e, e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        sx={{ mb: 2 }}
        autoComplete="off"
        InputProps={{
          sx: {
            '& .MuiOutlinedInput-input': {
              padding: '12px 14px',
            }
          }
        }}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Paper 
          elevation={8}
          sx={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 400,
            overflow: 'auto',
            mt: -1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          {Object.entries(groupedSuggestions).map(([category, skillList]) => (
            <Box key={category}>
              <Typography 
                variant="caption" 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  display: 'block',
                  bgcolor: 'grey.50',
                  fontWeight: 600,
                  color: 'text.secondary'
                }}
              >
                {category}
              </Typography>
              {skillList.map((skill, index) => (
                <ListItemButton
                  key={skill}
                  onClick={() => handleSkillSelect(null, skill)}
                  sx={{
                    py: 0.5,
                    px: 2,
                    '&:hover': {
                      bgcolor: 'primary.lighter'
                    }
                  }}
                >
                  <ListItemText 
                    primary={skill}
                    primaryTypographyProps={{
                      fontSize: '0.875rem'
                    }}
                  />
                </ListItemButton>
              ))}
              {Object.keys(groupedSuggestions).length > 1 && 
                category !== Object.keys(groupedSuggestions)[Object.keys(groupedSuggestions).length - 1] && (
                <Divider />
              )}
            </Box>
          ))}
        </Paper>
      )}

      {/* Selected Skills */}
      {skills.length > 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected Skills:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {skills.map((skill, index) => {
              const category = getSkillCategory(skill);
              const categoryColors = {
                'Programming Languages': 'primary',
                'Frontend Frameworks': 'secondary', 
                'Backend Frameworks': 'success',
                'Databases': 'warning',
                'Cloud Platforms': 'info',
                'DevOps & Tools': 'error',
                'Design Tools': 'secondary',
                'Testing': 'success',
                'Mobile Development': 'info',
                'Data Science & AI': 'warning'
              };
              
              return (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  color={categoryColors[category] || 'default'}
                  size="small"
                  sx={{ 
                    mb: 1,
                    fontWeight: 500 
                  }}
                />
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Quick Add Popular Skills */}
      {skills.length === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            💡 Popular Skills:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
            {['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Git'].map((skill) => (
              <Chip
                key={skill}
                label={skill}
                onClick={() => handleSkillSelect(null, skill)}
                variant="outlined"
                size="small"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  }
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default InstantSkillsInput;