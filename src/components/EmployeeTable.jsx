import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import styles from "./EmployeeTable.module.css";

export default function EmployeeTable({ searchValue }) {
  const [employeeList, setEmployeeList] = useState([]);
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch(
        "https://randomuser.me/api?results=50&gender=male"
      );
      const data = await response.json();
      const fetchedEmployees = data.results;
      setEmployeeList(fetchedEmployees);
    };
    fetchEmployees();
  }, []);

  const matchEmployeeToSearch = ({ name, phone, email }) => {
    return (
      searchValue.trim().length === 0 ||
      name.first.includes(searchValue) ||
      name.last.includes(searchValue) ||
      phone.includes(searchValue) ||
      email.includes(searchValue)
    );
  };

  const employeeListFiltered = employeeList.filter(employee => {
    return matchEmployeeToSearch(employee);
  });

  const employeeListSorted = employeeListFiltered.sort((a, b) => {
    if (isAscending) {
      return a.name.first > b.name.first;
    } else {
      return a.name.first < b.name.first;
    }
  });

  const employeeRows = employeeListSorted.map(employee => {
    return (
      <tr key={employee.login.uuid}>
        <td>
          <img
            src={employee.picture.thumbnail}
            alt={`${employee.name.first} ${employee.name.last}`}
          />
        </td>
        <td>{employee.name.first}</td>
        <td>{employee.name.last}</td>
        <td>{employee.phone}</td>
        <td>{employee.email}</td>
      </tr>
    );
  });

  const sortHandler = () => {
    setIsAscending(prev => !prev);
  };

  return (
    <Table className={`p-0 bg-light`} bordered>
      <thead>
        <tr>
          <th>Picture</th>
          <th
            className={styles["table-header__clickable"]}
            onClick={sortHandler}
          >
            First Name {isAscending ? "↑" : "↓"}
          </th>
          <th>Last Name</th>
          <th>Phone</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {employeeRows}
        {employeeRows.length === 0 && (
          <tr>
            <th className="text-center py-5" colSpan="5">
              No employees found
            </th>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
