// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  WorkOutlineIcon: WorkOutlineIcon,
  PostAddIcon: PostAddIcon,
  FolderOpenIcon: FolderOpenIcon,
  PeopleAltIcon: PeopleAltIcon,
  BarChartIcon: BarChartIcon,
  PersonIcon: PersonIcon,
  MessageIcon: MessageIcon,
  SchoolIcon: SchoolIcon,
  DashboardIcon: DashboardIcon,
  AssignmentIcon: AssignmentIcon,
  DescriptionIcon: DescriptionIcon,
  AssessmentIcon: AssessmentIcon
};

// ==============================|| MENU ITEMS ||============================== //

// Employer Menu Items
const employerMenuItems = {
  items: [
    {
      id: 'employer-section',
      title: 'Employer Dashboard',
      type: 'group',
      children: [
        {
          id: 'employer-dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/app/employer/dashboard'
        },
        {
          id: 'post-job',
          title: 'Post New Job',
          type: 'item',
          icon: icons['PostAddIcon'],
          url: '/app/employer/post-job'
        },
        {
          id: 'my-internship',
          title: 'Myjobs',
          type: 'item',
          icon: icons['FolderOpenIcon'],
          url: '/app/employer/my-internship'
        },
        {
          id: 'applicants',
          title: 'Applicants',
          type: 'item',
          icon: icons['PeopleAltIcon'],
          url: '/app/employer/applicants'
        },
        {
          id: 'analytics',
          title: 'Analytics',
          type: 'item',
          icon: icons['BarChartIcon'],
          url: '/app/employer/analytics'
        },
        {
          id: 'profile',
          title: 'My Profile',
          type: 'item',
          icon: icons['PersonIcon'],
          url: '/app/employer/profile'
        },
        {
          id: 'messages',
          title: 'Messages',
          type: 'item',
          icon: icons['MessageIcon'],
          url: '/app/employer/messages'
        }
      ]
    }
  ]
};

// Intern Menu Items
const internMenuItems = {
  items: [
    {
      id: 'intern-section',
      title: 'Intern Dashboard',
      type: 'group',
      children: [
        {
          id: 'intern-home',
          title: 'Home',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/app/intern'
        },
        {
          id: 'intern-dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['DashboardIcon'],
          url: '/app/intern/dashboard'
        },
        {
          id: 'intern-applied-jobs',
          title: 'Applied Jobs',
          type: 'item',
          icon: icons['AssignmentIcon'],
          url: '/app/intern/applied-jobs'
        },
        {
          id: 'intern-profile',
          title: 'My Profile',
          type: 'item',
          icon: icons['PersonIcon'],
          url: '/app/intern/profile'
        },
        {
          id: 'resume-builder',
          title: 'Resume Builder',
          type: 'item',
          icon: icons['DescriptionIcon'],
          url: '/app/intern/resume-builder'
        },
        {
          id: 'ats-checker',
          title: 'ATS Checker',
          type: 'item',
          icon: icons['AssessmentIcon'],
          url: '/app/intern/ats-checker'
        },
        {
          id: 'intern-messages',
          title: 'Messages',
          type: 'item',
          icon: icons['MessageIcon'],
          url: '/app/intern/messages'
        }
      ]
    }
  ]
};

// Function to get menu items based on user role
export const getMenuItems = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      
      if (user.role === 'employer') {
        return employerMenuItems;
      } else if (user.role === 'intern') {
        return internMenuItems;
      }
    }
  } catch (error) {
    console.error('Error getting user role:', error);
  }
  
  // Default to intern menu
  return internMenuItems;
};

// eslint-disable-next-line
export default getMenuItems();
