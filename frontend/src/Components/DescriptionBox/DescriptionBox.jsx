import React from 'react';
import './DescriptionBox.css';
import TabbingSystem from '../TabbingSystem/TabbingSystem';

const DescriptionBox = ({ description }) => {
  // Define your tab data here
  const tabData = [
    {
      label: 'Description',
      content: (
        <div className="descriptionbox-description w-75">
          <p>{description}</p>
        </div>
      ),
    },
    {
      label: 'Shipping Info',
      content: (
        <div className="descriptionbox-description w-75">
          <p>Shipping information goes here...</p>
        </div>
      ),
    },
    // You can uncomment and add more tabs here if needed
    // {
    //   label: 'Reviews (122)',
    //   content: <div className="descriptionbox-description w-75">Reviews content...</div>,
    // }
  ];

  return (
    <div className='descriptionbox py-3'>
      {/* Integrating the Tabbing System */}
      <TabbingSystem tabData={tabData} />
    </div>
  );
};

export default DescriptionBox;
