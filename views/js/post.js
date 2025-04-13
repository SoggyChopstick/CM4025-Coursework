  const storyInput = document.getElementById('storyInput');
  const wordCountDisplay = document.getElementById('wordCount');
  const submitBtn = document.getElementById('submitBtn');
  const storyForm = document.getElementById('storyForm');

  function updateWordCount(){
    const text = storyInput.value.trim();
    const wordCount = text === "" ? 0 : text.split(/\s+/).length;
    
    wordCountDisplay.textContent = wordCount;
    
    if (wordCount > 500) {
      submitBtn.disabled = true;
      wordCountDisplay.style.color = 'red';
    } else {
      submitBtn.disabled = false;
      wordCountDisplay.style.color = 'black';
    }
  }
  
  storyInput.addEventListener('input', updateWordCount);

  storyForm.addEventListener('submit', function (event) {
    const story = storyInput.value.trim();
    const wordCount = story == "" ? 0 : story.split(/\s+/).length;

    if (wordCount === 0) {
      alert("Please write something before submitting!");
      return false;
    }

    if (wordCount > 500) {
      alert("Your story is too long! (Max 500 words)");
      return false;
    }

    return true;
  });
