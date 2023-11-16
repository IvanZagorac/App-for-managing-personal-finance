/* eslint-disable max-len */
import { Alert, Button, Modal } from 'react-bootstrap';

function DeleteModal({ deleteModal, setDeleteModal,deleteErrorMessage,setDeleteErrorMessage, title,deleteMethod }:any)
{
    const handleDeleteModal = ()=>
    {
        setDeleteModal(false);
        setDeleteErrorMessage('');
    }

    return(
        <Modal
            centered
            show={deleteModal}
            onHide={handleDeleteModal}>
            <Modal.Body>
                <Modal.Title style={{fontSize:'23px'}}>{title}</Modal.Title>
                <div className='delete-modal-buttons'>
                    <Button className='modal-yes-btn' variant='danger' onClick={deleteMethod}>Yes</Button>
                    <Button className='modal-no-btn' variant='primary' onClick={handleDeleteModal}>No</Button>
                </div>
                <Alert variant="danger" className={deleteErrorMessage ? '' : 'd-none'}>{deleteErrorMessage}</Alert>
            </Modal.Body>
        </Modal> 
    )
    
}

export default DeleteModal;