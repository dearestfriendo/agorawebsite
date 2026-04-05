const ARTICLES_KEY = 'agora_articles';
const PODCASTS_KEY = 'agora_podcasts';
const PDFS_KEY = 'agora_pdfs';

function initializeData() {
    if (!localStorage.getItem(ARTICLES_KEY)) {
        const sampleArticles = [
            {
                id: 'art1',
                title: 'The Art of Deep Reading: Why Books Still Matter',
                author: 'Elena M.',
                excerpt: 'In a world of skimming, reclaiming the lost art of immersive reading transforms how we think.',
                content: '<p>In an age of endless scrolling and bite-sized content, the ability to read deeply has become a rare and precious skill. Deep reading is not merely about understanding words on a page—it is about entering into a dialogue with the author, allowing ideas to percolate, and letting insights transform our thinking.</p><h2>The Lost Art</h2><p>Neuroscientists have found that deep reading creates unique neural pathways that are not activated when we skim or scan text. When we immerse ourselves in a book, we engage areas of the brain associated with empathy, complex reasoning, and even sensory experiences.</p><blockquote>"Reading is a conversation with the greatest minds that ever lived." - Descartes</blockquote><h2>Practical Steps</h2><p>To cultivate deep reading, set aside dedicated time free from distractions. Read with a pen in hand, underlining passages that resonate. After each chapter, pause to reflect and journal your thoughts.</p><p>In doing so, we reclaim not just a skill, but a way of being that enriches our inner lives and deepens our connection to the world of ideas.</p>',
                date: '2025-03-15'
            },
            {
                id: 'art2',
                title: 'Review: "The Dawn of Everything" by Graeber & Wengrow',
                author: 'Marco T.',
                excerpt: 'A paradigm-shifting look at human history that challenges our assumptions about freedom and equality.',
                content: '<p>This extraordinary book dismantles the conventional narrative of human social evolution. The authors show that our ancestors experimented with many forms of social organization, challenging the idea that hierarchy is inevitable.</p><h2>Key Insights</h2><p>The book argues that human beings have always been creative political actors, capable of organizing themselves in diverse ways. From indigenous American societies to ancient Mesopotamian cities, history reveals a richness of social experimentation that we rarely acknowledge.</p><p>A must-read for anyone interested in anthropology, history, or the future of human society.</p>',
                date: '2025-03-10'
            }
        ];
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(sampleArticles));
    }
    if (!localStorage.getItem(PODCASTS_KEY)) {
        const samplePodcasts = [
            {
                id: 'pod1',
                title: 'Consciousness & AI: Where Do We Draw the Line?',
                episodeNumber: '#24',
                description: 'Exploring the philosophical boundaries of artificial sentience with Dr. Leah Chen.',
                youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
                id: 'pod2',
                title: 'Book Club: "The Silmarillion" - Myth as Mirror',
                episodeNumber: '#23',
                description: 'Tolkien\'s mythology and its reflections on creativity, fall, and grace.',
                youtubeUrl: 'https://www.youtube.com/watch?v=3GRSbr0EYYU'
            }
        ];
        localStorage.setItem(PODCASTS_KEY, JSON.stringify(samplePodcasts));
    }
    if (!localStorage.getItem(PDFS_KEY)) {
        localStorage.setItem(PDFS_KEY, JSON.stringify([]));
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        if (!isError) {
            element.style.background = '#d4edda';
            element.style.color = '#155724';
        } else {
            element.style.background = '#f8d7da';
            element.style.color = '#721c24';
        }
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

function renderAdminArticles() {
    const articles = JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
    const container = document.getElementById('adminArticlesList');
    if (!container) return;

    if (articles.length === 0) {
        container.innerHTML = '<p>No articles yet. Create your first article above.</p>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <div class="admin-item" data-id="${article.id}">
            <div class="admin-item-info">
                <h4>${escapeHtml(article.title)}</h4>
                <p>By ${escapeHtml(article.author || 'Anonymous')} · ${article.date || 'recent'}</p>
                <p class="excerpt">${escapeHtml(article.excerpt?.substring(0, 100) || '')}...</p>
            </div>
            <div class="admin-actions">
                <button class="edit-btn" onclick="editArticle('${article.id}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn" onclick="deleteArticle('${article.id}')"><i class="fas fa-trash"></i> Delete</button>
                <button class="view-btn" onclick="viewArticle('${article.id}')"><i class="fas fa-eye"></i> View</button>
            </div>
        </div>
    `).join('');
}

function viewArticle(id) {
    const articles = JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
    const article = articles.find(a => a.id === id);
    if (article) {
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
                    <span style="color: #666;"><i class="fas fa-user-pen"></i> ${escapeHtml(article.author || 'Anonymous')}</span>
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
                    ${article.content || '<p style="color: #999;">No additional content provided.</p>'}
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
}

function editArticle(id) {
    const articles = JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
    const article = articles.find(a => a.id === id);
    if (article) {
        document.getElementById('adminArticleTitle').value = article.title;
        document.getElementById('adminArticleAuthor').value = article.author || '';
        document.getElementById('adminArticleExcerpt').value = article.excerpt || '';
        document.getElementById('adminArticleContent').value = article.content || '';
        
        window.editingArticleId = id;
        
        const submitBtn = document.querySelector('#adminArticleForm button');
        submitBtn.textContent = 'Update Article';
        submitBtn.style.background = '#e68a2e';
        
        document.querySelector('#articles-tab .admin-card').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteArticle(id) {
    if (confirm('Are you sure you want to delete this article? This cannot be undone.')) {
        let articles = JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
        articles = articles.filter(a => a.id !== id);
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
        renderAdminArticles();
        showMessage('articleSuccess', 'Article deleted successfully!');
    }
}

function setupArticleForm() {
    const form = document.getElementById('adminArticleForm');
    if (!form) return;
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('adminArticleTitle').value;
        const author = document.getElementById('adminArticleAuthor').value || 'Agora Member';
        const excerpt = document.getElementById('adminArticleExcerpt').value;
        let content = document.getElementById('adminArticleContent').value;
        
        if (!title || !excerpt) {
            alert('Please fill in title and excerpt.');
            return;
        }
        
        if (content && !content.includes('<p>') && !content.includes('<h') && !content.includes('<div')) {
            content = content.split('\n\n').map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('');
        }
        
        let articles = JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
        
        if (window.editingArticleId) {
            const index = articles.findIndex(a => a.id === window.editingArticleId);
            if (index !== -1) {
                articles[index] = {
                    ...articles[index],
                    title,
                    author,
                    excerpt,
                    content,
                    date: new Date().toISOString().slice(0, 10)
                };
            }
            window.editingArticleId = null;
            const submitBtn = document.querySelector('#adminArticleForm button');
            submitBtn.textContent = 'Publish Article';
            submitBtn.style.background = '';
            showMessage('articleSuccess', 'Article updated successfully!');
        } else {
            const newArticle = {
                id: Date.now().toString(),
                title,
                author,
                excerpt,
                content,
                date: new Date().toISOString().slice(0, 10)
            };
            articles.unshift(newArticle);
            showMessage('articleSuccess', 'Article published successfully!');
        }
        
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
        form.reset();
        renderAdminArticles();
    };
}

function renderAdminPodcasts() {
    const podcasts = JSON.parse(localStorage.getItem(PODCASTS_KEY) || '[]');
    const container = document.getElementById('adminPodcastsList');
    if (!container) return;
    
    if (podcasts.length === 0) {
        container.innerHTML = '<p>No podcast episodes yet. Add your first episode above.</p>';
        return;
    }
    
    container.innerHTML = podcasts.map(pod => `
        <div class="admin-item" data-id="${pod.id}">
            <div class="admin-item-info">
                <h4>${escapeHtml(pod.title)} ${pod.episodeNumber ? `(${escapeHtml(pod.episodeNumber)})` : ''}</h4>
                <p>${escapeHtml(pod.description?.substring(0, 100) || '')}</p>
                <small><i class="fab fa-youtube"></i> ${escapeHtml(pod.youtubeUrl)}</small>
            </div>
            <div class="admin-actions">
                <button class="edit-btn" onclick="editPodcast('${pod.id}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn" onclick="deletePodcast('${pod.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function editPodcast(id) {
    const podcasts = JSON.parse(localStorage.getItem(PODCASTS_KEY) || '[]');
    const podcast = podcasts.find(p => p.id === id);
    if (podcast) {
        document.getElementById('adminEpisodeTitle').value = podcast.title;
        document.getElementById('adminEpisodeNumber').value = podcast.episodeNumber || '';
        document.getElementById('adminEpisodeDescription').value = podcast.description || '';
        document.getElementById('adminYoutubeUrl').value = podcast.youtubeUrl || '';
        
        window.editingPodcastId = id;
        
        const submitBtn = document.querySelector('#adminPodcastForm button');
        submitBtn.textContent = 'Update Episode';
        submitBtn.style.background = '#e68a2e';
        
        document.querySelector('#podcasts-tab .admin-card').scrollIntoView({ behavior: 'smooth' });
    }
}

function deletePodcast(id) {
    if (confirm('Delete this podcast episode?')) {
        let podcasts = JSON.parse(localStorage.getItem(PODCASTS_KEY) || '[]');
        podcasts = podcasts.filter(p => p.id !== id);
        localStorage.setItem(PODCASTS_KEY, JSON.stringify(podcasts));
        renderAdminPodcasts();
        showMessage('podcastSuccess', 'Episode deleted successfully!');
    }
}

function setupPodcastForm() {
    const form = document.getElementById('adminPodcastForm');
    if (!form) return;
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('adminEpisodeTitle').value;
        const episodeNumber = document.getElementById('adminEpisodeNumber').value;
        const description = document.getElementById('adminEpisodeDescription').value;
        const youtubeUrl = document.getElementById('adminYoutubeUrl').value;
        
        if (!title || !youtubeUrl) {
            alert('Please fill in title and YouTube URL.');
            return;
        }
        
        let podcasts = JSON.parse(localStorage.getItem(PODCASTS_KEY) || '[]');
        
        if (window.editingPodcastId) {
            const index = podcasts.findIndex(p => p.id === window.editingPodcastId);
            if (index !== -1) {
                podcasts[index] = { ...podcasts[index], title, episodeNumber, description, youtubeUrl };
            }
            window.editingPodcastId = null;
            const submitBtn = document.querySelector('#adminPodcastForm button');
            submitBtn.textContent = 'Add Episode';
            submitBtn.style.background = '';
            showMessage('podcastSuccess', 'Episode updated successfully!');
        } else {
            const newPodcast = {
                id: Date.now().toString(),
                title,
                episodeNumber,
                description,
                youtubeUrl
            };
            podcasts.unshift(newPodcast);
            showMessage('podcastSuccess', 'Episode added successfully!');
        }
        
        localStorage.setItem(PODCASTS_KEY, JSON.stringify(podcasts));
        form.reset();
        renderAdminPodcasts();
    };
}

function renderAdminPDFs() {
    const pdfs = JSON.parse(localStorage.getItem(PDFS_KEY) || '[]');
    const container = document.getElementById('adminPdfsList');
    if (!container) return;
    
    if (pdfs.length === 0) {
        container.innerHTML = '<p>No PDFs uploaded yet.</p>';
        return;
    }
    
    container.innerHTML = pdfs.map(pdf => `
        <div class="admin-item" data-id="${pdf.id}">
            <div class="admin-item-info">
                <h4><i class="fas fa-file-pdf" style="color:#c44536;"></i> ${escapeHtml(pdf.title)}</h4>
                <p>${escapeHtml(pdf.description || '')}</p>
                <small>Uploaded: ${pdf.date || 'recent'} | Size: ${pdf.fileSize || 'Unknown'}</small>
            </div>
            <div class="admin-actions">
                <button class="view-btn" onclick="viewPDF('${pdf.id}')"><i class="fas fa-eye"></i> View PDF</button>
                <button class="delete-btn" onclick="deletePDF('${pdf.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function viewPDF(id) {
    const pdfs = JSON.parse(localStorage.getItem(PDFS_KEY) || '[]');
    const pdf = pdfs.find(p => p.id === id);
    
    if (pdf && pdf.dataURL) {
        const viewerWindow = window.open('', '_blank');
        viewerWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${escapeHtml(pdf.title)} - Agora ThinkLab</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; height: 100vh; display: flex; flex-direction: column; }
                    .toolbar { background: #2c3e4e; color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
                    .toolbar h3 { font-size: 1rem; font-weight: 500; }
                    .toolbar a { color: white; text-decoration: none; background: #c44536; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; }
                    .toolbar a:hover { background: #a5382a; }
                    .pdf-container { flex: 1; background: #e0e0e0; display: flex; justify-content: center; align-items: center; padding: 20px; }
                    iframe { width: 100%; height: 100%; border: none; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                </style>
            </head>
            <body>
                <div class="toolbar">
                    <h3><i class="fas fa-file-pdf"></i> ${escapeHtml(pdf.title)}</h3>
                    <a href="${pdf.dataURL}" download="${escapeHtml(pdf.fileName || 'document.pdf')}"><i class="fas fa-download"></i> Download PDF</a>
                </div>
                <div class="pdf-container">
                    <iframe src="${pdf.dataURL}" title="${escapeHtml(pdf.title)}"></iframe>
                </div>
            </body>
            </html>
        `);
        viewerWindow.document.close();
    } else {
        alert('Error: PDF data not found.');
    }
}

function deletePDF(id) {
    if (confirm('Delete this PDF permanently?')) {
        let pdfs = JSON.parse(localStorage.getItem(PDFS_KEY) || '[]');
        pdfs = pdfs.filter(p => p.id !== id);
        localStorage.setItem(PDFS_KEY, JSON.stringify(pdfs));
        renderAdminPDFs();
        showMessage('pdfSuccess', 'PDF deleted successfully!');
    }
}

function setupPDFForm() {
    const form = document.getElementById('adminPdfForm');
    if (!form) return;
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('adminPdfTitle').value;
        const description = document.getElementById('adminPdfDescription').value;
        const fileInput = document.getElementById('adminPdfFile');
        
        if (!title || !fileInput.files.length) {
            showMessage('pdfError', 'Please provide title and select a PDF file.', true);
            return;
        }
        
        const file = fileInput.files[0];
        
        if (file.type !== 'application/pdf') {
            showMessage('pdfError', 'Only PDF files are allowed.', true);
            return;
        }
        
        if (file.size > 15 * 1024 * 1024) {
            showMessage('pdfError', 'File is too large! Maximum size is 15MB.', true);
            return;
        }
        
        showMessage('pdfSuccess', 'Uploading PDF... Please wait.');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataURL = e.target.result;
            const pdfs = JSON.parse(localStorage.getItem(PDFS_KEY) || '[]');
            
            let fileSizeDisplay = '';
            if (file.size < 1024 * 1024) {
                fileSizeDisplay = (file.size / 1024).toFixed(1) + ' KB';
            } else {
                fileSizeDisplay = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
            }
            
            const newPDF = {
                id: Date.now().toString(),
                title: title,
                description: description,
                dataURL: dataURL,
                date: new Date().toISOString().slice(0, 10),
                fileName: file.name,
                fileSize: fileSizeDisplay
            };
            
            pdfs.push(newPDF);
            localStorage.setItem(PDFS_KEY, JSON.stringify(pdfs));
            renderAdminPDFs();
            form.reset();
            showMessage('pdfSuccess', 'PDF uploaded successfully!');
        };
        
        reader.onerror = function() {
            showMessage('pdfError', 'Error reading file. Please try again.', true);
        };
        
        reader.readAsDataURL(file);
    };
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    renderAdminArticles();
    renderAdminPodcasts();
    renderAdminPDFs();
    setupArticleForm();
    setupPodcastForm();
    setupPDFForm();
    setupTabs();
    
    window.editArticle = editArticle;
    window.deleteArticle = deleteArticle;
    window.viewArticle = viewArticle;
    window.editPodcast = editPodcast;
    window.deletePodcast = deletePodcast;
    window.deletePDF = deletePDF;
    window.viewPDF = viewPDF;
});