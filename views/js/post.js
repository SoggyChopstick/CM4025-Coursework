// Get references to elements in the form
const storyInput = document.getElementById('storyInput');       // Textarea for the story
const wordCountDisplay = document.getElementById('wordCount');  // Element to show the current word count
const submitBtn = document.getElementById('submitBtn');         // Submit button
const storyForm = document.getElementById('storyForm');         // The form element

// Function to update the word count display and enforce word limit
function updateWordCount() {
  const text = storyInput.value.trim();                         // Remove leading/trailing whitespace
  const wordCount = text === "" ? 0 : text.split(/\s+/).length; // Count words by splitting on spaces

  wordCountDisplay.textContent = wordCount;                     // Update count on the page

  // If word limit is exceeded, disable the submit button and change text color
  if (wordCount > 500) {
    submitBtn.disabled = true;
    wordCountDisplay.style.color = 'red';
  } else {
    submitBtn.disabled = false;
    wordCountDisplay.style.color = 'black';
  }
}

// Run word count update on every input change
storyInput.addEventListener('input', updateWordCount);

// Validate the story before submission
storyForm.addEventListener('submit', function (event) {
  const story = storyInput.value.trim();                        // Get trimmed story text
  const wordCount = story === "" ? 0 : story.split(/\s+/).length;

  // Block submission if the story is empty
  if (wordCount === 0) {
    alert("Please write something before submitting!");
    event.preventDefault(); // Prevent form submission
    return false;
  }

  // Block submission if the story exceeds 500 words
  if (wordCount > 500) {
    alert("Your story is too long! (Max 500 words)");
    event.preventDefault(); // Prevent form submission
    return false;
  }

  return true; // Allow submission if validation passes
});
