import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import TaskExpand from "./pages/TaskExpand";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, createContext } from "react";
import Footer from "./components/Footer";
import UpdateTask from "./pages/UpdateTask";
import PageNotFound from "./pages/PageNotFound";
import VerifyPage from "./pages/VerifyPage";
import AccountPage from "./pages/AccountPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AskForEmail from "./pages/AskForEmail";
function App() {
  const UserContext = createContext();
  const task = JSON.parse(localStorage.getItem("fullTask"));
  const [fullTask, setFullTask] = useState({
    _id: null,
    task: task ? task.task : "No task specified",
    description: task ? task.description : "No description specified",
    dueDateTime: task ? task.dueDateTime : "No date specified",
  });
  //Store fullTask in localStorage to prevent taskExpand and UpdateForm looses information after reloading
  // localStorage.setItem("fullTask", JSON.stringify(fullTask));
  const removeUser = () => {
    localStorage.removeItem("user");
  };
  let pageReloaded = window.performance
    .getEntriesByType("navigation")
    .map((nav) => nav.type)
    .includes("reload");
  // when the user close the page, user is removed.
  useEffect(() => {
    if (!pageReloaded) {
      window.addEventListener("beforeunload", removeUser);
    }

    return () => {
      window.removeEventListener("beforeunload", () => {
        console.log("User logged out");
      });
    };
  }, []);
  //Manually reload the page once
  useEffect(() => {
    if (pageReloaded === false) {
      window.location.reload(false);
    }
  }, []);
  /**
   * Manually set the fullTask to in App.js top-level to prevent the error of converting uncontrolled to controlled components
   * Everytime the user reload the page when the UpdateForm is open, the information will be kept. Everytime the user reload the page
   * we will manually pass in the new task from localStorage so that task is not null.
   */
  useEffect(() => {
    window.addEventListener("unload", () => {
      // task = JSON.parse(localStorage.getItem("fullTask"));
      setFullTask({
        ...fullTask,
        _id: null,
        task: task ? task.task : "No task specified",
        description: task ? task.description : "No description specified",
        dueDateTime: task ? task.dueDateTime : "No date specified",
      });
    });
    return () => {
      window.removeEventListener("unload", () => {
        console.log("Removed event listener");
      });
    };
  }, []);
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <UserContext.Provider value={fullTask}>
            <Routes>
              <Route path="/" element={<Homepage />}></Route>
              <Route
                path="/dashboard"
                element={
                  <Dashboard setFullTask={setFullTask} context={UserContext} />
                }
              ></Route>
              <Route path="/account" element={<AccountPage />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route
                path="/expandTask"
                element={<TaskExpand context={UserContext} />}
              ></Route>
              <Route
                path="/updateTask"
                element={<UpdateTask context={UserContext} />}
              ></Route>
              <Route
                path="/confirm/:confirmationCode"
                element={<VerifyPage />}
              ></Route>
              <Route
                path="/changePassword/:userId"
                element={<ChangePasswordPage />}
              ></Route>
              <Route path="/reset" element={<AskForEmail />}></Route>
              <Route path="/*" element={<PageNotFound />}></Route>
            </Routes>
          </UserContext.Provider>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
