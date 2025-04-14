document.addEventListener('DOMContentLoaded', function () {
    const starContainer = document.getElementById('starContainer');
    const stars = starContainer.getElementsByClassName('star');
    const submitBtn = document.getElementById('submitRatingBtn');
    const ratingInput = document.getElementById('ratingInput');
    const ratingMessage = document.getElementById('ratingMessage');
  
    let selectedRating = null;
  
    function updateStars(rating) {
      Array.from(stars).forEach((star, index) => {
        star.textContent = index < rating ? '⭐' : '☆';
      });
    }
  
    Array.from(stars).forEach((star, index) => {
      star.addEventListener('click', function () {
        selectedRating = index + 1;
        updateStars(selectedRating);
        ratingInput.value = selectedRating; // Update the hidden input
        submitBtn.disabled = false;
      });
    });
  
    // Optional: Add client-side validation on form submission
    document.getElementById('ratingForm').addEventListener('submit', function (e) {
      if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
        e.preventDefault();
        alert('Please select a valid rating between 1 and 5 stars.');
      }
    });
  });
  