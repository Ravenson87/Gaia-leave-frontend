import * as React from 'react';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';

const NAVIGATION = [
    { title: 'Dashboard', icon: <DashboardIcon /> },
    { title: 'Orders', icon: <ShoppingCartIcon /> },
    { title: 'Reports', icon: <BarChartIcon /> },
    { title: 'Sales', icon: <DescriptionIcon /> },
    { title: 'Traffic', icon: <DescriptionIcon /> },
    { title: 'Integrations', icon: <LayersIcon /> },
];

const Skeleton = styled(Box)(({ theme, height }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    height,
}));

export default function DashboardLayoutBasic() {
    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>Dashboard Header</Paper>
                </Grid>

                <Grid item xs={4}>
                    <Skeleton height={100} />
                </Grid>
                <Grid item xs={8}>
                    <Skeleton height={100} />
                </Grid>

                <Grid item xs={12}>
                    <Skeleton height={150} />
                </Grid>

                <Grid item xs={3}>
                    <Skeleton height={100} />
                </Grid>
                <Grid item xs={3}>
                    <Skeleton height={100} />
                </Grid>
                <Grid item xs={3}>
                    <Skeleton height={100} />
                </Grid>
                <Grid item xs={3}>
                    <Skeleton height={100} />
                </Grid>
            </Grid>
        </Container>
    );
}
