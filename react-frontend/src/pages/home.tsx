import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";
import { ActionLink } from "../components/ActionLink";
import { ViewBox, Button } from "../design-system/atoms";
import { actionCreators, State } from "../store";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal";
import { AddEntryForm } from "../components/AddEntryForm";
import { uuidv4 } from "../types";

const Wrapper = styled(ViewBox)`
  justify-content: center;
  background-color: ${({ theme }) => theme.Colors.white};
  margin-top: 55px;
`;

export const Home = () => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state: State) => state.todo);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idForDeletion, setIdForDeletion] = useState<uuidv4 | null>(null);

  const [newSummary, setNewSummary] = useState("");
  const [newDetail, setNewDetail] = useState("");

  const { addTodo, deleteTodo } = bindActionCreators(actionCreators, dispatch);


  const deleteEntry = (uniqueId: uuidv4) => {
    setIdForDeletion(uniqueId);
    setShowDeleteModal(true);
  }

  const cancelDeletion = () => {
    setIdForDeletion(null);
    setShowDeleteModal(false);
  }

  const addEntryFormProp = {
    summary: newSummary,
    detail: newDetail,
    changeSummary: setNewSummary,
    changeDetail: setNewDetail,
  }

  useEffect(() => {
    dispatch(actionCreators.getTodos());
  }, [dispatch]);

  return (
    <Wrapper w={80} h={100}>
      <Table
        rowData={todos.map((todo) => (
            {
                id: todo.uniqueId,
                summary: todo.summary,
                detail: todo.detail,
                isDone: todo.isDone ? "True" : "False",
                switch: (<ToggleSwitch switchUniqueId={todo.uniqueId as uuidv4} isDone={todo.isDone}/>),
                deleter: (<ActionLink color='red' message='delete' deleteFn={() => deleteEntry(todo.uniqueId as uuidv4)}/>)
            }
          ))}
        columnLabels={['Summary', 'Detail', 'Completed', 'Update', 'Remove Todo']}
        rowFields={['summary', 'detail', 'isDone', 'switch', 'deleter']}
      />

      <Button onClick={() => setShowAddModal(true)}>Add Request</Button>
      <Modal
        onCancel={() => {
          setShowAddModal(false);
          setNewDetail("");
          setNewSummary("");
        }}
        onOk={() => {
          setShowAddModal(false);
          addTodo({summary: newSummary, detail: newDetail, isDone: false});
        }}
        show={showAddModal}
        title="Add New Request"
        okText="Ok"
        cancelText="Cancel"
        children={<AddEntryForm {...addEntryFormProp} />}
        showFooter={!!(newSummary && newDetail)}
        showClose
       />
       <Modal
        onCancel={() => cancelDeletion()}
        onOk={() => idForDeletion !== null && deleteTodo(idForDeletion)}
        show={showDeleteModal}
        title="Delete Request"
        okText="Ok"
        cancelText="Cancel"
        children={<h4>Are you sure you want to delete this request?</h4>}
        showFooter
        showClose={false}
       />
    </Wrapper>
  );
};
