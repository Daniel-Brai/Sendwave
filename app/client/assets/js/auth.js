const logout_btn = document.querySelector('#logout-btn');

logout_btn.addEventListener('click', async () => {
  await fetch('/api/v1/authentication/logout').then((res) => res.json()).catch((error) => console.log(error))
})
