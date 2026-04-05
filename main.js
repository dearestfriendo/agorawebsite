const ARTICLES_KEY = 'agora_articles';
const PODCASTS_KEY = 'agora_podcasts';
const PDFS_KEY = 'agora_pdfs';

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderArticles(containerId, isFullList = false) {
    const articles = JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
    const container = document.getElementById(containerId);
    if (!container) return;

    if (articles.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center;">სტატიები ჯერ არ არის ხელმისაწვდომი. შეამოწმეთ მოგვიანებით!</p>';
        return;
    }

    const articlesToShow = isFullList ? articles : articles.slice(0, 3);
    container.innerHTML = articlesToShow.map(article => `
        <div class="article-card">
            <h4>${escapeHtml(article.title)}</h4>
            <div class="article-meta">
                <span><i class="fas fa-user-pen"></i> ${escapeHtml(article.author || 'ანონიმური')}</span>
                <span><i class="fas fa-calendar"></i> ${article.date || 'უახლესი'}</span>
            </div>
            <p class="excerpt">${escapeHtml(article.excerpt)}</p>
            <button class="read-more btn-read" data-id="${article.id}">წაიკითხეთ მეტი →</button>
        </div>
    `).join('');

    document.querySelectorAll('.btn-read').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const fullArticle = articles.find(a => a.id === id);
            if (fullArticle) {
                showArticleModal(fullArticle);
            }
        });
    });
}

function showArticleModal(article) {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal';
    modalDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    
    modalDiv.innerHTML = `
        <div class="modal-content" style="
            background: white;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            border-radius: 24px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        ">
            <div style="
                padding: 24px 28px;
                border-bottom: 1px solid #eaeaea;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: white;
                flex-shrink: 0;
            ">
                <h3 style="margin: 0; font-size: 1.6rem; color: #2c3e4e; line-height: 1.3;">${escapeHtml(article.title)}</h3>
                <span class="close-modal" style="
                    font-size: 32px;
                    cursor: pointer;
                    color: #999;
                    line-height: 1;
                    padding: 0 8px;
                ">&times;</span>
            </div>
            <div style="
                padding: 16px 28px;
                background: #f8f8f6;
                border-bottom: 1px solid #eaeaea;
                flex-shrink: 0;
            ">
                <span style="color: #666;"><i class="fas fa-user-pen"></i> ${escapeHtml(article.author || 'ანონიმური')}</span>
                <span style="margin-left: 24px; color: #666;"><i class="fas fa-calendar"></i> ${article.date || ''}</span>
            </div>
            <div class="full-content" style="
                padding: 32px 36px;
                overflow-y: auto;
                flex: 1;
                line-height: 1.8;
                font-size: 1.05rem;
                color: #2c3e4e;
                background: white;
            ">
                ${article.content || '<p style="color: #999;">კონტენტი ვერ მოიძებნა.</p>'}
            </div>
        </div>
    `;
    
    document.body.appendChild(modalDiv);
    
    const style = document.createElement('style');
    style.textContent = `
        .full-content {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .full-content p {
            margin-bottom: 1.4em;
            line-height: 1.7;
        }
        .full-content h1 {
            font-size: 1.8rem;
            margin-top: 1.5em;
            margin-bottom: 0.75em;
            color: #1e2a32;
            font-weight: 600;
        }
        .full-content h2 {
            font-size: 1.5rem;
            margin-top: 1.5em;
            margin-bottom: 0.6em;
            color: #1e2a32;
            font-weight: 600;
        }
        .full-content h3 {
            font-size: 1.25rem;
            margin-top: 1.2em;
            margin-bottom: 0.5em;
            color: #1e2a32;
            font-weight: 600;
        }
        .full-content ul, .full-content ol {
            margin: 1em 0;
            padding-left: 2em;
        }
        .full-content li {
            margin: 0.5em 0;
            line-height: 1.6;
        }
        .full-content blockquote {
            border-left: 4px solid #c44536;
            margin: 1.2em 0;
            padding: 0.5em 0 0.5em 1.5em;
            color: #5a6872;
            font-style: italic;
            background: #fafaf8;
            border-radius: 0 8px 8px 0;
        }
        .full-content img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 1em 0;
        }
        .full-content code {
            background: #f0f0f0;
            padding: 0.2em 0.4em;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.9em;
        }
        .full-content pre {
            background: #f0f0f0;
            padding: 1em;
            border-radius: 8px;
            overflow-x: auto;
            font-family: monospace;
            margin: 1em 0;
        }
    `;
    modalDiv.appendChild(style);
    
    modalDiv.querySelector('.close-modal').onclick = () => modalDiv.remove();
    modalDiv.onclick = (e) => { if(e.target === modalDiv) modalDiv.remove(); };
}

function renderPodcasts(containerId, isFullList = false) {
    const podcasts = JSON.parse(localStorage.getItem(PODCASTS_KEY) || '[]');
    const container = document.getElementById(containerId);
    if (!container) return;

    if (podcasts.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center;">პოდკასტის ეპიზოდები ჯერ არ არის ხელმისაწვდომი. შეამოწმეთ მოგვიანებით!</p>';
        return;
    }

    const toShow = isFullList ? podcasts : podcasts.slice(0, 3);
    container.innerHTML = toShow.map(pod => `
        <div class="podcast-card">
            <h4>${escapeHtml(pod.title)}</h4>
            ${pod.episodeNumber ? `<div class="article-meta"><span>ეპიზოდი ${escapeHtml(pod.episodeNumber)}</span></div>` : ''}
            <p class="excerpt">${escapeHtml(pod.description)}</p>
            <a href="${escapeHtml(pod.youtubeUrl)}" target="_blank" class="watch-link"><i class="fab fa-youtube"></i> უყურეთ Youtube-ზე →</a>
        </div>
    `).join('');
}

function viewPublicPDF(pdfId) {
    const pdfs = JSON.parse(localStorage.getItem(PDFS_KEY) || '[]');
    const pdf = pdfs.find(p => p.id === pdfId);
    
    if (pdf && pdf.dataURL) {
        const viewerWindow = window.open('', '_blank');
        viewerWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${escapeHtml(pdf.title)} - Agora ThinkLab</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #f5f5f5;
                        height: 100vh;
                        display: flex;
                        flex-direction: column;
                    }
                    .toolbar {
                        background: #2c3e4e;
                        color: white;
                        padding: 12px 24px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 12px;
                    }
                    .toolbar h3 {
                        font-size: 1rem;
                        font-weight: 500;
                    }
                    .toolbar a {
                        color: white;
                        text-decoration: none;
                        background: #c44536;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 0.85rem;
                    }
                    .toolbar a:hover {
                        background: #a5382a;
                    }
                    .pdf-container {
                        flex: 1;
                        background: #e0e0e0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 20px;
                    }
                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                        background: white;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    }
                </style>
            </head>
            <body>
                <div class="toolbar">
                    <h3><i class="fas fa-file-pdf"></i> ${escapeHtml(pdf.title)}</h3>
                    <a href="${pdf.dataURL}" download="${escapeHtml(pdf.fileName || 'document.pdf')}">
                        <i class="fas fa-download"></i> Download PDF
                    </a>
                </div>
                <div class="pdf-container">
                    <iframe src="${pdf.dataURL}" title="${escapeHtml(pdf.title)}"></iframe>
                </div>
            </body>
            </html>
        `);
        viewerWindow.document.close();
    } else {
        alert('შეცდომა: PDF ინფორმაცია ვერ მოიძებნა.');
    }
}

function renderPDFs() {
    const pdfs = JSON.parse(localStorage.getItem(PDFS_KEY) || '[]');
    const container = document.getElementById('pdfList');
    if (!container) return;

    if (pdfs.length === 0) {
        container.innerHTML = '<p>PDF ფაილები ჯერ არ არის ხელმისაწვდომი. შეამოწმეთ მოგვიანებით!</p>';
        return;
    }

    container.innerHTML = pdfs.map(pdf => `
        <div class="pdf-item">
            <div class="pdf-info">
                <h4><i class="fas fa-file-pdf" style="color:#c44536;"></i> ${escapeHtml(pdf.title)}</h4>
                <p>${escapeHtml(pdf.description || '')}</p>
                <small>Added: ${pdf.date || 'recent'} | ${pdf.fileSize || ''}</small>
            </div>
            <button onclick="viewPublicPDF('${pdf.id}')" class="pdf-link">Open PDF <i class="fas fa-external-link-alt"></i></button>
        </div>
    `).join('');
}

window.viewPublicPDF = viewPublicPDF;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featured-articles')) renderArticles('featured-articles', false);
    if (document.getElementById('all-articles')) renderArticles('all-articles', true);
    if (document.getElementById('featured-podcasts')) renderPodcasts('featured-podcasts', false);
    if (document.getElementById('all-podcasts')) renderPodcasts('all-podcasts', true);
    if (document.getElementById('pdfList')) renderPDFs();
});