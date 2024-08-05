import React from 'react'
import './Announcement.css'

const Announcement = () => {
  return (
    <>
      <div className="announcement-section">
        <div className="announcement-bg bg-black w-100 py-3">
          <div className="px-lg-5">
            <div className="text-white d-flex align-items-center justify-content-between text-uppercase">
              <div className="d-md-flex align-items-center gap-3">
                <div className="announcement">super Sale Up to 40% off</div>
                <a
                  href="#arrival"
                  className="announcement-btn text-decoration-none text-white"
                  role="button"
                >
                  Shop Now
                </a>
              </div>
              <ul
                className="announcement-timer text-uppercase list-unstyled ps-0 d-flex letter-216 mb-0"
              >
                <li className="text-center d-flex align-items-center gap-2">
                  <div>
                    <span className="d-block" id="days">99</span>
                    day
                  </div>
                  <div className="colon">:</div>
                </li>
                <li className="text-center d-flex align-items-center gap-2">
                  <div>
                    <span className="d-block" id="hours">17</span>
                    Hrs
                  </div>
                  <div className="colon">:</div>
                </li>
                <li className="text-center d-flex align-items-center gap-2">
                  <div>
                    <span className="d-block" id="minutes">47</span>
                    Min
                  </div>
                </li>
                <li className="text-center d-flex align-items-center gap-2">
                  <div className="colon">:</div>
                  <div>
                    <span className="d-block" id="seconds">08</span>
                    Sec
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Announcement