import React from 'react';
import {Box, Card, CardContent, Typography} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ExpiredValidationCodePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Card
        sx={{
          minWidth: 400,
          maxWidth: 450,
          p: 4,
          borderRadius: 4,
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          backgroundColor: "white",
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
          }
        }}
      >
        <CardContent>
          <Box sx={{display: 'flex', justifyContent: 'center', mb: 3}}>
            <ErrorOutlineIcon sx={{fontSize: 70, color: '#667eea'}}/>
          </Box>

          <Typography variant="h4" sx={{color: '#333', textAlign: 'center', mb: 2, fontWeight: 'bold'}}>
            Oops!
          </Typography>

          <Typography variant="h5" sx={{color: '#333', textAlign: 'center', mb: 3}}>
            Validation Code Expired
          </Typography>

          <Box sx={{
            bgcolor: '#f8f9fa',
            p: 3,
            borderRadius: 2,
            mb: 3,
            border: '1px solid #e0e0e0'
          }}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
              <AccessTimeIcon sx={{color: '#667eea', mr: 1}}/>
              <Typography variant="body1" sx={{color: '#555'}}>
                Your validation code has expired
              </Typography>
            </Box>
            <Typography variant="body2" sx={{color: '#666'}}>
              For security reasons, validation codes are only valid for a limited time.
              Please request a new code to continue with your verification process.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExpiredValidationCodePage;
