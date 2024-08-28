import React, { useState } from 'react';

const MegaMenuLimitModal = ({ show, onHide, childCategories, onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = () => {
    onSelect(selectedCategory);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal show" style={{ display: 'block' }} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Child Category to Disable MegaMenu</h5>
            <button type="button" className="close" onClick={onHide} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              {childCategories.map(category => (
                <div className="form-check" key={category._id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="category"
                    value={category._id}
                    onChange={() => setSelectedCategory(category._id)}
                  />
                  <label className="form-check-label">
                    {category.name}
                  </label>
                </div>
              ))}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuLimitModal;
