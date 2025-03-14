const themeToggle = () => {                 


    const themeToggle = document.getElementById('theme-toggle');
    
    
    const body = document.body;
  
    // Vérifier si le thème est déjà stocké dans le localStorage
    if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark-theme');
      themeToggle.checked = true;  // Si le thème sombre est sélectionné, cocher la checkbox
    } else {
      body.classList.add('light-theme');
    }
  
    // Ajout d'un gestionnaire d'événements pour changer le thème lorsque la checkbox est cochée
    themeToggle.addEventListener('change', function () {
      if (themeToggle.checked) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');  // Sauvegarder le thème dans localStorage
      } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');  // Sauvegarder le thème dans localStorage
      }
    });
  };

  export default themeToggle;
  