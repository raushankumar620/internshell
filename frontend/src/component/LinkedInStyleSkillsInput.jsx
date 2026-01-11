import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Stack,
  Paper,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  IconButton
} from '@mui/material';
import { debounce } from 'lodash';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';

// Comprehensive tech skills database with popularity and trends
const TECH_SKILLS = {
  // Programming Languages
  'A': [
    { name: 'Angular', category: 'Frontend', popularity: 85, trending: false },
    { name: 'Apache', category: 'Web Server', popularity: 70, trending: false },
    { name: 'AWS', category: 'Cloud', popularity: 95, trending: true },
    { name: 'Azure', category: 'Cloud', popularity: 88, trending: true },
    { name: 'Android', category: 'Mobile', popularity: 82, trending: false },
    { name: 'API Development', category: 'Backend', popularity: 90, trending: false },
    { name: 'Agile', category: 'Methodology', popularity: 85, trending: false },
    { name: 'Adobe Photoshop', category: 'Design', popularity: 75, trending: false },
    { name: 'Adobe XD', category: 'Design', popularity: 72, trending: false },
    { name: 'Android Studio', category: 'IDE', popularity: 80, trending: false },
    { name: 'Assembly', category: 'Programming', popularity: 45, trending: false },
    { name: 'Ajax', category: 'Web Technology', popularity: 70, trending: false },
    { name: 'Axios', category: 'HTTP Client', popularity: 85, trending: false },
    { name: 'Amazon S3', category: 'Cloud Storage', popularity: 88, trending: false },
    { name: 'Apache Kafka', category: 'Messaging', popularity: 75, trending: true },
    { name: 'Artificial Intelligence', category: 'AI/ML', popularity: 92, trending: true },
    { name: 'After Effects', category: 'Video Editing', popularity: 68, trending: false }
  ],
  'B': [
    { name: 'Bootstrap', category: 'CSS Framework', popularity: 75, trending: false },
    { name: 'Backend Development', category: 'Backend', popularity: 90, trending: false },
    { name: 'Blockchain', category: 'Web3', popularity: 70, trending: true },
    { name: 'Bash', category: 'Shell', popularity: 65, trending: false },
    { name: 'BigQuery', category: 'Database', popularity: 68, trending: true },
    { name: 'Blender', category: '3D Graphics', popularity: 65, trending: false },
    { name: 'Business Analysis', category: 'Business', popularity: 78, trending: false },
    { name: 'Binary Search', category: 'Algorithm', popularity: 70, trending: false },
    { name: 'Bulma', category: 'CSS Framework', popularity: 55, trending: false },
    { name: 'Babel', category: 'JavaScript Tool', popularity: 75, trending: false },
    { name: 'Boto3', category: 'AWS SDK', popularity: 70, trending: false },
    { name: 'Beautiful Soup', category: 'Python Library', popularity: 68, trending: false },
    { name: 'Bitbucket', category: 'Version Control', popularity: 65, trending: false },
    { name: 'Bitcoin', category: 'Cryptocurrency', popularity: 60, trending: true },
    { name: 'Broadcast Receiver', category: 'Android', popularity: 45, trending: false }
  ],
  'C': [
    { name: 'C++', category: 'Programming', popularity: 80, trending: false },
    { name: 'C#', category: 'Programming', popularity: 78, trending: false },
    { name: 'CSS', category: 'Styling', popularity: 95, trending: false },
    { name: 'C', category: 'Programming', popularity: 75, trending: false },
    { name: 'Cloud Computing', category: 'Cloud', popularity: 90, trending: true },
    { name: 'Cypress', category: 'Testing', popularity: 75, trending: true },
    { name: 'CI/CD', category: 'DevOps', popularity: 85, trending: true },
    { name: 'Chrome Extension', category: 'Browser', popularity: 60, trending: false },
    { name: 'Cassandra', category: 'Database', popularity: 58, trending: false },
    { name: 'CoffeeScript', category: 'Programming', popularity: 35, trending: false },
    { name: 'Cordova', category: 'Mobile', popularity: 50, trending: false },
    { name: 'Crystal', category: 'Programming', popularity: 25, trending: false },
    { name: 'Cucumber', category: 'Testing', popularity: 55, trending: false },
    { name: 'CUDA', category: 'GPU Computing', popularity: 52, trending: false },
    { name: 'Clojure', category: 'Programming', popularity: 35, trending: false },
    { name: 'CMake', category: 'Build System', popularity: 58, trending: false },
    { name: 'Cloudflare', category: 'CDN', popularity: 70, trending: false },
    { name: 'Chart.js', category: 'Visualization', popularity: 75, trending: false }
  ],
  'D': [
    { name: 'Docker', category: 'DevOps', popularity: 90, trending: true },
    { name: 'Django', category: 'Backend', popularity: 82, trending: false },
    { name: 'Database Design', category: 'Database', popularity: 85, trending: false },
    { name: 'Data Science', category: 'Data', popularity: 88, trending: true },
    { name: 'DevOps', category: 'Operations', popularity: 85, trending: true },
    { name: 'D3.js', category: 'Visualization', popularity: 70, trending: false },
    { name: 'Dart', category: 'Programming', popularity: 68, trending: true },
    { name: 'Data Analysis', category: 'Data', popularity: 85, trending: true },
    { name: 'Deep Learning', category: 'AI/ML', popularity: 88, trending: true },
    { name: 'Digital Marketing', category: 'Marketing', popularity: 78, trending: false },
    { name: 'DynamoDB', category: 'Database', popularity: 72, trending: false },
    { name: 'Drupal', category: 'CMS', popularity: 55, trending: false },
    { name: 'Deno', category: 'Runtime', popularity: 48, trending: true },
    { name: 'Debian', category: 'OS', popularity: 65, trending: false },
    { name: 'Data Structures', category: 'Computer Science', popularity: 92, trending: false },
    { name: 'Distributed Systems', category: 'Architecture', popularity: 75, trending: false }
  ],
  'E': [
    { name: 'Express.js', category: 'Backend', popularity: 85, trending: false },
    { name: 'Elasticsearch', category: 'Search', popularity: 75, trending: false },
    { name: 'Electron', category: 'Desktop', popularity: 65, trending: false },
    { name: 'ESLint', category: 'Tools', popularity: 80, trending: false },
    { name: 'Ember.js', category: 'Frontend', popularity: 35, trending: false },
    { name: 'Ethereum', category: 'Blockchain', popularity: 68, trending: true },
    { name: 'Expo', category: 'React Native', popularity: 75, trending: false },
    { name: 'Eclipse', category: 'IDE', popularity: 58, trending: false },
    { name: 'Elixir', category: 'Programming', popularity: 42, trending: false },
    { name: 'Entity Framework', category: '.NET', popularity: 68, trending: false },
    { name: 'Enzyme', category: 'Testing', popularity: 55, trending: false },
    { name: 'Excel', category: 'Data Tool', popularity: 85, trending: false }
  ],
  'F': [
    { name: 'Flutter', category: 'Mobile', popularity: 80, trending: true },
    { name: 'Firebase', category: 'Backend', popularity: 85, trending: false },
    { name: 'Flask', category: 'Backend', popularity: 75, trending: false },
    { name: 'Figma', category: 'Design', popularity: 90, trending: true },
    { name: 'FastAPI', category: 'Backend', popularity: 78, trending: true },
    { name: 'Frontend Development', category: 'Frontend', popularity: 95, trending: false },
    { name: 'F#', category: 'Programming', popularity: 28, trending: false },
    { name: 'Functional Programming', category: 'Programming Paradigm', popularity: 65, trending: false },
    { name: 'Final Cut Pro', category: 'Video Editing', popularity: 58, trending: false },
    { name: 'Fastify', category: 'Backend', popularity: 52, trending: true },
    { name: 'Facebook API', category: 'Social Media API', popularity: 68, trending: false },
    { name: 'FTP', category: 'Protocol', popularity: 55, trending: false }
  ],
  'G': [
    { name: 'Git', category: 'Version Control', popularity: 98, trending: false },
    { name: 'GitHub', category: 'Platform', popularity: 95, trending: false },
    { name: 'GraphQL', category: 'API', popularity: 82, trending: true },
    { name: 'Google Cloud', category: 'Cloud', popularity: 85, trending: true },
    { name: 'Gatsby', category: 'Frontend', popularity: 70, trending: false },
    { name: 'Go', category: 'Programming', popularity: 75, trending: true },
    { name: 'Golang', category: 'Programming', popularity: 75, trending: true },
    { name: 'Gradle', category: 'Build Tool', popularity: 68, trending: false },
    { name: 'GitLab', category: 'Platform', popularity: 75, trending: false },
    { name: 'GIMP', category: 'Image Editor', popularity: 58, trending: false },
    { name: 'GNU/Linux', category: 'OS', popularity: 85, trending: false },
    { name: 'Google Analytics', category: 'Analytics', popularity: 82, trending: false },
    { name: 'Gulp', category: 'Build Tool', popularity: 45, trending: false },
    { name: 'Groovy', category: 'Programming', popularity: 35, trending: false }
  ],
  'H': [
    { name: 'HTML', category: 'Markup', popularity: 98, trending: false },
    { name: 'HTTP', category: 'Protocol', popularity: 90, trending: false },
    { name: 'Heroku', category: 'Platform', popularity: 70, trending: false },
    { name: 'Hooks', category: 'React', popularity: 88, trending: false },
    { name: 'Haskell', category: 'Programming', popularity: 25, trending: false },
    { name: 'HBase', category: 'Database', popularity: 35, trending: false },
    { name: 'Hadoop', category: 'Big Data', popularity: 55, trending: false },
    { name: 'HTML5', category: 'Web Technology', popularity: 95, trending: false },
    { name: 'HTTPS', category: 'Security', popularity: 92, trending: false },
    { name: 'Hibernate', category: 'ORM', popularity: 65, trending: false }
  ],
  'I': [
    { name: 'iOS', category: 'Mobile', popularity: 85, trending: false },
    { name: 'Integration Testing', category: 'Testing', popularity: 75, trending: false },
    { name: 'Illustrator', category: 'Design', popularity: 70, trending: false },
    { name: 'IntelliJ IDEA', category: 'IDE', popularity: 78, trending: false },
    { name: 'InDesign', category: 'Design', popularity: 58, trending: false },
    { name: 'Ionic', category: 'Mobile', popularity: 62, trending: false },
    { name: 'Internet of Things', category: 'IoT', popularity: 68, trending: true },
    { name: 'IPython', category: 'Python Tool', popularity: 55, trending: false },
    { name: 'IIS', category: 'Web Server', popularity: 45, trending: false }
  ],
  'J': [
    { name: 'JavaScript', category: 'Programming', popularity: 98, trending: false },
    { name: 'Java', category: 'Programming', popularity: 85, trending: false },
    { name: 'jQuery', category: 'Library', popularity: 65, trending: false },
    { name: 'JSON', category: 'Data Format', popularity: 95, trending: false },
    { name: 'Jest', category: 'Testing', popularity: 82, trending: false },
    { name: 'Jenkins', category: 'CI/CD', popularity: 75, trending: false },
    { name: 'JWT', category: 'Security', popularity: 80, trending: false },
    { name: 'Julia', category: 'Programming', popularity: 42, trending: false },
    { name: 'Jira', category: 'Project Management', popularity: 85, trending: false },
    { name: 'Jasmine', category: 'Testing', popularity: 55, trending: false },
    { name: 'JAMstack', category: 'Architecture', popularity: 68, trending: false },
    { name: 'JUnit', category: 'Testing', popularity: 75, trending: false }
  ],
  'K': [
    { name: 'Kubernetes', category: 'DevOps', popularity: 85, trending: true },
    { name: 'Kotlin', category: 'Programming', popularity: 78, trending: true },
    { name: 'Kafka', category: 'Messaging', popularity: 70, trending: false },
    { name: 'Keras', category: 'ML Framework', popularity: 72, trending: false },
    { name: 'Kibana', category: 'Analytics', popularity: 58, trending: false },
    { name: 'Koa.js', category: 'Backend', popularity: 48, trending: false }
  ],
  'L': [
    { name: 'Laravel', category: 'Backend', popularity: 80, trending: false },
    { name: 'Linux', category: 'OS', popularity: 88, trending: false },
    { name: 'Load Balancing', category: 'Infrastructure', popularity: 75, trending: false },
    { name: 'Lua', category: 'Programming', popularity: 35, trending: false },
    { name: 'LESS', category: 'CSS Preprocessor', popularity: 45, trending: false },
    { name: 'Lighthouse', category: 'Performance Tool', popularity: 65, trending: false },
    { name: 'Lerna', category: 'Monorepo Tool', popularity: 42, trending: false },
    { name: 'Lodash', category: 'Utility Library', popularity: 75, trending: false },
    { name: 'Logstash', category: 'Log Management', popularity: 52, trending: false }
  ],
  'M': [
    { name: 'MongoDB', category: 'Database', popularity: 88, trending: false },
    { name: 'MySQL', category: 'Database', popularity: 85, trending: false },
    { name: 'Material-UI', category: 'UI Library', popularity: 80, trending: false },
    { name: 'Machine Learning', category: 'AI/ML', popularity: 90, trending: true },
    { name: 'Microservices', category: 'Architecture', popularity: 85, trending: true },
    { name: 'Mobile Development', category: 'Mobile', popularity: 85, trending: false },
    { name: 'MVC', category: 'Architecture', popularity: 78, trending: false },
    { name: 'Maven', category: 'Build Tool', popularity: 68, trending: false },
    { name: 'Mocha', category: 'Testing', popularity: 62, trending: false },
    { name: 'MariaDB', category: 'Database', popularity: 58, trending: false },
    { name: 'Matplotlib', category: 'Data Visualization', popularity: 75, trending: false },
    { name: 'Mercurial', category: 'Version Control', popularity: 25, trending: false },
    { name: 'Microsoft Office', category: 'Productivity', popularity: 88, trending: false },
    { name: 'MLOps', category: 'AI/ML Operations', popularity: 72, trending: true }
  ],
  'N': [
    { name: 'Node.js', category: 'Backend', popularity: 90, trending: false },
    { name: 'Next.js', category: 'Frontend', popularity: 88, trending: true },
    { name: 'NestJS', category: 'Backend', popularity: 75, trending: true },
    { name: 'NoSQL', category: 'Database', popularity: 80, trending: false },
    { name: 'Nginx', category: 'Web Server', popularity: 78, trending: false },
    { name: 'NumPy', category: 'Python Library', popularity: 82, trending: false },
    { name: 'Natural Language Processing', category: 'AI/ML', popularity: 78, trending: true },
    { name: 'Netty', category: 'Java Framework', popularity: 45, trending: false },
    { name: 'NuGet', category: 'Package Manager', popularity: 58, trending: false },
    { name: 'Nuxt.js', category: 'Vue Framework', popularity: 65, trending: false },
    { name: 'Neo4j', category: 'Graph Database', popularity: 52, trending: false }
  ],
  'O': [
    { name: 'OAuth', category: 'Security', popularity: 78, trending: false },
    { name: 'OpenAPI', category: 'API', popularity: 72, trending: false },
    { name: 'Oracle', category: 'Database', popularity: 70, trending: false },
    { name: 'OpenCV', category: 'Computer Vision', popularity: 68, trending: false },
    { name: 'Objective-C', category: 'Programming', popularity: 35, trending: false },
    { name: 'OOP', category: 'Programming Paradigm', popularity: 88, trending: false },
    { name: 'OpenShift', category: 'Container Platform', popularity: 55, trending: false },
    { name: 'OpenGL', category: 'Graphics', popularity: 45, trending: false }
  ],
  'P': [
    { name: 'Python', category: 'Programming', popularity: 95, trending: true },
    { name: 'PHP', category: 'Programming', popularity: 75, trending: false },
    { name: 'PostgreSQL', category: 'Database', popularity: 85, trending: false },
    { name: 'Postman', category: 'API Testing', popularity: 80, trending: false },
    { name: 'PWA', category: 'Web', popularity: 75, trending: true },
    { name: 'Pandas', category: 'Data Science', popularity: 85, trending: false },
    { name: 'Perl', category: 'Programming', popularity: 28, trending: false },
    { name: 'PowerShell', category: 'Shell', popularity: 55, trending: false },
    { name: 'Puppet', category: 'Configuration Management', popularity: 45, trending: false },
    { name: 'PyTorch', category: 'ML Framework', popularity: 82, trending: true },
    { name: 'Photoshop', category: 'Design', popularity: 75, trending: false },
    { name: 'Prettier', category: 'Code Formatter', popularity: 78, trending: false },
    { name: 'Prisma', category: 'Database ORM', popularity: 72, trending: true },
    { name: 'Prometheus', category: 'Monitoring', popularity: 65, trending: false }
  ],
  'Q': [
    { name: 'QA Testing', category: 'Testing', popularity: 80, trending: false },
    { name: 'Quick Sort', category: 'Algorithm', popularity: 60, trending: false },
    { name: 'Qt', category: 'GUI Framework', popularity: 45, trending: false },
    { name: 'Query Optimization', category: 'Database', popularity: 68, trending: false },
    { name: 'Quasar', category: 'Vue Framework', popularity: 35, trending: false }
  ],
  'R': [
    { name: 'React', category: 'Frontend', popularity: 95, trending: false },
    { name: 'React Native', category: 'Mobile', popularity: 85, trending: false },
    { name: 'Redux', category: 'State Management', popularity: 80, trending: false },
    { name: 'Ruby', category: 'Programming', popularity: 70, trending: false },
    { name: 'REST API', category: 'API', popularity: 90, trending: false },
    { name: 'Redis', category: 'Database', popularity: 80, trending: false },
    { name: 'Responsive Design', category: 'Frontend', popularity: 95, trending: false },
    { name: 'Rust', category: 'Programming', popularity: 72, trending: true },
    { name: 'R', category: 'Programming', popularity: 55, trending: false },
    { name: 'Ruby on Rails', category: 'Backend', popularity: 68, trending: false },
    { name: 'RxJS', category: 'Reactive Programming', popularity: 62, trending: false },
    { name: 'React Router', category: 'React Library', popularity: 88, trending: false },
    { name: 'Raspberry Pi', category: 'Hardware', popularity: 58, trending: false },
    { name: 'Rollup', category: 'Build Tool', popularity: 48, trending: false }
  ],
  'S': [
    { name: 'SQL', category: 'Database', popularity: 95, trending: false },
    { name: 'Spring Boot', category: 'Backend', popularity: 82, trending: false },
    { name: 'Swagger', category: 'API Documentation', popularity: 75, trending: false },
    { name: 'SASS', category: 'CSS Preprocessor', popularity: 78, trending: false },
    { name: 'Selenium', category: 'Testing', popularity: 75, trending: false },
    { name: 'Swift', category: 'Programming', popularity: 80, trending: false },
    { name: 'Svelte', category: 'Frontend', popularity: 70, trending: true },
    { name: 'Serverless', category: 'Architecture', popularity: 78, trending: true },
    { name: 'Scala', category: 'Programming', popularity: 45, trending: false },
    { name: 'Socket.io', category: 'Real-time', popularity: 72, trending: false },
    { name: 'SQLite', category: 'Database', popularity: 78, trending: false },
    { name: 'Spring Framework', category: 'Java Framework', popularity: 75, trending: false },
    { name: 'Sketch', category: 'Design', popularity: 65, trending: false },
    { name: 'Solidity', category: 'Blockchain', popularity: 58, trending: true },
    { name: 'Snowflake', category: 'Data Warehouse', popularity: 68, trending: true },
    { name: 'Styled Components', category: 'CSS-in-JS', popularity: 75, trending: false },
    { name: 'Storybook', category: 'UI Development', popularity: 68, trending: false },
    { name: 'SQLServer', category: 'Database', popularity: 72, trending: false }
  ],
  'T': [
    { name: 'TypeScript', category: 'Programming', popularity: 90, trending: true },
    { name: 'TailwindCSS', category: 'CSS Framework', popularity: 85, trending: true },
    { name: 'Testing', category: 'QA', popularity: 90, trending: false },
    { name: 'TensorFlow', category: 'ML', popularity: 82, trending: true },
    { name: 'Three.js', category: '3D Graphics', popularity: 70, trending: false },
    { name: 'Terraform', category: 'Infrastructure', popularity: 75, trending: true },
    { name: 'Tableau', category: 'Data Visualization', popularity: 72, trending: false },
    { name: 'Tcl', category: 'Programming', popularity: 15, trending: false },
    { name: 'Travis CI', category: 'CI/CD', popularity: 55, trending: false },
    { name: 'Trello', category: 'Project Management', popularity: 68, trending: false },
    { name: 'Thymeleaf', category: 'Template Engine', popularity: 42, trending: false },
    { name: 'Twilio', category: 'Communication API', popularity: 62, trending: false },
    { name: 'Tailwind UI', category: 'UI Kit', popularity: 75, trending: true }
  ],
  'U': [
    { name: 'Unity', category: 'Game Development', popularity: 75, trending: false },
    { name: 'Ubuntu', category: 'OS', popularity: 80, trending: false },
    { name: 'UI/UX Design', category: 'Design', popularity: 88, trending: true },
    { name: 'Unit Testing', category: 'Testing', popularity: 85, trending: false },
    { name: 'Unix', category: 'OS', popularity: 75, trending: false },
    { name: 'UML', category: 'Modeling', popularity: 58, trending: false },
    { name: 'Unreal Engine', category: 'Game Development', popularity: 62, trending: false },
    { name: 'UDP', category: 'Network Protocol', popularity: 48, trending: false }
  ],
  'V': [
    { name: 'Vue.js', category: 'Frontend', popularity: 82, trending: false },
    { name: 'Vuex', category: 'State Management', popularity: 70, trending: false },
    { name: 'VS Code', category: 'IDE', popularity: 95, trending: false },

    { name: 'VuePress', category: 'Static Site Generator', popularity: 45, trending: false },
    { name: 'VirtualBox', category: 'Virtualization', popularity: 58, trending: false },
    { name: 'Vim', category: 'Text Editor', popularity: 68, trending: false },
    { name: 'Visual Studio', category: 'IDE', popularity: 78, trending: false },
    { name: 'Vagrant', category: 'Development Environment', popularity: 42, trending: false }
  ],
  'W': [
    { name: 'Webpack', category: 'Build Tool', popularity: 78, trending: false },
    { name: 'WebGL', category: 'Graphics', popularity: 65, trending: false },
    { name: 'WordPress', category: 'CMS', popularity: 75, trending: false },
    { name: 'WebSocket', category: 'Real-time', popularity: 72, trending: false },
    { name: 'Web Assembly', category: 'Web Technology', popularity: 58, trending: true },
    { name: 'Web Components', category: 'Web Standard', popularity: 52, trending: false },
    { name: 'Wix', category: 'Website Builder', popularity: 55, trending: false },
    { name: 'WooCommerce', category: 'E-commerce', popularity: 68, trending: false },
    { name: 'Windows', category: 'OS', popularity: 85, trending: false }
  ],
  'X': [
    { name: 'XML', category: 'Data Format', popularity: 70, trending: false },
    { name: 'Xamarin', category: 'Mobile', popularity: 65, trending: false },
    { name: 'Xcode', category: 'IDE', popularity: 75, trending: false },
    { name: 'XPath', category: 'Query Language', popularity: 48, trending: false },
    { name: 'XSLT', category: 'Transformation', popularity: 35, trending: false }
  ],
  'Y': [
    { name: 'Yarn', category: 'Package Manager', popularity: 75, trending: false },
    { name: 'YAML', category: 'Configuration', popularity: 70, trending: false },
    { name: 'Yii', category: 'PHP Framework', popularity: 35, trending: false },
    { name: 'Yeoman', category: 'Scaffolding Tool', popularity: 25, trending: false }
  ],
  'Z': [
    { name: 'Zsh', category: 'Shell', popularity: 65, trending: false },
    { name: 'Zustand', category: 'State Management', popularity: 70, trending: true },
    { name: 'Zend Framework', category: 'PHP Framework', popularity: 28, trending: false },
    { name: 'Zigbee', category: 'IoT Protocol', popularity: 35, trending: false },
    { name: 'ZeroMQ', category: 'Messaging', popularity: 32, trending: false }
  ]
};

const LinkedInStyleSkillsInput = ({ 
  skills = [], 
  onSkillsChange, 
  label = "Skills & Technologies",
  placeholder = "Add skills (e.g., React, JavaScript, Python)..."
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Get suggestions based on input
  const getSuggestions = useCallback((input) => {
    if (!input || input.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = input.toLowerCase();
    const firstLetter = input.charAt(0).toUpperCase();
    
    let allSuggestions = [];
    
    // Get suggestions starting with the first letter
    if (TECH_SKILLS[firstLetter]) {
      allSuggestions = [...TECH_SKILLS[firstLetter]];
    }
    
    // Get suggestions from all other letters that match the query
    Object.values(TECH_SKILLS).forEach(skillList => {
      skillList.forEach(skillObj => {
        if (skillObj.name.toLowerCase().includes(query) && 
            !allSuggestions.find(s => s.name === skillObj.name) &&
            !skills.includes(skillObj.name)) {
          allSuggestions.push(skillObj);
        }
      });
    });

    // Sort by popularity and trending status
    allSuggestions.sort((a, b) => {
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return b.popularity - a.popularity;
    });

    // Limit to 8 suggestions for better UX
    setSuggestions(allSuggestions.slice(0, 8));
    setShowSuggestions(allSuggestions.length > 0);
    setFocusedIndex(-1);
  }, [skills]);

  // Handle input change with instant suggestions
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    getSuggestions(value);
  };

  // Handle skill selection
  const handleSkillSelect = (skillName) => {
    if (!skills.includes(skillName)) {
      onSkillsChange([...skills, skillName]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          handleSkillSelect(suggestions[focusedIndex].name);
        } else if (inputValue.trim()) {
          handleSkillSelect(inputValue.trim());
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
      case 'Tab':
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          event.preventDefault();
          handleSkillSelect(suggestions[focusedIndex].name);
        }
        break;
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  // Get skill info from database
  const getSkillInfo = (skillName) => {
    for (const skillList of Object.values(TECH_SKILLS)) {
      const skill = skillList.find(s => s.name === skillName);
      if (skill) return skill;
    }
    return { name: skillName, category: 'Custom', popularity: 50, trending: false };
  };

  // Popular skills for quick add
  const popularSkills = useMemo(() => {
    const allSkills = Object.values(TECH_SKILLS).flat();
    return allSkills
      .filter(skill => skill.popularity >= 85 && !skills.includes(skill.name))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6);
  }, [skills]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        {label} {skills.length > 0 && `(${skills.length})`}
      </Typography>

      {/* Input Field */}
      <TextField
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        sx={{ mb: 2 }}
        autoComplete="off"
        InputProps={{
          sx: {
            '& .MuiOutlinedInput-input': {
              padding: '14px 16px',
              fontSize: '1rem'
            }
          }
        }}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Paper 
          elevation={12}
          sx={{ 
            position: 'absolute',
            top: '85px',
            left: 0,
            right: 0,
            zIndex: 9999,
            maxHeight: 320,
            overflow: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
        >
          {suggestions.map((skill, index) => (
            <ListItemButton
              key={skill.name}
              onClick={() => handleSkillSelect(skill.name)}
              selected={index === focusedIndex}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: index < suggestions.length - 1 ? '1px solid' : 'none',
                borderColor: 'grey.100',
                '&:hover': {
                  bgcolor: 'primary.lighter'
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': {
                    bgcolor: 'primary.main'
                  }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {skill.name}
                    </Typography>
                    
                    {skill.trending && (
                      <Tooltip title="Trending Skill">
                        <TrendingUpIcon 
                          sx={{ 
                            fontSize: 16, 
                            color: 'success.main' 
                          }} 
                        />
                      </Tooltip>
                    )}
                    
                    {skill.popularity >= 90 && (
                      <Tooltip title="Highly Popular">
                        <StarIcon 
                          sx={{ 
                            fontSize: 16, 
                            color: 'warning.main' 
                          }} 
                        />
                      </Tooltip>
                    )}
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    {skill.category} • {skill.popularity}% popularity
                  </Typography>
                </Box>
              </Box>
            </ListItemButton>
          ))}
        </Paper>
      )}

      {/* Selected Skills */}
      {skills.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Selected Skills:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {skills.map((skill, index) => {
              const skillInfo = getSkillInfo(skill);
              const categoryColors = {
                'Frontend': 'primary',
                'Backend': 'success', 
                'Mobile': 'info',
                'Database': 'warning',
                'Cloud': 'secondary',
                'DevOps': 'error',
                'Design': 'secondary',
                'Testing': 'success',
                'Programming': 'primary'
              };
              
              return (
                <Tooltip key={index} title={`${skillInfo.category} • ${skillInfo.popularity}% popularity`}>
                  <Chip
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>{skill}</span>
                        {skillInfo.trending && (
                          <TrendingUpIcon sx={{ fontSize: 14 }} />
                        )}
                      </Box>
                    }
                    onDelete={() => handleRemoveSkill(skill)}
                    color={categoryColors[skillInfo.category] || 'default'}
                    size="medium"
                    sx={{ 
                      mb: 1,
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                    }}
                  />
                </Tooltip>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Popular Skills Quick Add */}
      {skills.length === 0 && popularSkills.length > 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ fontSize: 16 }} />
            Popular Skills:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {popularSkills.map((skill) => (
              <Chip
                key={skill.name}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>{skill.name}</span>
                    {skill.trending && (
                      <TrendingUpIcon sx={{ fontSize: 12, color: 'success.main' }} />
                    )}
                  </Box>
                }
                onClick={() => handleSkillSelect(skill.name)}
                variant="outlined"
                size="small"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                    borderColor: 'primary.main'
                  }
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Skills Stats */}
      {skills.length > 0 && (
        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            💡 Profile Strength: {skills.length < 5 ? 'Add more skills' : skills.length < 10 ? 'Good' : 'Excellent'} 
            {skills.filter(skill => getSkillInfo(skill).trending).length > 0 && 
              ` • ${skills.filter(skill => getSkillInfo(skill).trending).length} trending skill${skills.filter(skill => getSkillInfo(skill).trending).length > 1 ? 's' : ''}`
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LinkedInStyleSkillsInput;