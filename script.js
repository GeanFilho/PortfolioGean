/* 1. Configuração do Particles.js */
particlesJS("particles-js", {
    "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#64ffda" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": false }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#8892b0", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false } },
    "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } } },
    "retina_detect": true
});

/* 2. Animação de Entrada com Intersection Observer */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const initialHiddenElements = document.querySelectorAll('.hidden');
initialHiddenElements.forEach((el) => observer.observe(el));


/* 3. Lógica para buscar projetos do GitHub */
async function fetchGithubProjects(username) {
    const container = document.getElementById('project-list');
    
    container.innerHTML = '<p>Carregando projetos do GitHub...</p>';
    console.log(`Iniciando busca por projetos do usuário: ${username}`);

    try {
        const apiUrl = `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`;
        const response = await fetch(apiUrl);

        if (response.status === 404) {
            throw new Error(`Usuário '${username}' não encontrado. Verifique se o nome de usuário está correto no script.js.`);
        }
        if (!response.ok) {
            throw new Error(`Erro na comunicação com a API do GitHub. Status: ${response.status}`);
        }

        const projects = await response.json();
        console.log(`Recebidos ${projects.length} projetos da API.`);

        container.innerHTML = '';

        // MUDANÇA 1: Verificamos se a lista de projetos (incluindo forks) está vazia.
        if (projects.length === 0) {
            container.innerHTML = '<p>Nenhum projeto público encontrado neste perfil do GitHub.</p>';
            return;
        }

        // MUDANÇA 2: Iteramos diretamente sobre 'projects', sem filtrar os forks.
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card', 'hidden');
            
            // MUDANÇA 3: Adicionamos a etiqueta 'fork-badge' se project.fork for verdadeiro.
            projectCard.innerHTML = `
                <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">
                    <h4>
                        ${project.name}
                        ${project.fork ? '<span class="fork-badge">Fork</span>' : ''}
                    </h4>
                    <p>${project.description || 'Sem descrição.'}</p>
                    <div class="card-footer">
                        <span class="language">${project.language || 'Code'}</span>
                        <span>⭐ ${project.stargazers_count}</span>
                        <span>⑂ ${project.forks_count}</span>
                    </div>
                </a>
            `;
            container.appendChild(projectCard);
        });

        const newProjectCards = document.querySelectorAll('.project-card.hidden');
        newProjectCards.forEach((el) => observer.observe(el));

    } catch (error) {
        console.error('Falha ao buscar projetos:', error);
        container.innerHTML = `<p style="color: #ff8b8b;">${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('project-list')) {
        const githubUsername = 'GeanFilho'; // Mantenha seu usuário aqui
        fetchGithubProjects(githubUsername);
    }
});