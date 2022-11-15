import React, { useState, useRef, useEffect } from 'react'
import { useParams, Link } from "react-router-dom";
import BasicToDoListItems from './BasicToDoListItems';
// import { v4 as uuidv4 } from "uuid";

export default function BasicToDoList() {
    const [toDos, setToDos] = useState([]);
    const [refreshList, setRefreshList] = useState(false);
    const toDoNameRef = useRef();

    const params = useParams();

    useEffect(() => {
        fetch(`/todolists/${params.basictodolist_name}`, {
            method: "get",
            headers: {
                "content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((toDosFromServer) => {
                setToDos(toDosFromServer.toDoListData);
            });
    }, [params, refreshList]);


    const addToDo = () => {
        const name = toDoNameRef.current.value
        if (name.trim() === "") {return}

        console.log("name: ", name);

        fetch(`/todolists/add/${params.basictodolist_name}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                basictodo_name: name,
            }),
        })
            .then((res) => res.json())
            .then((data) => {

                if (data.success) {
                    setToDos([data.newBasicToDoItem, ...toDos]);
                    toDoNameRef.current.value = null;
                    return
                } else {
                    console.log("something went wrong in inserting a new ToDo");
                }
            });
    }

    const toggleToDo = (id) => {

        let toDoIdToChange = id;

        fetch(`/todolists/change/${params.basictodolist_name}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                id: toDoIdToChange,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // console.log("completed successfully changed");
                    setRefreshList(!refreshList);
                } else {
                    console.log("something went wrong while changing a ToDo");
                }
            });
    }

       const deleteToDo = (id) => {
           let toDoToDelete = id;

           fetch(`/todolists/delete/${params.basictodolist_name}`, {
               method: "POST",
               headers: {
                   "content-type": "application/json",
               },
               body: JSON.stringify({
                   id: toDoToDelete,
               }),
           })
               .then((res) => res.json())
               .then((data) => {
                   if (data.success) {
                       setRefreshList(!refreshList);
                   } else {
                       console.log("something went wrong while deleting a ToDo");
                   }
               });
       };

  return (
      <>
          <Link
              to="/todolists"
              className="logOutField"
              style={{
                  textDecoration: "none",
                  top: "20px",
                  left: "0px",
                  position: "relative",
              }}
          >
              {" << "}
              Back{" "}
          </Link>
          <br />
          <br />

          <form className="inputForm">
              <input
                  type="text"
                  ref={toDoNameRef}
                  placeholder="Add a To-Do item"
              ></input>
              <button onClick={addToDo}> Add To-Do </button>
              {/* <button onClick={clearToDo}> Clear ToDo </button> */}
          </form>
          {/* <div>
                  {" "}
                  {toDos.filter((toDo) => !toDo.completed).length} left to do{" "}
              </div> */}
          <br></br>

          <div className="basicToDoListContainer">
              <div className="basicToDoList">
                  <h3> {params.basictodolist_name} </h3>
                  <br />
                  <BasicToDoListItems toDos={toDos} toggleToDo={toggleToDo} deleteToDo={deleteToDo}/>
              </div>
          </div>
      </>
  );
}
