import { FaTimes } from "react-icons/fa";
export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal-box" style={wide ? { maxWidth: 860 } : {}} onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">{title}</h4>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
