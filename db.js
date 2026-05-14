// db.js
// Mock database representing our school's parent and student records
const fs = require('fs');
const path = require('path');

// Mock database representing our school's parent and student records

const mockDatabase = [
    {
        parentName: "Rahul",
        phoneNumber: "1234567890",
        studentName: "Aarav",
        class: "5th A",
        feeStatus: "Paid",
        attendance: "95%",
        recentRemarks: "Excellent in Mathematics."
    },
    {
        parentName: "Priya",
        phoneNumber: "9876543210",
        studentName: "Kavya",
        class: "8th B",
        feeStatus: "Pending (Rs. 2000)",
        attendance: "82%",
        recentRemarks: "Needs to focus on Science."
    },
    {
        parentName: "Amit",
        phoneNumber: "5555555555",
        studentName: "Rohan",
        class: "10th C",
        feeStatus: "Paid",
        attendance: "99%",
        recentRemarks: "Selected for the school cricket team."
    }
];

/**
 * Function to check parent details in our mock database.
 * @param {string} parentName - The name of the parent.
 * @param {string} phoneNumber - The 10-digit phone number.
 * @returns {object|null} - Returns the student record if found, else null.
 */
function fetchStudentDetails(parentName, phoneNumber) {
    console.log(`[DB Query] Checking for ${parentName} with number ${phoneNumber}`);
    const record = mockDatabase.find(
        (entry) => 
            entry.parentName.toLowerCase() === parentName.toLowerCase() && 
            entry.phoneNumber === phoneNumber
    );

    if (record) {
        return {
            success: true,
            data: record
        };
    } else {
        return {
            success: false,
            message: "No record found for the provided name and phone number."
        };
    }
}

/**
 * Function to log unanswered questions to a JSON file so admins can review.
 */
function logUnansweredQuery(query, parentName = "Unknown", phoneNumber = "Unknown") {
    console.log(`[DB Action] Logging unanswered query: ${query}`);
    const logPath = path.join(__dirname, 'unanswered_queries.json');
    let queries = [];
    
    if (fs.existsSync(logPath)) {
        try {
            queries = JSON.parse(fs.readFileSync(logPath, 'utf8'));
        } catch(e) {
            queries = [];
        }
    }
    
    queries.push({
        timestamp: new Date().toISOString(),
        query,
        parentName,
        phoneNumber,
        status: "Pending" // Admins can change this to "Answered" later
    });
    
    fs.writeFileSync(logPath, JSON.stringify(queries, null, 2));
    
    return { 
        success: true, 
        message: "Aapka sawal save kar liya gaya hai. Admin jald hi iska jawab system mein add kar lenge." 
    };
}

module.exports = {
    fetchStudentDetails,
    logUnansweredQuery
};
