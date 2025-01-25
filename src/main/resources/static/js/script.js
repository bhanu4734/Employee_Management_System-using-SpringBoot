document.addEventListener('DOMContentLoaded', function () {
    const actionSection = document.getElementById("action-section");

    // View Employees
    document.getElementById("view-employees").addEventListener("click", () => {
        fetch("http://localhost:8080/api/employees")
            .then((response) => response.json())
            .then((data) => {
                let table = `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Salary</th>
                                <th>Phone Number</th>
                                <th>Hire Date</th>
                                <th>Projects</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                data.forEach((employee) => {
                    table += `
                        <tr>
                            <td>${employee.id}</td>
                            <td>${employee.name}</td>
                            <td>${employee.position}</td>
                            <td>${employee.salary}</td>
                            <td>${employee.phone_number}</td>
                            <td>${employee.hire_date}</td>
                            <td>${employee.projects}</td>
                            <td>
                                <button class="btn edit-btn" data-id="${employee.id}">Edit</button>
                                <button class="btn delete-btn" data-id="${employee.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                table += "</tbody></table>";
                actionSection.innerHTML = table;

                // Attach Edit and Delete button actions
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener("click", (e) => {
                        const employeeId = e.target.getAttribute("data-id");
                        editEmployee(employeeId);
                    });
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener("click", (e) => {
                        const employeeId = e.target.getAttribute("data-id");
                        deleteEmployee(employeeId);
                    });
                });
            })
            .catch((error) => console.error("Error fetching employees:", error));
    });

    // Add Employee
    document.getElementById("add-employee").addEventListener("click", () => {
        actionSection.innerHTML = `
            <div class="form-container">
                <h2>Add New Employee</h2>
                <form id="add-employee-form">
                    <label for="employee-name">Name:</label>
                    <input type="text" id="employee-name" required>

                    <label for="employee-position">Position:</label>
                    <input type="text" id="employee-position" required>

                    <label for="employee-salary">Salary:</label>
                    <input type="number" id="employee-salary" required>

                    <label for="employee-phone">Phone Number:</label>
                    <input type="text" id="employee-phone" required>

                    <label for="employee-hire-date">Hire Date:</label>
                    <input type="date" id="employee-hire-date" required>

                    <label for="employee-projects">Projects (Comma separated):</label>
                    <input type="text" id="employee-projects" required>

                    <label for="employee-image">Profile Image:</label>
                    <input type="file" id="employee-image" accept="image/*">

                    <button type="submit">Add Employee</button>
                </form>
            </div>
        `;

        document.getElementById("add-employee-form").addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("employee-name").value;
            const position = document.getElementById("employee-position").value;
            const salary = document.getElementById("employee-salary").value;
            const phone = document.getElementById("employee-phone").value;
            const hireDate = document.getElementById("employee-hire-date").value;
            const projects = document.getElementById("employee-projects").value;
            const imageFile = document.getElementById("employee-image").files[0];

            const formData = new FormData();
            formData.append("name", name);
            formData.append("position", position);
            formData.append("salary", salary);
            formData.append("phone_number", phone);
            formData.append("hire_date", hireDate);
            formData.append("projects", projects);
            formData.append("image", imageFile);

            fetch("http://localhost:8080/api/employees", {
                method: "POST",
                body: formData,
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Employee added response:", data);
                if (data && data.name) {
                    alert(`Employee added: ${data.name}`);
                } else {
                    alert("Error adding employee.");
                }
                document.getElementById("view-employees").click();
            })
            .catch((error) => {
                console.error("Error adding employee:", error);
                alert("Error adding employee.");
            });
        });
    });

    // Edit Employee
    function editEmployee(employeeId) {
        fetch(`http://localhost:8080/api/employees/${employeeId}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data) {
                    alert("Employee not found.");
                    return;
                }

                actionSection.innerHTML = `
                    <div class="form-container">
                        <h2>Edit Employee</h2>
                        <form id="edit-employee-form">
                            <input type="hidden" id="employee-id" value="${data.id}">
                            <label for="employee-name">Name:</label>
                            <input type="text" id="employee-name" value="${data.name}" required>

                            <label for="employee-position">Position:</label>
                            <input type="text" id="employee-position" value="${data.position}" required>

                            <label for="employee-salary">Salary:</label>
                            <input type="number" id="employee-salary" value="${data.salary}" required>

                            <label for="employee-phone">Phone Number:</label>
                            <input type="text" id="employee-phone" value="${data.phone_number}" required>

                            <label for="employee-hire-date">Hire Date:</label>
                            <input type="date" id="employee-hire-date" value="${data.hire_date}" required>

                            <label for="employee-projects">Projects (Comma separated):</label>
                            <input type="text" id="employee-projects" value="${data.projects}" required>

                            <button type="submit">Update Employee</button>
                        </form>
                    </div>
                `;

                document.getElementById("edit-employee-form").addEventListener("submit", (e) => {
                    e.preventDefault();

                    const id = document.getElementById("employee-id").value;
                    const name = document.getElementById("employee-name").value;
                    const position = document.getElementById("employee-position").value;
                    const salary = document.getElementById("employee-salary").value;
                    const phone = document.getElementById("employee-phone").value;
                    const hireDate = document.getElementById("employee-hire-date").value;
                    const projects = document.getElementById("employee-projects").value;

                    fetch(`http://localhost:8080/api/employees/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id, name, position, salary, phone_number: phone, hire_date: hireDate, projects }),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        alert(`Employee updated: ${data.name}`);
                        document.getElementById("view-employees").click();
                    })
                    .catch((error) => console.error("Error updating employee:", error));
                });
            })
            .catch((error) => console.error("Error fetching employee data:", error));
    }

    // Delete Employee
    function deleteEmployee(employeeId) {
        const confirmDelete = confirm("Are you sure you want to delete this employee?");
        if (confirmDelete) {
            fetch(`http://localhost:8080/api/employees/${employeeId}`, {
                method: "DELETE",
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete employee');
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.name) {
                    alert(`Employee deleted: ${data.name}`);
                } else {
                    alert("Employee deleted successfully.");
                }

                const rowToDelete = document.querySelector(`button[data-id="${employeeId}"]`).closest('tr');
                if (rowToDelete) {
                    rowToDelete.remove();
                }
            })
            .catch((error) => {
                console.error("Error deleting employee:", error);
                alert("Error deleting employee. Please try again.");
            });
        }
    }

    // Clear Button
    document.getElementById("clear").addEventListener("click", () => {
        actionSection.innerHTML = '';
    });
});
