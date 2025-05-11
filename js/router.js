class Router {
    constructor() {
        this.routes = {
            '/': { 
                title: 'Letwin Pondo | Geospatial Scientist',
                template: '/pages/home.html'
            },
            '/resume': {
                title: 'Resume - Letwin Pondo',
                template: '/pages/resume.html'
            },
            '/projects': {
                title: 'Projects - Letwin Pondo',
                template: '/pages/projects.html'
            },
            '/contact': {
                title: 'Contact - Letwin Pondo',
                template: '/pages/contact.html'
            }
        };
        
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        this.bindLinks();
        this.handleRoute();
    }

    bindLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-page]');
            if (link) {
                e.preventDefault();
                const url = link.getAttribute('href');
                this.navigate(url);
            }
        });
    }

    async handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/'];
        
        // Update active navigation
        this.updateNavigation(path);
        
        // Update page title
        document.title = route.title;
        
        try {
            // Show loading state
            this.showLoading();
            
            // Fetch and insert content
            const response = await fetch(route.template);
            const content = await response.text();
            document.getElementById('app').innerHTML = content;
            
            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error loading page:', error);
            this.showError();
        } finally {
            this.hideLoading();
        }
    }

    navigate(url) {
        window.history.pushState(null, '', url);
        this.handleRoute();
    }

    updateNavigation(path) {
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }

    showLoading() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = '<div class="loader"></div>';
        document.getElementById('app').appendChild(loader);
    }

    hideLoading() {
        const loader = document.querySelector('.page-loader');
        if (loader) loader.remove();
    }

    showError() {
        document.getElementById('app').innerHTML = `
            <div class="error-container">
                <h2>Error Loading Page</h2>
                <p>Sorry, there was a problem loading the content. Please try again.</p>
            </div>
        `;
    }
}

// Initialize router
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});