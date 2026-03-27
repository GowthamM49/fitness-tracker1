import React from 'react';
import { Box, Typography } from '@mui/material';

const HeroHeader = ({ icon, title, subtitle }) => {
  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 2,
        p: 4,
        color: 'white',
        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        {icon}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body1" sx={{ opacity: 0.95 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default HeroHeader;


