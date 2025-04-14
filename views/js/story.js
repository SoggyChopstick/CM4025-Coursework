 // Get references to elements on the page
 const starContainer = document.getElementById('starContainer');
 const stars = starContainer.getElementsByClassName('star');
 const submitBtn = document.getElementById('submitRatingBtn');
 const ratingInput = document.getElementById('ratingInput'); // Hidden input to store the selected rating
 const ratingMessage = document.getElementById('ratingMessage');

 let selectedRating = null; // Variable to store the selected rating

 // Function to visually update the star icons
 function updateStars(rating) {
     Array.from(stars).forEach((star, index) => {
         // Fill in stars up to the selected rating
         star.textContent = index < rating ? '⭐' : '☆';
     });
 }

 // Add click event listeners to each star
 Array.from(stars).forEach((star, index) => {
     star.addEventListener('click', function () {
         selectedRating = index + 1; // Ratings are 1-based
         updateStars(selectedRating); // Update the star display
         ratingInput.value = selectedRating; // Store rating in the hidden input
         submitBtn.disabled = false; // Enable the submit button
     });
 });

 // Client-side validation before form submission
 document.getElementById('ratingForm').addEventListener('submit', function (e) {
     // Prevent submission if no valid rating was selected
     if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
         e.preventDefault();
         alert('Please select a valid rating between 1 and 5 stars.');
     }
 });