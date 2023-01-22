/*
    0 : login && register
    1 : game_menu && game
    2 : dashboard
    3 : ranking
    4 : setting
*/
function ChangePage(page) {
  console.log(page);
  if (page == 0) {
    document.body.innerHTML = `<login-page></login-page>`;
  } else if (page == 1) {
    document.body.innerHTML = `<game-menu></game-menu>`;
  } else if (page == 2) {
  } else if (page == 3) {
  } else if (page == 4) {
  }
}

export default ChangePage;
