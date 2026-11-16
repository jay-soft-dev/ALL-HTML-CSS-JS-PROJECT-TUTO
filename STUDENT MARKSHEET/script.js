// 1. Backend Data: Array of Objects containing student records
let students = [
    { name: "Jay Pawar", degree: "BCA Science", rank: 2, score: 9.33 },
    { name: "Aashmeera Sheikh", degree: "BCA Science", rank: 1, score: 9.88 },
    { name: "Om Mane", degree: "BCA Science", rank: 3, score: 8.69 },
    { name: "Shruti Pachapote", degree: "BCA Science", rank: 4, score: 8.12 }
];

// Selecting DOM elements by their IDs
let btn = document.getElementById("load-btn");
let container = document.getElementById("cards-container");

// 2. Event listener to render student cards on button click
btn.addEventListener("click", function() {
    
    // Clear previous HTML content inside the container
    container.innerHTML = "";

    // Loop through the array to generate HTML cards dynamically
    for (let i = 0; i < students.length; i++) {
        container.innerHTML += `
            <div class="card">
                <h3>${students[i].name}</h3>
                <p><strong>Course:</strong> ${students[i].degree}</p>
                <p><strong>Rank:</strong> #${students[i].rank}</p>
                <p><strong>CGPA:</strong> ${students[i].score}</p>
                <p class="pass">Status: Passed ✅</p>
            </div>
        `;
    }
});