const API_URL = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lutskrada.gov.ua%2Fabout&psig=AOvVaw0uLYykPACuCMJkAgVn54Ke&ust=1742022392587000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJDzlqCBiYwDFQAAAAAdAAAAABAE";
const CACHE_KEY = "imageGallery";

document.addEventListener("DOMContentLoaded", () => {
    loadGallery();

    document.getElementById("refreshGallery").addEventListener("click", () => {
        loadGallery(true);
    });

    document.getElementById("clearCache").addEventListener("click", () => {
        localStorage.removeItem(CACHE_KEY);
        document.getElementById("gallery").innerHTML = "<p>Кеш очищено. Оновіть галерею!</p>";
    });
});

async function fetchImages() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Помилка завантаження зображень");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function loadGallery(forceUpdate = false) {
    const gallery = document.getElementById("gallery");

    
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData && !forceUpdate) {
        renderGallery(JSON.parse(cachedData));
        return;
    }

    gallery.innerHTML = "<p>Завантаження...</p>";
    
    const images = await fetchImages();
    if (images) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(images));
        renderGallery(images);
    } else {
        gallery.innerHTML = "<p>Не вдалося завантажити зображення. Спробуйте пізніше.</p>";
    }
}

function renderGallery(images) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    
    images.slice(0, 10).forEach(image => {
        const imgElement = document.createElement("img");
        imgElement.src = image.download_url;
        imgElement.alt = 'Image by ${image.author}';
        gallery.appendChild(imgElement);
    });
}   