/**
  * Performs a debounce effect
  *
  * @param {*} func - The function passed to the debounce
  * @param {number} delay - The time in milliseconds to delay the debounce effect
  */
// function debounce(func, delay) {
//   let timer;
//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// }
//
// const searchInput = document.getElementById('search-contacts');
// const debouncedSearch = debounce((searchTerm) => {
//   htmx.trigger(searchInput, 'keyup', { requestParameters: { q: searchTerm } });
// }, 300);
//
// searchInput.addEventListener('keyup', (event) => {
//   const searchTerm = event.target.value.trim();
//   debouncedSearch(searchTerm);
// });

// document.addEventListener('htmx:response', function (event) {
//   if (event.detail.xhr.url.includes('/search-contacts')) {
//     const responseData = JSON.parse(event.detail.response);
//     Alpine.data('searchResults', responseData);
//   }
// });
