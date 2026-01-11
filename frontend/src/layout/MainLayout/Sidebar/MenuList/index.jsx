import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import { getMenuItems } from 'menu-items';

// ==============================|| MENULIST ||============================== //

const MenuList = ({ drawerToggle }) => {
  const [menuItem, setMenuItem] = React.useState({ items: [] });

  React.useEffect(() => {
    // Function to update menu items
    const updateMenuItems = () => {
      const items = getMenuItems();
      setMenuItem(items);
    };

    // Initial load
    updateMenuItems();

    // Listen for storage changes (when user logs in/out)
    window.addEventListener('storage', updateMenuItems);
    
    // Custom event for immediate menu update
    window.addEventListener('userRoleChanged', updateMenuItems);

    return () => {
      window.removeEventListener('storage', updateMenuItems);
      window.removeEventListener('userRoleChanged', updateMenuItems);
    };
  }, []);

  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} drawerToggle={drawerToggle} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return navItems;
};

MenuList.propTypes = {
  drawerToggle: PropTypes.func
};

export default MenuList;
