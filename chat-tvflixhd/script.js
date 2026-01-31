// La URL de tu archivo TXT alojado
const fileUrl = 'tudominio.com'; 

// Función para cargar el contenido usando Fetch API
fetch(fileUrl)
    .then(response => response.text())
    .then(data => {
        // Mostrar el contenido en el elemento <pre>
        document.getElementById('content-display').textContent = data;
    })
    .catch(error => {
        console.error('Error al cargar el archivo TXT:', error);
        document.getElementById('content-display').textContent = 'No se pudo cargar el contenido del archivo.';
    });
