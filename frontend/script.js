const API_URL = "http://localhost:5002/api";

const attendanceBody = document.getElementById("attendanceBody");
const attendanceDate = document.getElementById("attendanceDate");
const message = document.getElementById("message");

const loadAttendanceBtn = document.getElementById("loadAttendanceBtn");
const saveAttendanceBtn = document.getElementById("saveAttendanceBtn");
const clearBtn = document.getElementById("clearBtn");

const reportMonth = document.getElementById("reportMonth");
const loadReportBtn = document.getElementById("loadReportBtn");
const reportBody = document.getElementById("reportBody");

const exportCsvBtn = document.getElementById("exportCsvBtn");

const periods = 7;

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();

    const formattedDate =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

    attendanceDate.value = formattedDate;

    reportMonth.value =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0");

    loadStudents();
});

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);

        if (!response.ok) {
            throw new Error("Failed to load students.");
        }

        const students = await response.json();

        attendanceBody.innerHTML = "";

        students.forEach((student) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                ${createPeriodButtons(student.id)}
            `;

            attendanceBody.appendChild(row);
        });

        await loadExistingAttendance();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

function createPeriodButtons(studentId) {
    let html = "";

    for (let period = 1; period <= periods; period++) {
        html += `
            <td>
                <button
                    class="attendance-btn"
                    data-student="${studentId}"
                    data-period="${period}"
                    data-status="P"
                    onclick="setAttendance(this, 'P')"
                >
                    P
                </button>

                <button
                    class="attendance-btn"
                    data-student="${studentId}"
                    data-period="${period}"
                    data-status="A"
                    onclick="setAttendance(this, 'A')"
                >
                    A
                </button>
            </td>
        `;
    }

    return html;
}

function setAttendance(button, status) {
    const studentId = button.dataset.student;
    const period = button.dataset.period;

    const buttons = document.querySelectorAll(
        `[data-student="${studentId}"][data-period="${period}"]`
    );

    buttons.forEach((btn) => {
        btn.classList.remove(
            "active-present",
            "active-absent"
        );

        delete btn.dataset.selected;
    });

    if (status === "P") {
        button.classList.add("active-present");
    } else {
        button.classList.add("active-absent");
    }

    button.dataset.selected = status;
}

async function loadExistingAttendance() {
    const date = attendanceDate.value;

    if (!date) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/attendance?date=${date}`
        );

        if (!response.ok) {
            throw new Error("Failed to load attendance.");
        }

        const records = await response.json();

        records.forEach((record) => {
            const buttons = document.querySelectorAll(
                `[data-student="${record.student_id}"][data-period="${record.period}"]`
            );

            buttons.forEach((button) => {
                button.classList.remove(
                    "active-present",
                    "active-absent"
                );

                delete button.dataset.selected;

                if (button.dataset.status === record.status) {
                    if (record.status === "P") {
                        button.classList.add("active-present");
                    } else {
                        button.classList.add("active-absent");
                    }

                    button.dataset.selected = record.status;
                }
            });
        });

    } catch (error) {
        showMessage(error.message, "error");
    }
}

loadAttendanceBtn.addEventListener("click", async () => {
    await loadStudents();
    showMessage("Attendance loaded successfully.", "success");
});

attendanceDate.addEventListener("change", async () => {
    await loadExistingAttendance();
});

saveAttendanceBtn.addEventListener("click", async () => {
    const date = attendanceDate.value;

    if (!date) {
        showMessage("Please select a date.", "error");
        return;
    }

    const selectedButtons = document.querySelectorAll(
        ".attendance-btn[data-selected]"
    );

    if (selectedButtons.length === 0) {
        showMessage(
            "Please mark attendance before saving.",
            "error"
        );
        return;
    }

    const attendanceRecords = [];

    selectedButtons.forEach((button) => {
        attendanceRecords.push({
            student_id: Number(button.dataset.student),
            attendance_date: date,
            period: Number(button.dataset.period),
            status: button.dataset.selected
        });
    });

    try {
        for (const record of attendanceRecords) {
            const response = await fetch(
                `${API_URL}/attendance`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(record)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 409) {
                    continue;
                }

                throw new Error(
                    errorData.error || "Failed to save attendance."
                );
            }
        }

        showMessage(
            "Attendance saved successfully.",
            "success"
        );

    } catch (error) {
        showMessage(error.message, "error");
    }
});

clearBtn.addEventListener("click", () => {
    const buttons = document.querySelectorAll(
        ".attendance-btn"
    );

    buttons.forEach((button) => {
        button.classList.remove(
            "active-present",
            "active-absent"
        );

        delete button.dataset.selected;
    });

    showMessage(
        "Attendance selections cleared.",
        "success"
    );
});

loadReportBtn.addEventListener("click", async () => {
    const month = reportMonth.value;

    if (!month) {
        showMessage("Please select a month.", "error");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/monthly-report?month=${month}`
        );

        if (!response.ok) {
            throw new Error("Failed to generate report.");
        }

        const report = await response.json();

        reportBody.innerHTML = "";

        report.forEach((student) => {
            const row = document.createElement("tr");

            let status;
            let statusClass;

            if (student.working_periods === 0) {
                status = "No Attendance";
                statusClass = "";
            } else if (student.low_attendance) {
                status = "Low Attendance";
                statusClass = "low-attendance";
            } else {
                status = "Good Attendance";
                statusClass = "good-attendance";
            }

            row.innerHTML = `
                <td>${student.student_id}</td>
                <td>${student.name}</td>
                <td>${student.working_periods}</td>
                <td>${student.present}</td>
                <td>${student.absent}</td>
                <td>${student.percentage}%</td>
                <td class="${statusClass}">
                    ${status}
                </td>
            `;

            reportBody.appendChild(row);
        });

    } catch (error) {
        showMessage(error.message, "error");
    }
});

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;

    setTimeout(() => {
        message.textContent = "";
        message.className = "";
    }, 4000);
}

exportCsvBtn.addEventListener("click", async () => {
    const month = reportMonth.value;

    if (!month) {
        showMessage("Please select a month.", "error");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/monthly-report?month=${month}`
        );

        if (!response.ok) {
            throw new Error("Failed to export report.");
        }

        const report = await response.json();

        if (report.length === 0) {
            showMessage(
                "No report data available.",
                "error"
            );
            return;
        }

        const headers = [
            "Student ID",
            "Student Name",
            "Class",
            "Working Periods",
            "Present",
            "Absent",
            "Percentage",
            "Status"
        ];

        const rows = report.map((student) => {
            let status;

            if (student.working_periods === 0) {
                status = "No Attendance";
            } else if (student.low_attendance) {
                status = "Low Attendance";
            } else {
                status = "Good Attendance";
            }

            return [
                student.student_id,
                student.name,
                student.class_name,
                student.working_periods,
                student.present,
                student.absent,
                `${student.percentage}%`,
                status
            ];
        });

        const csvContent = [
            headers,
            ...rows
        ]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value).replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `attendance-report-${month}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showMessage(
            "CSV report exported successfully.",
            "success"
        );

    } catch (error) {
        showMessage(error.message, "error");
    }
});