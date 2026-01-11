// Public Pages Theme Constants
export const PUBLIC_PAGE_GRADIENT = (theme) => 
  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 50%, ${theme.palette.secondary.light} 100%)`;

export const HEADER_GRADIENT = (theme) => 
  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

export const CARD_STYLES = (theme) => ({
  boxShadow: theme.shadows[4],
  borderRadius: 3,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)'
});

export const HOVER_CARD_STYLES = (theme) => ({
  ...CARD_STYLES(theme),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  }
});

export const PRIMARY_BUTTON_STYLES = (theme) => ({
  py: 1.5,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  fontSize: '1.1rem',
  fontWeight: 600,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
});

export const SECONDARY_BUTTON_STYLES = (theme) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  fontSize: '1.1rem',
  fontWeight: 600,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
});