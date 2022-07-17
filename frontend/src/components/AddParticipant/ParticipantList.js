import React, { useState, useEffect } from "react";
// import EmployeeForm from "./EmployeeForm";
import PageHeader from "../../components/scoreUtils/PageHeader";
// import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/scoreUtils/useTable";
import * as employeeService from "../../components/employeservice";
import Controls from "../../components/scoreUtils/controls/Controls";
import { Search } from "@material-ui/icons";
import ParticipantForm from "./ParticipantForm";

import { useAuth } from "../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
}));

const headCells = [
  { id: "fullName", label: "Student Name" },
  { id: "email", label: "Email Address " },
];

export default function ParticipantList() {
  const { currentUser } = useAuth();

  const classes = useStyles();
  const [records, setRecords] = useState(employeeService.getAllEmployees());
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creator: currentUser.email.replace(".", ""),
        quizID: new URLSearchParams(window.location.search).get("quizID"),
      }),
    };
    fetch("/api/getParticipants", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let pl = [];
        for (let key in data) {
          if (typeof data[key] === "object") {
            pl.push({ name: data[key].name, email: data[key].emailID });
          }
        }
        console.log(data);
        setUserData(pl);
      });

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  return (
    <>
      <br />
      <h5 className="ml-5">Participant List</h5>
      <ParticipantForm setUser={setUserData} />
      <Paper>
        <Toolbar className={classes.pageContent}>
          <Controls.Input
            label="Search Students"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
              </TableRow>
            ))}
            {userData.map((item, index) => {
              return (
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </>
  );
}