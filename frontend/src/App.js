// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { format } from 'date-fns';
import { API_SERVER_ADDRESS } from "./server";

export function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
  });

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handleTaskClick = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setSelectedTask(task);
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((t) => t.id === taskId);
    setEditedTask({ ...taskToEdit });
    setShowEditModal(true);
  };

  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedTask(null);
  };

  const handleUpdateTask = async () => {
    try {
      const updatedData = {};
      if (editedTask.title !== tasks.find((t) => t.id === editedTask.id).title) {
        updatedData.title = editedTask.title;
      }
      if (editedTask.description !== tasks.find((t) => t.id === editedTask.id).description) {
        updatedData.description = editedTask.description;
      }
      if (editedTask.due_date !== tasks.find((t) => t.id === editedTask.id).due_date) {
        updatedData.due_date = editedTask.due_date;
      }

      await fetch(`${API_SERVER_ADDRESS}/task/${editedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      fetchTasks();
      handleCloseEditModal();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = (taskId, status) => {
    setTaskStatus((prevState) => ({
      ...prevState,
      [taskId]: status,
    }));
  };

  useEffect(() => {
    const initialStatus = {};
    tasks.forEach((task) => {
      initialStatus[task.id] = task.status;
    });
    setTaskStatus(initialStatus);
  }, [tasks]);


  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_SERVER_ADDRESS}/task`);
      const data = await response.json();
      console.log(data);
      setTasks(data.body);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      await fetch(`${API_SERVER_ADDRESS}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      fetchTasks();
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskStatusChange = async (taskId) => {
    try {
      await fetch(`${API_SERVER_ADDRESS}/task/${taskId}/status`, {
        method: 'PUT',
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`${API_SERVER_ADDRESS}/task/${taskId}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="App">
      <h1>Add your tasks!!</h1>
      <Button variant="primary" onClick={handleModalShow}>
        + Add
      </Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTask.due_date}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const utcDate = date.toISOString();
                  setNewTask({ ...newTask, due_date: utcDate });
                }} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editedTask ? editedTask.title : ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedTask ? editedTask.description : ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={editedTask ? editedTask.due_date : ''}
                onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="task-details">
        <ListGroup>
          {tasks.map((task) => (
            <ListGroup.Item
              key={task.id}
              onClick={() => handleTaskClick(task.id)}
              style={{
                textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={taskStatus[task.id] === 'COMPLETED'}
                onChange={() => {
                  const newStatus = taskStatus[task.id] === 'COMPLETED' ? 'TO_DO' : 'COMPLETED';
                  updateTaskStatus(task.id, newStatus);
                  handleTaskStatusChange(task.id);
                }} />
              {task.title}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {selectedTask && (
          <div className="task-details">
            <h2>Task Details</h2>
            <h3>Title: {selectedTask.title}</h3>
            <p>Description: {selectedTask.description}</p>
            <p>Due Date: {format(new Date(selectedTask.due_date), 'dd-MM-yyyy')}</p>
            <Button onClick={() => handleEditTask(selectedTask.id)}>Edit Task</Button>
            <Button onClick={() => handleDeleteTask(selectedTask.id)}>Delete Task</Button>
            <Button onClick={handleCloseTaskDetails}>Close</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
