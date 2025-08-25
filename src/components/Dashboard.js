import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "./Sidebar";

const Dashboard = (props) => {
  const [jobs, setJobs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch(
        "http://localhost:4002/application/jobs/getjobs",
        {
          headers: { Authorization: token },
        }
      );
      const data = await res.json();
      setJobs(data.jobs || []);
    };
    fetchJobs();
  }, []);

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const timeCounts = jobs.reduce((acc, job) => {
    if (!job.lastdate) return acc;
    const date = new Date(job.lastdate);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const timeData = Object.entries(timeCounts).map(([month, count]) => ({
    month,
    count,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  return (
    <div>
      <Container>
        <Sidebar onLogout={props.onLogout} />
      </Container>
      <Container>
        {!jobs || jobs.length === 0 ? (
          <p>No job applications yet.</p>
        ) : (
          <div>
            <h2 className="mb-3">Application Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <h2 className="mt-5 mb-3">Applications Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
