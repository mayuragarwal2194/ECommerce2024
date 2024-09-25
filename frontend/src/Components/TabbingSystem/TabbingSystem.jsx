import React, { useState } from 'react';
import './TabbingSystem.css'

const TabbingSystem = ({ tabData }) => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState(tabData[0].label);

  return (
    <div>
      <div className="tabbingSystem d-flex flex-wrap align-items-center mb-3" role="tablist">
        {tabData.map((tab) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={activeTab === tab.label}
            tabIndex={activeTab === tab.label ? 0 : -1}
            className={`${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabData.map((tab) => (
          <div
            key={tab.label}
            role="tabpanel"
            style={{ display: activeTab === tab.label ? 'block' : 'none' }}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );

}

export default TabbingSystem