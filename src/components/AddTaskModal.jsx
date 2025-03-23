import React, { useState, useEffect } from "react";

const AddTaskModal = ({ onClose }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("2024-11-23");
  const [assignee, setAssignee] = useState("");
  const [project, setProject] = useState("");
  const [attachment, setAttachment] = useState(null); // State for file attachment
  const [projects, setProjects] = useState([]); // State to store fetched projects
  const [assignees, setAssignees] = useState([]); // State to store fetched assignees

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://api.dyzo.ai/project/company/2/", {
          headers: {
            Authorization: "Bearer YOUR_AUTH_TOKEN", // Replace with your auth token
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []); // Assuming the response contains a `projects` array
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array to fetch data on mount

  // Fetch assignees from the API
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await fetch("https://api.dyzo.ai/employee/list/2/");
        if (response.ok) {
          const data = await response.json();
          setAssignees(data.data || []); // Assuming the response contains an `employees` array
        } else {
          console.error("Failed to fetch assignees");
        }
      } catch (error) {
        console.error("Error fetching assignees:", error);
      }
    };

    fetchAssignees();
  }, []); // Empty dependency array to fetch data on mount

  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]); // Get the selected file
  };

  const uploadAttachment = async (taskId) => {
    if (!attachment) return null; // If no attachment, skip the upload

    const uploadUrl = `https://api.dyzo.ai/api/task/${taskId}/upload/`;
    const formData = new FormData();
    formData.append("file", attachment);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: "Bearer YOUR_AUTH_TOKEN", // Replace with your auth token
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.file_url; // Assuming the API returns a URL for the uploaded file
      } else {
        alert("Failed to upload attachment");
        return null;
      }
    } catch (error) {
      console.error("Error uploading attachment:", error);
      return null;
    }
  };

  const handleAddTask = async () => {
    // Step 1: Create the task
    const taskData = {
      taskName,
      description,
      dueDate,
      userId: assignee,
      projectId: project,
      collaborators: [assignee], // Assuming assignees as collaborators
    };

    const taskUrl = "https://api.dyzo.ai/create-task/192/";

    try {
      const response = await fetch(taskUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer YOUR_AUTH_TOKEN", // Replace with your auth token
        },
        body: JSON.stringify(taskData), // Send JSON payload
      });

      if (response.ok) {
        const data = await response.json();
        const taskId = data.taskId; // Get the taskId from the response
        alert("Task added successfully!");

        // Step 2: Upload the attachment if it exists
        if (attachment) {
          const fileUrl = await uploadAttachment(taskId);
          if (fileUrl) {
            console.log("Attachment uploaded successfully:", fileUrl);
          }
        }

        // Reset the form
        setTaskName("");
        setDescription("");
        setAssignee("");
        setProject("");
        setAttachment(null); // Reset attachment
        onClose();
      } else {
        alert("Failed to add task!");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Task</h3>
        <input
          type="text"
          placeholder="Enter task name and hit enter to make multiple tasks"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 mb-4 focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div className="flex justify-between gap-2 mb-4">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-1/3 p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-1/3 p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 capitalize"
          >
            <option value="">Select Assignee</option>
            {assignees.map((emp) => (
              <option key={emp._id} value={emp._id} className="capitalize">
                {`${emp.first_name} ${emp.last_name}`}
              </option>
            ))}
          </select>

          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="w-1/3 p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Project</option>
            {projects.map((proj) => (
              <option
                className="text-transform: capitalize;"
                key={proj._id}
                value={proj._id}
              >
                {proj.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Attachment (optional)
          </label>
          <input
            type="file"
            onChange={handleAttachmentChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
        <button
          onClick={handleAddTask}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 mb-2"
        >
          Add Task
        </button>
        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddTaskModal;
