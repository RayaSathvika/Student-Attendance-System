const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./attendance.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            class_name TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            attendance_date TEXT NOT NULL,
            period INTEGER NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('P', 'A')),
            UNIQUE(student_id, attendance_date, period),
            FOREIGN KEY(student_id) REFERENCES students(id)
        )
    `);

    const students = [
        [101, "Student 101", "CSE (AI & ML)"],
        [102, "Student 102", "CSE (AI & ML)"],
        [103, "Student 103", "CSE (AI & ML)"],
        [104, "Student 104", "CSE (AI & ML)"],
        [105, "Student 105", "CSE (AI & ML)"]
    ];

    const stmt = db.prepare(`
        INSERT OR IGNORE INTO students (id, name, class_name)
        VALUES (?, ?, ?)
    `);

    students.forEach((student) => {
        stmt.run(student);
    });

    stmt.finalize();
});

app.get("/", (req, res) => {
    res.json({
        message: "Student Attendance Management System API is running"
    });
});

app.get("/api/students", (req, res) => {
    db.all(
        "SELECT * FROM students ORDER BY id",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});

app.post("/api/attendance", (req, res) => {
    const { student_id, attendance_date, period, status } = req.body;

    if (
        !student_id ||
        !attendance_date ||
        !period ||
        !status
    ) {
        return res.status(400).json({
            error: "All attendance fields are required."
        });
    }

    if (!["P", "A"].includes(status)) {
        return res.status(400).json({
            error: "Status must be P or A."
        });
    }

    db.run(
        `
        INSERT INTO attendance
        (student_id, attendance_date, period, status)
        VALUES (?, ?, ?, ?)
        `,
        [student_id, attendance_date, period, status],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        error: "Attendance already exists for this student, date and period."
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Attendance saved successfully.",
                attendance_id: this.lastID
            });
        }
    );
});

app.get("/api/attendance", (req, res) => {
    const { date } = req.query;

    let query = `
        SELECT
            attendance.id,
            attendance.student_id,
            students.name,
            students.class_name,
            attendance.attendance_date,
            attendance.period,
            attendance.status
        FROM attendance
        JOIN students
        ON attendance.student_id = students.id
    `;

    const params = [];

    if (date) {
        query += " WHERE attendance.attendance_date = ?";
        params.push(date);
    }

    query += `
        ORDER BY attendance.student_id, attendance.period
    `;

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

app.get("/api/monthly-report", (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({
            error: "Month is required. Example: 2026-10"
        });
    }

    db.all(
        `
        SELECT
            students.id AS student_id,
            students.name,
            students.class_name,
            COUNT(attendance.id) AS working_periods,
            SUM(
                CASE
                    WHEN attendance.status = 'P' THEN 1
                    ELSE 0
                END
            ) AS present,
            SUM(
                CASE
                    WHEN attendance.status = 'A' THEN 1
                    ELSE 0
                END
            ) AS absent
        FROM students
        LEFT JOIN attendance
        ON students.id = attendance.student_id
        AND substr(attendance.attendance_date, 1, 7) = ?
        GROUP BY students.id
        ORDER BY students.id
        `,
        [month],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const report = rows.map((row) => {
                const workingPeriods = row.working_periods || 0;
                const present = row.present || 0;
                const absent = row.absent || 0;

                const percentage =
                    workingPeriods > 0
                        ? ((present / workingPeriods) * 100).toFixed(2)
                        : "0.00";

                return {
                    student_id: row.student_id,
                    name: row.name,
                    class_name: row.class_name,
                    working_periods: workingPeriods,
                    present: present,
                    absent: absent,
                    percentage: Number(percentage),
                    low_attendance: Number(percentage) < 75
                };
            });

            res.json(report);
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});