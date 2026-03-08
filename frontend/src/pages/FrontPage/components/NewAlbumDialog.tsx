import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Navigate } from 'react-router-dom';
import { createAlbumAndRefresh } from 'hooks/swr';
import routes from 'routes';
import { useGlobalError } from 'contexts/GlobalErrorContext';

type NewAlbumDialogProps = {
  open: boolean;
  handleClose: () => void;
};

const NewAlbumDialog = ({ open, handleClose }: NewAlbumDialogProps) => {
  const [albumName, setAlbumName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [redirectAlbum, setRedirectAlbum] = React.useState<string | null>(null);
  const { showError } = useGlobalError();

  const handleDialogClose = () => {
    handleClose();
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const response = await createAlbumAndRefresh(albumName, description, showError);

    if (response) {
      setRedirectAlbum(response.album_name);
    }
  };

  if (redirectAlbum) {
    return <Navigate to={routes.albumPage(redirectAlbum)} replace />;
  }

  return (
    <div>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Create new album</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Every image stored in BildeBua must be connected to an album. Please enter a name and description for your new album below.
          </DialogContentText>
          <TextField
            value={albumName}
            onChange={(event) => setAlbumName(event.target.value)}
            autoFocus
            margin="dense"
            label="Album name"
            fullWidth
          />
          <TextField
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            label="Description"
            multiline
            rows={4}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create album
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewAlbumDialog;
