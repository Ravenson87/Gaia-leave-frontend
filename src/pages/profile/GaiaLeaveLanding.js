import React from 'react';
import {BarChart, Calendar, Layers, Shield, Users} from 'lucide-react';

const GaiaLeaveLanding = () => {
  return (
    <div className="bg-white">

      <div className="position-relative overflow-hidden mb-5">
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
            zIndex: 1
          }}
        ></div>

        <div className="container-fluid py-5 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-auto mb-4 mb-md-0">
              <div className="bg-white rounded-circle p-3 shadow-lg d-inline-flex">
                <Layers className="text-primary" size={28}/>
              </div>
            </div>
            <div className="col">
              <h2 className="text-white fs-3 fw-bold mb-0">GaiaLeave</h2>
              <p className="text-white opacity-75 mb-0">Modern absence management system</p>
            </div>
          </div>
        </div>

        <div className="container position-relative py-5" style={{ zIndex: 2 }}>
          <div className="row py-4">
            <div className="col-lg-7">
              <h1 className="display-4 fw-bold text-white mb-4">
                Smart Employee Leave Management
              </h1>
              <p className="lead text-white opacity-90 mb-4">
                GaiaLeave streamlines the process of managing and tracking employee absences within your company. Our system implements role-based access control, ensuring that HR personnel, managers, and employees have appropriate permissions based on their responsibilities.
              </p>
            </div>
            <div className="col-lg-5 d-none d-lg-block text-center">
              <div className="position-relative" style={{ height: '300px' }}>
                <div className="position-absolute top-0 end-0" style={{ opacity: 0.7 }}>
                  <Calendar size={280} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="position-absolute bottom-0 start-0 d-none d-lg-block" style={{ zIndex: 1, opacity: 0.1 }}>
          <Users size={200} className="text-white mb-n5 ms-n4" />
        </div>
      </div>


      <div className="container py-5">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">
            Features
          </span>
          <h2 className="display-6 fw-bold mb-3">Key Features</h2>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '650px' }}>
            Our comprehensive platform helps you manage employee absences efficiently with powerful tools and intuitive interfaces.
          </p>
        </div>

        <div className="row g-4 mt-2">

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
              <div className="card-body p-4">
                <div className="p-3 rounded-circle bg-primary bg-opacity-10 d-inline-flex mb-3">
                  <Calendar className="text-primary" size={24}/>
                </div>
                <h3 className="h5 fw-bold mb-3">Leave Tracking</h3>
                <p className="text-secondary mb-0">
                  Efficiently manage vacation, sick days, and other absence types with our intuitive calendar interface and automated tracking system.
                </p>
              </div>
            </div>
          </div>

         <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
              <div className="card-body p-4">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 d-inline-flex mb-3">
                  <Shield className="text-success" size={24} />
                </div>
                <h3 className="h5 fw-bold mb-3">Role-Based Access</h3>
                <p className="text-secondary mb-0">
                  Secure access controls ensuring HR personnel, managers, and employees see only what they need in a clean, intuitive interface.
                </p>
              </div>
            </div>
          </div>


          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
              <div className="card-body p-4">
                <div className="p-3 rounded-circle bg-info bg-opacity-10 d-inline-flex mb-3">
                  <BarChart className="text-info" size={24} />
                </div>
                <h3 className="h5 fw-bold mb-3">Reporting</h3>
                <p className="text-secondary mb-0">
                  Comprehensive analytics and reports to track absence patterns and make informed decisions about workforce management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GaiaLeaveLanding;
