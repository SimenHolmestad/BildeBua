import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Header from 'components/Header';
import type { Theme } from '@mui/material/styles';
import { useQrCodes } from 'hooks/swr';

const useStyles = makeStyles((_theme: Theme) => ({
  qrCodeGridItem: {
    width: '45%',
  },
  qrCodeGrid: {
    width: '100%',
  },
  image: {
    width: '100%',
  },
  verticallyCenteredDiv: {
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

const QrCodePage = () => {
  const classes = useStyles();
  const { qrCodes } = useQrCodes();

  const qrCodeData = qrCodes?.qr_codes ?? [];

  const qrCodeItems = qrCodeData.map((qrCode, index) => (
    <Grid item key={index} className={classes.qrCodeGridItem}>
      <img className={classes.image}
           src={qrCode.url}
           alt={qrCode.name} />
      <Typography variant="h6" align="center">
        {qrCode.information}
      </Typography>
    </Grid>
  ));

  return (
    <>
      <Header />
      <div className={classes.verticallyCenteredDiv}>
        <Grid container justifyContent="space-around" className={classes.qrCodeGrid}>
          {qrCodeItems}
        </Grid>
      </div>
    </>
  );
};

export default QrCodePage;
