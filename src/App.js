import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem("count");
    return storedCount ? Number(storedCount) : 0;
  });
  const [countryCounts, setCountryCounts] = useState(() => {
    const storedCountryCounts = localStorage.getItem("countryCounts");
    return storedCountryCounts ? JSON.parse(storedCountryCounts) : {};
  });

  useEffect(() => {
    localStorage.setItem("count", count);
  }, [count]);

  useEffect(() => {
    localStorage.setItem("countryCounts", JSON.stringify(countryCounts));
  }, [countryCounts]);

  async function handleClick() {
    const newCount = count + 1;
    setCount(newCount);

    const countryCode = await getCountryCode();
    if (countryCode) {
      setCountryCounts((prevCountryCounts) => ({
        ...prevCountryCounts,
        [countryCode]: (prevCountryCounts[countryCode] || 0) + 1,
      }));
    }
  }

  async function getCountryCode() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return data.country_code;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const countryRows = Object.entries(countryCounts).map(([countryCode, count]) => (
    <TableRow key={countryCode}>
      <TableCell>{countryCode}</TableCell>
      <TableCell>{count}</TableCell>
    </TableRow>
  ));

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h4" align="center" className={classes.header}>
              Click Counter
            </Typography>
            <Typography variant="body1" align="center">
              You have clicked the button {count} times
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClick} className={classes.button}>
              Click me
            </Button>
            <TableContainer className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    <TableCell>Clicks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{countryRows}</TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default App;


