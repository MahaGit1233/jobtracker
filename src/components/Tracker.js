import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import Sidebar from "./Sidebar";
import JobApplicationForm from "./JobApplicationForm";
import CompanyForm from "./CompanyForm";
import { NavLink } from "react-router-dom";
import { Briefcase, Building } from "react-bootstrap-icons";
import { ThemeContext } from "./Context/ThemeContext";

const Tracker = (props) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showCompanyForm, setCompanyForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [editJob, setEditJob] = useState(null);
  const [editCompany, setEditCompany] = useState(null);

  const [jobSearch, setJobSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [toJobs, setToJobs] = useState(false);
  const [toCompanies, setToCompanies] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [jobPaginationData, setJobPaginationData] = useState({});
  const [companyPaginationData, setCompanyPaginationData] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    return parseInt(localStorage.getItem("itemsPerPage")) || 10;
  });

  const { theme } = useContext(ThemeContext);

  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `http://localhost:4002/application/jobs/getjobs?page=${currentPage}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      console.log(data.jobs);
      setJobs(data.jobs);
      setJobPaginationData(data);
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `http://localhost:4002/application/companies/getcompanies?page=${currentPage}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      console.log(data.companies);
      setCompanies(data.companies);
      setCompanyPaginationData(data);
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) return;

    localStorage.setItem("itemsPerPage", itemsPerPage);

    fetchJobs();
    fetchCompanies();
    setToJobs(true);
  }, [token, currentPage, itemsPerPage]);

  const deleteJobHandler = async (id) => {
    const response = await fetch(
      `http://localhost:4002/application/jobs/deletejob/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await response.json();
    console.log(data);
    alert(data.message);

    setJobs((prev) => prev.filter((job) => job.id !== id));

    if (jobs.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const deleteCompanyHandler = async (id) => {
    const response = await fetch(
      `http://localhost:4002/application/companies/deletecompany/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await response.json();
    console.log(data);
    alert(data.message);

    setCompanies((prev) => prev.filter((company) => company.id !== id));

    if (companies.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const saveJobHandler = (jobs) => {
    if (editJob) {
      setJobs((prev) => prev.map((job) => (job.id === jobs.id ? jobs : job)));
      setEditJob(null);
    } else {
      setJobs((prev) => [...prev, jobs]);
    }
  };

  const saveCompanyHandler = (companies) => {
    if (editCompany) {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companies.id ? companies : company
        )
      );
      setEditCompany(null);
    } else {
      setCompanies((prev) => [...prev, companies]);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = [
      job.jobtitle,
      job.companyname,
      job.joblocation,
      job.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(jobSearch.toLowerCase());

    const matchStatus =
      !statusFilter || job.status.toLowerCase() === statusFilter.toLowerCase();

    const jobDate = job.lastdate ? new Date(job.lastdate) : null;
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesDate =
      (!from || (jobDate && jobDate >= from)) &&
      (!to || (jobDate && jobDate <= to));

    return matchStatus && matchesSearch && matchesDate;
  });

  const filteredCompanies = companies.filter((company) =>
    [company.name, company.industry, company.location, company.contact]
      .join(" ")
      .toLowerCase()
      .includes(companySearch.toLowerCase())
  );

  return (
    <div>
      <Container>
        <Sidebar onLogout={props.onLogout} />
      </Container>
      <Container>
        {showApplicationForm && (
          <JobApplicationForm
            closeHandler={() => {
              setShowApplicationForm(false);
              setEditJob(null);
            }}
            onSaved={saveJobHandler}
            editJob={editJob}
          />
        )}
        {showCompanyForm && (
          <CompanyForm
            closeHandler={() => {
              setCompanyForm(false);
              setEditCompany(null);
            }}
            onSaved={saveCompanyHandler}
            editCompany={editCompany}
          />
        )}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            onClick={() => {
              setToJobs(true);
              setToCompanies(false);
            }}
            style={{
              backgroundColor: "#827717",
              color: "white",
              border: "none",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <Briefcase style={{ marginTop: "5px" }} />
            Jobs
          </Button>
          <Button
            onClick={() => {
              setToCompanies(true);
              setToJobs(false);
            }}
            style={{
              backgroundColor: "#827717",
              color: "white",
              border: "none",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <Building style={{ marginTop: "5px" }} />
            Companies
          </Button>
        </div>
        {toJobs && (
          <div style={{ marginTop: "2%" }}>
            <h1 style={{ textAlign: "center" }}>Jobs</h1>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <Form.Group>
                <Form.Label>Status:</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: "200px" }}
                >
                  <option value="">All Statuses</option>
                  <option>Bookmarked</option>
                  <option>Applied</option>
                  <option>Interviewed</option>
                  <option>Offered</option>
                  <option>Rejected</option>
                  <option>I Dropped it</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>From:</Form.Label>
                <Form.Control
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ width: "200px" }}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>To:</Form.Label>
                <Form.Control
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ width: "200px" }}
                />
              </Form.Group>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "3%",
                //   border: "1px solid blue",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "3%",
                  paddingTop: "1%",
                  width: "80%",
                  // border: "1px solid green",
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Search jobs..."
                  value={jobSearch}
                  onChange={(event) => setJobSearch(event.target.value)}
                  style={{ width: "80%", height: "100%" }}
                />
                <Button
                  onClick={() => setShowApplicationForm(true)}
                  variant="outline-dark"
                  style={{ height: "100%" }}
                >
                  Add New Job
                </Button>
              </div>
            </div>
            <Table style={{ marginTop: "3%" }} striped hover>
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Job Title</th>
                  <th>Company Name</th>
                  <th>Job Location</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Last Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.jobtitle}</td>
                    <td>{job.companyname}</td>
                    <td>{job.joblocation}</td>
                    <td>{job.status}</td>
                    <td>{job.notes}</td>
                    <td>{job.lastdate}</td>
                    <td>
                      <Button
                        onClick={() => {
                          setEditJob(job);
                          setShowApplicationForm(true);
                        }}
                        variant="outline-dark"
                      >
                        Update
                      </Button>
                    </td>
                    <td>
                      <Button
                        onClick={() => deleteJobHandler(job.id)}
                        variant="outline-dark"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {toCompanies && (
          <div style={{ marginTop: "2%" }}>
            <h1 style={{ textAlign: "center" }}>Companies</h1>
            <div
              style={{
                display: "flex",
                gap: "3%",
                marginTop: "3%",
                //   border: "1px solid blue",
              }}
            >
              <Form.Control
                type="text"
                placeholder="Search Companies..."
                value={companySearch}
                onChange={(event) => setCompanySearch(event.target.value)}
                style={{ width: "60%", height: "100%" }}
              />
              <Button
                onClick={() => setCompanyForm(true)}
                variant="outline-dark"
                style={{ height: "100%" }}
              >
                Add a Company
              </Button>
            </div>
            <Table style={{ marginTop: "2%" }} striped hover>
              <thead className="table-success">
                <tr>
                  <th>Id</th>
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Company Size</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.id}</td>
                    <td>{company.name}</td>
                    <td>{company.industry}</td>
                    <td>{company.companysize}</td>
                    <td>{company.location}</td>
                    <td>{company.contact}</td>
                    <td>{company.notes}</td>
                    <td>
                      <Button
                        onClick={() => {
                          setEditCompany(company);
                          setCompanyForm(true);
                        }}
                        variant="outline-dark"
                      >
                        Update
                      </Button>
                    </td>
                    <td>
                      <Button
                        onClick={() => deleteCompanyHandler(company.id)}
                        variant="outline-dark"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {toJobs && jobPaginationData && (
          <div>
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <label
                htmlFor="itemsPerPageSelect"
                style={{ marginRight: "10px" }}
              >
                Show
              </label>
              <select
                id="itemsPerPageSelect"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <span> expenses per page</span>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Button
                variant={theme === "light" ? "outline-dark" : "outline-light"}
                disabled={!jobPaginationData.hasPreviousPage}
                onClick={() => setCurrentPage(jobPaginationData.previousPage)}
              >
                Previous
              </Button>{" "}
              <span>
                Page {jobPaginationData.currentPage} of{" "}
                {jobPaginationData.lastPage}
              </span>{" "}
              <Button
                variant={theme === "light" ? "outline-dark" : "outline-light"}
                disabled={!jobPaginationData.hasNextPage}
                onClick={() => setCurrentPage(jobPaginationData.nextPage)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {toCompanies && companyPaginationData && (
          <div>
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <label
                htmlFor="itemsPerPageSelect"
                style={{ marginRight: "10px" }}
              >
                Show
              </label>
              <select
                id="itemsPerPageSelect"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <span> expenses per page</span>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Button
                variant={theme === "light" ? "outline-dark" : "outline-light"}
                disabled={!companyPaginationData.hasPreviousPage}
                onClick={() =>
                  setCurrentPage(companyPaginationData.previousPage)
                }
              >
                Previous
              </Button>{" "}
              <span>
                Page {companyPaginationData.currentPage} of{" "}
                {companyPaginationData.lastPage}
              </span>{" "}
              <Button
                variant={theme === "light" ? "outline-dark" : "outline-light"}
                disabled={!companyPaginationData.hasNextPage}
                onClick={() => setCurrentPage(companyPaginationData.nextPage)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Tracker;
