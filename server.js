// Import the express module and other necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create an instance of an express app
const app = express();

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve the signup.html file when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Handle the signup form submission
app.post('/signup', (req, res) => {
    const { name, email, password, phone } = req.body;

    // Create an object to store the data
    const newUser = {
        name,
        email,
        password,
        phone
    };

    // Define the path to the JSON file
    const filePath = path.join(__dirname, 'users.json');

    // Read the existing data from the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('An error occurred while saving the data.');
        }

        // Parse existing data or initialize an empty array
        const users = data ? JSON.parse(data) : [];

        // Add the new user to the array
        users.push(newUser);

        // Write the updated array back to the JSON file
        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('An error occurred while saving the data.');
            }

            res.send('Thank you for signing up, ${name}!');
        });
    });
});

// Define the port number
const port = 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log('Server is running on http://localhost:${port}');
});