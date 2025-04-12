function submitStory() {
    // Get the values from the input fields
    const name = document.getElementById('name').value.trim();
    const story = document.getElementById('story').value.trim();

    // Default to "Anonymous" if no name is provided
    const author = name === '' ? 'Anonymous' : name;

    // Output to the browser console
    console.log('Story by: ' + author);
    console.log('Story: ' + story);

    // Optionally, you could also alert the user or show a success message
    alert('Story submitted! Check the console.');
}