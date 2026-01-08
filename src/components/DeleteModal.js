function DeleteModal({ show, onClose, onConfirm, user }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Are you sure you want to delete {user?.name}?</h3>

        <button onClick={onConfirm}>Yes, Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteModal;
