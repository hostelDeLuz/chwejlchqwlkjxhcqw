// import { LineChart } from "react-chartkick";

export default function Dashboard() {
  return (
    <>
    <div className="ec-page-wrapper">
      <div className="ec-content-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-xl-3 col-sm-6 p-b-15 lbl-card">
              <div className="card card-mini dash-card card-1">
                <div className="card-body">
                  <h2 className="mb-1">1,503</h2>
                  <p>Daily Signups</p>
                  <span className="mdi mdi-account-arrow-left"></span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 p-b-15 lbl-card">
              <div className="card card-mini dash-card card-2">
                <div className="card-body">
                  <h2 className="mb-1">79,503</h2>
                  <p>Daily Visitors</p>
                  <span className="mdi mdi-account-clock"></span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 p-b-15 lbl-card">
              <div className="card card-mini dash-card card-3">
                <div className="card-body">
                  <h2 className="mb-1">15,503</h2>
                  <p>Daily Order</p>
                  <span className="mdi mdi-package-variant"></span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 p-b-15 lbl-card">
              <div className="card card-mini dash-card card-4">
                <div className="card-body">
                  <h2 className="mb-1">$98,503</h2>
                  <p>Daily Revenue</p>
                  <span className="mdi mdi-currency-usd"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}
