const starContainer = document.getElementById('starContainer');
  const stars = starContainer.getElementsByClassName('star');
  const submitBtn = document.getElementById('submitRatingBtn');
  const ratingMessage = document.getElementById('ratingMessage');
  const storyId = starContainer.getAttribute('data-story-id');
  
  let selectedRating = null; // Store the selected rating

  // Function to update the star icons based on the rating
  function updateStars(rating) {
    Array.from(stars).forEach((star, index) => {
      star.textContent = index < rating ? '⭐' : '☆';
    });
  }

  // Add click event listener for stars
  Array.from(stars).forEach((star, index) => {
    star.addEventListener('click', function () {
      selectedRating = index + 1; // Set the selected rating
      updateStars(selectedRating); // Update the star icons
      submitBtn.disabled = false; // Enable the submit button
    });
  });

  // Submit rating when the submit button is clicked
  submitBtn.addEventListener('click', function () {
    if (selectedRating) {
        document.getElementById('ratingForm').submit(); 
    }
  });
  
  function selectRating(rating) {
    selectedRating = rating;
    // Update UI to show selected rating
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      if (parseInt(star.dataset.value) <= rating) {
        star.textContent = '⭐';  // Filled star
      } else {
        star.textContent = '☆';  // Empty star
      }
    });
  }
  