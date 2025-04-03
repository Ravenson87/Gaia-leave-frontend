import React from 'react';
import {BarChart, Calendar, Layers, Shield} from 'lucide-react';

const GaiaLeaveLanding = () => {
  return (
    <div>

      <div className="position-relative">
        <div className="bg-dark position-absolute w-100 h-100 opacity-25"></div>
        <div
          className="position-absolute w-100 h-100"
          style={{background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)'}}
        ></div>

        <div className="container-fluid pt-5 position-relative">
          <div className="row align-items-center">
            <div className="col-md-1 col-sm-2 text-center mb-3 mb-sm-0">
              <div className="bg-white rounded-circle p-3 d-inline-flex shadow">
                <Layers className="text-primary" size={24}/>
              </div>
            </div>
            <div className="col-md-7 col-sm-10">
              <h2 className="text-white fs-4 mb-1">GaiaLeave</h2>
            </div>
          </div>
        </div>
        <div className="container position-relative text-white">

          <div className="row py-5">
            <div className="col-lg-7">
              <h2 className="display-5 fw-bold mb-4">
                Streamlined Employee Leave Management
              </h2>
              <p className="lead mb-5">
                GaiaLeave is a comprehensive employee leave management system designed to streamline
                the process of managing and tracking employee absences within a company. The system
                implements role-based access control, ensuring that HR personnel, managers, and
                employees have appropriate permissions based on their responsibilities.
              </p>
            </div>
          </div>
        </div>


        <div className="position-absolute bottom-0 end-0 d-none d-lg-block" style={{opacity: '0.1'}}>
          <Calendar size={240} className="text-white mb-n5 me-n4"/>
        </div>
      </div>


      <div className="bg-light py-5">
        <div className="container py-4">
          <h3 className="text-center fw-bold mb-5">Key Features</h3>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                    <Calendar className="text-primary" size={24}/>
                  </div>
                  <h4 className="card-title h5 fw-bold">Leave Tracking</h4>
                  <p className="card-text text-muted">
                    Efficiently manage vacation, sick days, and other absence types with
                    an intuitive calendar interface.
                  </p>
                </div>
              </div>
            </div>


            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                    <Shield className="text-primary" size={24} />
                  </div>
                  <h4 className="card-title h5 fw-bold">Role-Based Access</h4>
                  <p className="card-text text-muted">
                    Secure access controls ensuring HR, managers, and employees
                    see only what they need.
                  </p>
                </div>
              </div>
            </div>


            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                    <BarChart className="text-primary" size={24} />
                  </div>
                  <h4 className="card-title h5 fw-bold">Reporting</h4>
                  <p className="card-text text-muted">
                    Comprehensive analytics and reports to track absence patterns
                    and make informed decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaiaLeaveLanding;
