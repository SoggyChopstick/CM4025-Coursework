document.addEventListener("DOMContentLoaded", function () {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('ratingInput');
    const ratingMessage = document.getElementById('ratingMessage');
    const ratingForm = document.getElementById('ratingForm');
    
    // Handle click events on the stars
    stars.forEach(star => {
      star.addEventListener('click', function () {
        const selectedRating = parseInt(star.getAttribute('data-value'));
        
        // Update the stars display
        stars.forEach(s => {
          if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
            s.textContent = '⭐';
          } else {
            s.textContent = '☆';
          }
        });
  
        // Set the selected rating in the hidden input field
        ratingInput.value = selectedRating;
  
        // Show a message that the rating is selected
        ratingMessage.textContent = `You selected ${selectedRating} stars`;
  
        // Automatically submit the form
        ratingForm.submit();
      });
    });
  });