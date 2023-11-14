const searchTemplInput = document.getElementById('search-templates');
const resultBox = document.getElementById('search-results-templates');

function showResults(data, type) {
  if (type === 'success') {
    if (data.length === 0) {
      resultBox.innerHTML = `<div id="no-results" class="text-lg text-center mt-4 mb-4 font-normal">🔖 No contacts found</div>`;
    } else if (data.length >= 1) {
      resultBox.innerHTML = '';
      for (const result of data) {
        const searchResultElement = document.createElement('div');
        searchResultElement.classList.add(
          'flex',
          'flex-col',
          'space-y-2',
          'px-4',
          'py-3',
          'rounded-md',
          'bg-blue-100',
          'mb-4',
        );

        const nameElement = document.createElement('span');
        nameElement.classList.add('text-gray-500', 'text-sm');
        nameElement.textContent = result.name;
        
        const contentElement = document.createElement('span');
        contentElement.classList.add('text-gray-500', 'text-sm');
        contentElement.textContent = result.content;

        searchResultElement.appendChild(nameElement);
        searchResultElement.appendChild(contentElement);
        resultBox.appendChild(searchResultElement);
      }
    }
  } else if (type === 'error') {
    messageRenderer.innerHTML = `
                <div id="toast-warning" class="flex items-center mx-auto w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                   <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-primary-500 bg-primary-100 rounded-lg dark:bg-primary-700 dark:text-primary-200">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Warning icon</span>
                   </div> 
                   <div id="message-box" class="ml-3 text-sm font-normal">${data}</div>
                   <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                        <span class="sr-only">Close</span>
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                   </button>
                </div>
        `;
  }
}

searchTemplInput.addEventListener('htmx:afterRequest', function (event) {
  const response = JSON.parse(event.detail.xhr.response);

  if (event.detail.xhr.status === 200) {
    showResults(response, 'success');
  } else if (
    response['message'] &&
    Array.isArray(message) &&
    message.length >= 0
  ) {
    showResults(response['message'][0], 'error');
  } else {
    showResults(response['message'], 'error');
  }
});