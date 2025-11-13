// script.js
document.addEventListener('DOMContentLoaded', () => {

    // Šis kods visām saitēm, kas ir pogas, pievieno "ielādes" efektu
    // Tas rada ilūziju, ka sistēma "domā"
    const linksAsButtons = document.querySelectorAll('a.btn');

    linksAsButtons.forEach(link => {
        link.addEventListener('click', function (e) {
            // Ja tas ir "Simulēt", aizturam navigāciju uz 1 sekundi
            if (this.id === 'simulate-upload') {
                e.preventDefault(); // Pārtraucam tūlītēju pāreju
                const originalText = this.innerText;
                const href = this.href;

                this.innerText = 'Notiek ielāde...';
                this.style.opacity = '0.7';

                setTimeout(() => {
                    // Atjaunojam pogu un tad pārejam
                    this.innerText = originalText;
                    this.style.opacity = '1';
                    window.location.href = href; // Pārejam uz nākamo lapu
                }, 1000); // 1 sekundes aizture
            } else {
                // Citām pogām vienkārši parādām ātru ziņojumu
                this.style.opacity = '0.7';
                this.innerText = 'Notiek ielāde...';
                // Pāreja notiks automātiski, bet teksts nomainīsies
            }
        });
    });
});