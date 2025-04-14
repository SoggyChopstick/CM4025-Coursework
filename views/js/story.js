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
      submitRating(selectedRating); // Submit the rating to the server
    }
  });

  function submitRating(rating) {
    fetch(`/rate/${storyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    })
      .then(response => response.json())
      .then(data => {
        ratingMessage.textContent = `Thanks for rating! Your rating: ${rating} stars.`;
        submitBtn.disabled = true; // Disable the submit button after submission
      })
      .catch(error => {
        console.error('Error:', error);
        ratingMessage.textContent = 'There was an error submitting your rating. Please try again.';
      });
  }
