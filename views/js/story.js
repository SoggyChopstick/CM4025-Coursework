document.addEventListener("DOMContentLoaded", () => {
    const starContainer = document.getElementById("starContainer");
    const stars = starContainer.querySelectorAll(".star");
    const ratingMessage = document.getElementById("ratingMessage");
    const storyId = starContainer.getAttribute("data-story-id");
  
    let selectedRating = 0;
  
    stars.forEach(star => {
      // Hover effects
      star.addEventListener("mouseover", () => {
        const value = parseInt(star.getAttribute("data-value"));
        highlightStars(value);
      });
  
      star.addEventListener("mouseout", () => {
        highlightStars(selectedRating);
      });
  
      // Click to rate
      star.addEventListener("click", async () => {
        selectedRating = parseInt(star.getAttribute("data-value"));
        highlightStars(selectedRating);
  
        try {
          const res = await fetch(`/rate/${storyId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `rating=${selectedRating}`
          });
  
          if (res.ok) {
            ratingMessage.textContent = "Thanks for rating!";
            ratingMessage.style.color = "green";
          } else {
            ratingMessage.textContent = "Error submitting rating.";
            ratingMessage.style.color = "red";
          }
        } catch (err) {
          ratingMessage.textContent = "Error connecting to server.";
          ratingMessage.style.color = "red";
        }
      });
    });
  
    function highlightStars(rating) {
      stars.forEach(star => {
        const value = parseInt(star.getAttribute("data-value"));
        star.classList.toggle("selected", value <= rating);
      });
    }
  });