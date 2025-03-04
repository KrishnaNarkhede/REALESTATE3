const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');  
const dotenv = require('dotenv'); // Import dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 8080; // Use PORT from .env or default to 8080

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to create a new MySQL connection
function createDbConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,  
        password: process.env.DB_PASSWORD,  
        database: process.env.DB_DATABASE
    });
}

// Handle POST request for booking appointment form submission
app.post('/book_appointment', (req, res) => {
    const { name, email, mobile, service_type, appointment_date, appointment_time, message } = req.body;

    const sql = "INSERT INTO appointments (name, email, mobile, service_type, appointment_date, appointment_time, message) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    const db = createDbConnection(); // Create a new connection for this request

    db.query(sql, [name, email, mobile, service_type, appointment_date, appointment_time, message], (err, result) => {
        db.end(); // Close the connection
        if (err) {
            console.error("Error executing query", err);
            res.status(500).send(`Error booking appointment: ${err}`);
        } else {
            res.send("Appointment booked successfully!");
        }
    });
});

// Handle POST request for contact form submission
app.post('/process_contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    const sql = "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)";
    
    const db = createDbConnection(); // Create a new connection for this request

    db.query(sql, [name, email, subject, message], (err, result) => {
        db.end(); // Close the connection
        if (err) {
            console.error("Error executing query", err);
            res.status(500).send(`Error submitting message: ${err}`);
        } else {
            res.send("Message sent successfully!");
        }
    });
});

// Example GET request for testing
app.get('/testget', (req, res) => {
    res.send("I am live on GET");
});

// Example POST request for testing
app.post('/testpost', (req, res) => {
    res.send("I am live on POST");
});

// Serve the main HTML file for all other GET requests
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Adjust the path as necessary
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
