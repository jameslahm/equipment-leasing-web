import React from 'react';
import { Typography,Box } from '@material-ui/core';

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			Copyright &copy; Equipment-Leasing-Team 2020
		</Typography>
	);
}

function Footer(){
    return <Box pt={4}>
        <Copyright></Copyright>
    </Box>
}

export default Footer