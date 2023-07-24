const searchForm = document.querySelector('#search-form');
let card = document.querySelector('.user-card');

searchForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const searchTerm = searchForm.elements.user.value;
	searchForm.elements.user.value = '';
	try {
		const user = await getUser(searchTerm);
		if (card && card.parentNode === document.body) {
			card.remove(); // Remove the previous card from the DOM
		}
		card = makeUserCard(user); // Reassign 'card' with the new card element

		card.style.opacity = '1';
	} catch (error) {
		console.error(error);
		// Handle error here, e.g., show an error message to the user
	}
});

const getUser = async (searchTerm) => {
	const response = await fetch(`https://api.github.com/users/${searchTerm}`);
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}
	const userData = await response.json();
	const projectsResponse = await fetch(userData.repos_url); // Fetch the projects data
	if (!projectsResponse.ok) {
		throw new Error(
			`Failed to fetch projects with status ${projectsResponse.status}`,
		);
	}
	userData.projects = await projectsResponse.json(); // Add projects data to the user object
	return userData;
};

const makeUserCard = (user) => {
	const userCard = document.createElement('div');
	userCard.classList.add('user-card');
	userCard.innerHTML = `
    <div class="image-container">
      <img src="${user.avatar_url}" alt="" />
    </div>
    <div class="text-info">
      <h2>${user.name}</h2>
      <p class="about">${user.bio}</p>
      <ul class="followers">
        <li><span>${user.followers}</span> Followers</li>
        <li><span>${user.following}</span> Following</li>
        <li><span>${user.public_repos}</span> Repos</li>
      </ul>
      <h3>Last 5 Projects:</h3>
      <ul class="projects">
        ${user.projects
					.slice(0, 5)
					.map(
						(project) =>
							`<li><a href="${project.html_url}" target="_blank">${project.name}</a></li>`,
					)
					.join('')}
      </ul>
    </div>
  `;
	userCard.style.display = 'flex';
	userCard.style.direction = 'row';

	document.body.appendChild(userCard);
	return userCard;
};
