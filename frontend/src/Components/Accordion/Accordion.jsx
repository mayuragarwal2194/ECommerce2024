import React from 'react';
import './Accordian.css';

const Accordion = ({ accordionData }) => {
  return (
    <div className="accordion" id="dynamicAccordion">
      {accordionData.map((item, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header mt-0" id={`heading${index}`}>
            <button
              className="accordion-button collapsed" // All sections collapsed by default
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${index}`}
              aria-expanded="false" // Default to false
              aria-controls={`collapse${index}`}
            >
              {item.title}
            </button>
          </h2>
          <div
            id={`collapse${index}`}
            className="accordion-collapse collapse" // All sections collapsed by default
            aria-labelledby={`heading${index}`}
            data-bs-parent="#dynamicAccordion"
          >
            <div className="accordion-body">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;