// --- Завдання з кнопкою реєстрації (Promise) ---
const regForm = document.getElementById('register-form');
const regBtn = document.getElementById('register-btn');
const regMsg = document.getElementById('register-msg');

regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Блокуємо кнопку та змінюємо текст
    const originalText = regBtn.textContent;
    regBtn.disabled = true;
    regBtn.textContent = 'Loading...';
    regMsg.textContent = '';
    
    // Імітація запиту через Promise
    new Promise((resolve) => {
        setTimeout(() => {
            resolve('Реєстрація успішна!');
        }, 2000);
    })
    .then((message) => {
        regMsg.textContent = message;
        regForm.reset(); // Очищення форми після успіху
    })
    .finally(() => {
        // Повертаємо кнопку в початковий стан
        regBtn.disabled = false;
        regBtn.textContent = originalText;
    });
});


// --- Завдання 1 ---
function fetchAdviceByKeyword(keyword) {
    const resultDiv = document.getElementById('advice-result');
    resultDiv.innerHTML = 'Завантаження...';
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.adviceslip.com/advice/search/${keyword}`);
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.slips && response.slips.length > 0) {
                    let html = '<ul>';
                    response.slips.forEach(slip => {
                        html += `<li>${slip.advice}</li>`;
                    });
                    html += '</ul>';
                    resultDiv.innerHTML = html;
                } else {
                    resultDiv.innerHTML = `<span class="error">Порад за словом "${keyword}" не знайдено.</span>`;
                }
            } catch (e) {
                resultDiv.innerHTML = '<span class="error">Помилка обробки даних.</span>';
            }
        } else {
            resultDiv.innerHTML = `<span class="error">Помилка запиту: ${xhr.status}</span>`;
        }
    };
    
    xhr.onerror = function() {
        resultDiv.innerHTML = '<span class="error">Помилка мережі при отриманні порад.</span>';
    };
    
    xhr.send();
}

document.getElementById('advice-btn').addEventListener('click', () => {
    const keyword = document.getElementById('advice-keyword').value.trim();
    if (keyword) {
        fetchAdviceByKeyword(keyword);
    }
});


// --- Завдання 2 ---
function fetchDogBreeds() {
    const list = document.getElementById('breed-list');
    list.innerHTML = '<li>Завантаження...</li>';
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://dog.ceo/api/breeds/list/all');
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.responseText);
                const breeds = response.message;
                list.innerHTML = '';
                
                for (const breed in breeds) {
                    const li = document.createElement('li');
                    li.textContent = breed;
                    list.appendChild(li);
                }
            } catch (e) {
                console.error('Помилка парсингу порід собак:', e);
                list.innerHTML = '<li class="error">Помилка обробки даних.</li>';
            }
        } else {
            console.error('Помилка запиту порід собак:', xhr.status);
            list.innerHTML = '<li class="error">Помилка завантаження.</li>';
        }
    };
    
    xhr.onerror = function() {
        console.error('Помилка мережі при запиті порід собак');
        list.innerHTML = '<li class="error">Помилка мережі.</li>';
    };
    
    xhr.send();
}

document.getElementById('dogs-btn').addEventListener('click', fetchDogBreeds);


// --- Завдання 3 ---
function fetchRandomQuote() {
    const container = document.getElementById('quote-container');
    container.innerHTML = 'Завантаження...';
    
    // ВАЖЛИВО: Для api-ninjas потрібен ключ. Встав свій API ключ сюди.
    const apiKey = 'YOUR_API_NINJAS_KEY'; 
    
    fetch('https://api.api-ninjas.com/v1/quotes', {
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Помилка: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            const quote = data[0];
            container.innerHTML = `
                <blockquote>"${quote.quote}"</blockquote>
                <p><strong>- ${quote.author}</strong></p>
            `;
        } else {
            container.innerHTML = '<span class="error">Цитату не знайдено.</span>';
        }
    })
    .catch(error => {
        console.error('Помилка при отриманні цитати:', error);
        container.innerHTML = '<span class="error">Не вдалося завантажити цитату. Перевір API ключ.</span>';
    });
}

document.getElementById('quote-btn').addEventListener('click', fetchRandomQuote);


// --- Завдання 4 ---
function fetchCountryByName(countryName) {
    const infoDiv = document.getElementById('country-info');
    infoDiv.innerHTML = 'Завантаження...';
    
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Країна не знайдена');
        }
        return response.json();
    })
    .then(data => {
        const country = data[0];
        infoDiv.innerHTML = `
            <h3>${country.name.common} ${country.flag}</h3>
            <p><strong>Столиця:</strong> ${country.capital ? country.capital[0] : 'Немає'}</p>
            <p><strong>Регіон:</strong> ${country.region}</p>
            <p><strong>Населення:</strong> ${country.population.toLocaleString()}</p>
        `;
    })
    .catch(error => {
        infoDiv.innerHTML = `<span class="error">${error.message}</span>`;
    });
}

document.getElementById('country-btn').addEventListener('click', () => {
    const countryName = document.getElementById('country-name').value.trim();
    if (countryName) {
        fetchCountryByName(countryName);
    }
});
