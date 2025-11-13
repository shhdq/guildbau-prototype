// script.js
const BASE_THEME = {
    '--guildbau-yellow': '#FFC300',
    '--guildbau-dark': '#2C3E50',
    '--guildbau-text': '#34495E'
};

const THEMES = {
    default: { ...BASE_THEME },
    lba: {
        '--guildbau-yellow': '#00A3FF',
        '--guildbau-dark': '#0B3A5B',
        '--guildbau-text': '#0E4C75'
    },
    buvetajs: {
        '--guildbau-yellow': '#FF8C00',
        '--guildbau-dark': '#3F2A1D',
        '--guildbau-text': '#4F3D2A'
    }
};

const SHARED_ESG = {
    companyName: 'Būve ABC',
    co2: '1 200',
    recycling: '78%',
    ltifr: '1.2',
    documents: [
        { name: 'Pārskats par ietekmi uz vidi (PDF)', status: 'Verificēts', updated: '02.02.2025', note: 'Validēts LBA' },
        { name: 'Piegādes ķēdes ētikas kodekss (PDF)', status: 'Iesniegts', updated: '15.01.2025', note: 'Gaida asociācijas apstiprinājumu' }
    ]
};

const STATE_DATA = {
    'mvu-bronze': { profileCompletion: 30, trustScore: 45 },
    'mvu-silver': { profileCompletion: 90, trustScore: 75 },
    'mvu-gold': { profileCompletion: 100, trustScore: 92 },
    'gc-risk': {
        kpis: [
            { label: 'Partneriem beigusies apdrošināšana', value: '3', tone: 'kpi-risk' },
            { label: "Partneri ar 'Pending' ESG statusu", value: '8', tone: 'kpi-warn' },
            { label: 'Vidējais TrustScore šodien', value: '68/100', tone: 'kpi-ok' }
        ]
    },
    'gc-search': {
        results: [
            {
                name: 'Būve ABC',
                tagline: '(Jūsu jaunais partneris)',
                level: 'SILVER',
                levelColor: 'var(--guildbau-silver)',
                esg: { label: 'VERIFIED', color: 'var(--status-verified)' },
                trustScore: 75,
                cta: { label: 'Skatīt ESG profilu', href: 'gc_esg_profile.html', tone: 'btn btn-primary', disabled: false }
            },
            {
                name: 'Darbi XYZ',
                tagline: '',
                level: 'BRONZE',
                levelColor: 'var(--guildbau-bronze)',
                esg: { label: 'Nav datu', color: '#6c757d' },
                trustScore: 45,
                cta: { label: 'Nepieejams (Par zemu līmenis)', href: '#', tone: 'btn btn-secondary', disabled: true }
            },
            {
                name: 'Fasādes Meistari SIA',
                tagline: '',
                level: 'SILVER',
                levelColor: 'var(--guildbau-silver)',
                esg: { label: 'Beidzies termiņš', color: 'var(--status-expired)' },
                trustScore: 55,
                cta: { label: 'Skatīt ar riska brīdinājumu', href: 'gc_esg_profile.html', tone: 'btn btn-primary', disabled: false }
            }
        ]
    },
    'association-dashboard': {
        membersTotal: 145,
        pendingValidation: 4,
        bronzeMembers: 35,
        silverPlus: 110
    },
    'association-member-list': {
        members: [
            {
                name: 'Būve ABC',
                statusClass: 'status-verified',
                statusLabel: 'Silver',
                trustScore: '75/100',
                action: { label: 'Skatīt profilu', href: 'association_member_detail.html?member=buve-abc', tone: 'btn btn-secondary' }
            },
            {
                name: 'Jaunais Būvnieks SIA',
                statusClass: 'status-pending',
                statusLabel: 'Gaida validāciju',
                trustScore: 'N/A',
                action: { label: 'Pārskatīt dokumentus', href: 'association_member_detail.html?member=jaunais', tone: 'btn btn-primary' }
            },
            {
                name: 'Metāla Risinājumi',
                statusClass: 'status-expired',
                statusLabel: 'Beigusies apdrošināšana',
                trustScore: '55/100',
                action: { label: 'Sazināties', href: '#', tone: 'btn btn-secondary' }
            }
        ]
    },
    'association-member-detail': {
        memberName: 'Jaunais Būvnieks SIA',
        statusLabel: 'Gaida validāciju',
        documents: [
            { name: '1. Legal & Registration', status: 'Verificēts', updated: '10.01.2025', note: 'Līgumi sakārtojami' },
            { name: '2. Finance & Solvency', status: 'Gaida apstiprinājumu', updated: '25.01.2025', note: 'Nepieciešams pēdējais audits' },
            { name: '3. Insurance & Liability', status: 'Beigusies 15.02.2025', updated: '15.02.2024', note: 'Jāiesniedz apliecinājums' }
        ]
    },
    'gc-esg-profile': SHARED_ESG,
    'mvu-esg': {
        esgProfile: SHARED_ESG,
        formDefaults: { co2: '1200', recycling: '78', ltifr: '1.2' }
    }
};

let currentPageData = null;

document.addEventListener('DOMContentLoaded', () => {
    const showToast = createToast();
    const showModal = createModal();

    initStateRendering();
    setupLoadingButtons(showToast);
    initPersonaSwitcher();
    initThemeToggle();
    initESGForm(showToast, showModal);
    initAssociationActions(showModal, showToast);
    initInviteButton(showModal);
});

function setupLoadingButtons(showToast) {
    const linksAsButtons = document.querySelectorAll('a.btn');
    linksAsButtons.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.dataset.block === 'true') {
                e.preventDefault();
                showToast('Šis demonstrācijas scenārijs nav pieejams zemākam līmenim.', 'error');
                return;
            }

            if (this.id === 'simulate-upload') {
                e.preventDefault();
                const originalText = this.innerText;
                const href = this.href;
                this.innerText = 'Notiek ielāde...';
                this.style.opacity = '0.7';
                showToast('Dokumenti iesniegti validācijai. Pāradresējam uz Silver paneli.', 'success');
                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.opacity = '1';
                    window.location.href = href;
                }, 1200);
            } else if (this.getAttribute('href') === '#') {
                e.preventDefault();
                showToast('Drīzumā pieejams.', 'info');
            } else {
                this.style.opacity = '0.7';
                this.innerText = 'Notiek ielāde...';
            }
        });
    });
}

function initPersonaSwitcher() {
    const switcher = document.querySelector('[data-persona-switcher] select');
    if (!switcher) return;
    switcher.addEventListener('change', () => {
        window.location.href = switcher.value;
    });
}

function initThemeToggle() {
    const select = document.getElementById('theme-select');
    const stored = localStorage.getItem('gb-theme') || 'default';
    applyTheme(stored);
    if (!select) return;
    select.value = stored;
    select.addEventListener('change', () => {
        localStorage.setItem('gb-theme', select.value);
        applyTheme(select.value);
    });
}

function applyTheme(themeKey) {
    const theme = THEMES[themeKey] || THEMES.default;
    Object.keys(BASE_THEME).forEach(variable => {
        const value = theme[variable] || BASE_THEME[variable];
        document.documentElement.style.setProperty(variable, value);
    });
}

function initStateRendering() {
    const pageKey = document.body.dataset.page;
    if (!pageKey || !STATE_DATA[pageKey]) return;
    currentPageData = STATE_DATA[pageKey];
    const renderers = {
        'mvu-bronze': renderMVUDashboard,
        'mvu-silver': renderMVUDashboard,
        'mvu-gold': renderMVUDashboard,
        'gc-risk': renderGCKpis,
        'gc-search': renderGCSearch,
        'association-dashboard': renderAssociationDashboard,
        'association-member-list': renderAssociationMemberList,
        'association-member-detail': renderAssociationMemberDetail,
        'gc-esg-profile': renderGCEsgProfile,
        'mvu-esg': prefillESGForm
    };

    const renderer = renderers[pageKey];
    if (renderer) renderer(currentPageData);
}

function renderMVUDashboard(data) {
    const progressBars = document.querySelectorAll('[data-bind="profileCompletion"]');
    progressBars.forEach(el => {
        const value = `${data.profileCompletion}%`;
        if (el.dataset.bindType === 'progress') {
            el.style.width = value;
        }
        el.textContent = value;
    });
    const trustNode = document.querySelector('[data-bind="trustScore"]');
    if (trustNode) trustNode.textContent = data.trustScore;
}

function renderGCKpis(data) {
    const container = document.querySelector('[data-kpi-grid]');
    if (!container) return;
    container.innerHTML = data.kpis.map(kpi => `
        <div class="kpi-card ${kpi.tone}">
            <div class="value">${kpi.value}</div>
            <div class="label">${kpi.label}</div>
        </div>
    `).join('');
}

function renderGCSearch(data) {
    const container = document.querySelector('[data-results]');
    if (!container) return;
    container.innerHTML = data.results.map(result => `
        <div class="search-result">
            <div>
                <h3>${result.name} ${result.tagline || ''}</h3>
                <span class="level-tag">Līmenis: <span style="color:${result.levelColor}; font-weight:bold;">${result.level}</span></span> |
                <span class="level-tag">ESG: <span style="color:${result.esg.color}; font-weight:bold;">${result.esg.label}</span></span>
            </div>
            <div class="trust-score" style="color:${result.esg.color}">
                ${result.trustScore}<span>/100</span>
            </div>
            <div>
                <a href="${result.cta.href}" class="${result.cta.tone}" ${result.cta.disabled ? 'data-block="true" style="opacity:0.6; cursor:not-allowed;"' : ''}>${result.cta.label}</a>
            </div>
        </div>
    `).join('');
}

function renderAssociationDashboard(data) {
    document.querySelectorAll('[data-bind]').forEach(node => {
        const key = node.dataset.bind;
        if (data[key] !== undefined) {
            node.textContent = data[key];
        }
    });
}

function renderAssociationMemberList(data) {
    const tbody = document.querySelector('[data-member-rows]');
    if (!tbody) return;
    tbody.innerHTML = data.members.map(member => `
        <tr>
            <td data-label="Uzņēmuma nosaukums">${member.name}</td>
            <td data-label="Statuss"><span class="status-badge ${member.statusClass}">${member.statusLabel}</span></td>
            <td data-label="TrustScore">${member.trustScore}</td>
            <td data-label="Darbība"><a href="${member.action.href}" class="${member.action.tone}" style="font-size:0.9em;">${member.action.label}</a></td>
        </tr>
    `).join('');
}

function renderAssociationMemberDetail(data) {
    const wrapper = document.querySelector('[data-member-detail]');
    if (!wrapper) return;
    wrapper.querySelector('[data-bind="memberName"]').textContent = data.memberName;
    wrapper.querySelector('[data-bind="statusLabel"]').textContent = data.statusLabel;
    const tbody = document.querySelector('[data-member-docs]');
    tbody.innerHTML = data.documents.map(doc => `
        <tr>
            <td data-label="Dokuments">${doc.name}</td>
            <td data-label="Statuss">${doc.status}</td>
            <td data-label="Atjaunots">${doc.updated}</td>
            <td data-label="Piezīme">${doc.note}</td>
        </tr>
    `).join('');
}

function renderGCEsgProfile(data) {
    document.querySelectorAll('[data-bind="companyName"]').forEach(el => el.textContent = data.companyName);
    const map = {
        co2: '[data-bind="co2"]',
        recycling: '[data-bind="recycling"]',
        ltifr: '[data-bind="ltifr"]'
    };
    Object.entries(map).forEach(([key, selector]) => {
        const node = document.querySelector(selector);
        if (node) node.textContent = data[key];
    });
    const docList = document.querySelector('[data-esg-docs]');
    if (!docList) return;
    docList.innerHTML = data.documents.map(doc => `
        <li class="search-result">
            <div>
                <strong>${doc.name}</strong><br>
                <small>${doc.status} • Atjaunots ${doc.updated}</small>
            </div>
            <span class="level-tag">${doc.note}</span>
        </li>
    `).join('');
}

function prefillESGForm(data) {
    const form = document.getElementById('esg-form');
    if (!form || !data.formDefaults) return;
    Object.entries(data.formDefaults).forEach(([name, value]) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) input.value = value;
    });
}

function initESGForm(showToast, showModal) {
    const form = document.getElementById('esg-form');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(form);
        const errors = [];

        const co2 = formData.get('co2');
        const recycling = formData.get('recycling');
        const ltifr = formData.get('ltifr');

        resetInputState(form);
        if (!isPositiveNumber(co2)) {
            errors.push('CO₂ emisijām jābūt skaitlim.');
            markInputError(form, 'co2');
        }
        if (!isPositiveNumber(recycling)) {
            errors.push('Pārstrādes procentam jābūt skaitlim.');
            markInputError(form, 'recycling');
        }
        if (!isPositiveNumber(ltifr)) {
            errors.push('LTIFR jābūt skaitlim.');
            markInputError(form, 'ltifr');
        }

        if (errors.length) {
            showToast(errors[0], 'error');
            return;
        }

        showModal({
            title: 'ESG profils iesniegts',
            message: 'Paldies! Validācijas komanda apstiprinās datus un jūs tiksiet pārsūtīts uz Gold paneli.',
            confirmText: 'Turpināt uz Gold',
            onConfirm: () => {
                window.location.href = 'mvu_dashboard_gold.html';
            }
        });
    });
}

function initAssociationActions(showModal, showToast) {
    document.querySelectorAll('[data-action="approve-member"]').forEach(btn => {
        btn.addEventListener('click', () => {
            showModal({
                title: 'Apstiprināt biedru',
                message: 'Vai apstiprināt un paaugstināt biedra statusu uz Silver+?',
                confirmText: 'Apstiprināt',
                onConfirm: () => showToast('Biedrs apstiprināts un redzams GC katalogā.', 'success')
            });
        });
    });

    document.querySelectorAll('[data-action="request-more"]').forEach(btn => {
        btn.addEventListener('click', () => {
            showModal({
                title: 'Pieprasīt labojumus',
                message: 'Biedram tiks nosūtīts pieprasījums iesniegt trūkstošos dokumentus.',
                confirmText: 'Nosūtīt pieprasījumu',
                onConfirm: () => showToast('Pieprasījums nosūtīts.', 'info')
            });
        });
    });
}

function initInviteButton(showModal) {
    const btn = document.getElementById('invite-btn');
    if (!btn) return;
    btn.addEventListener('click', e => {
        e.preventDefault();
        showModal({
            title: 'Uzaicinājums nosūtīts',
            message: 'Būve ABC saņems uzaicinājumu piedalīties projektā ar pilnu ESG caurspīdību.',
            confirmText: 'Labi'
        });
    });
}

function resetInputState(form) {
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function markInputError(form, name) {
    const input = form.querySelector(`[name="${name}"]`);
    if (input) input.classList.add('input-error');
}

function isPositiveNumber(value) {
    if (value === null || value === undefined || value === '') return false;
    const numeric = parseFloat(String(value).replace(',', '.').replace(/[^\d.-]/g, ''));
    return !isNaN(numeric);
}

function createToast() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
    let timeout;
    return function showToast(message, type = 'info') {
        toast.textContent = message;
        toast.className = `toast ${type === 'info' ? '' : type}`;
        requestAnimationFrame(() => toast.classList.add('show'));
        clearTimeout(timeout);
        timeout = setTimeout(() => toast.classList.remove('show'), 2500);
    };
}

function createModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <h3 data-modal-title></h3>
            <p data-modal-message></p>
            <div class="modal-actions">
                <button class="btn btn-secondary" data-modal-close>Aizvērt</button>
                <button class="btn btn-primary" data-modal-confirm>Turpināt</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const titleNode = overlay.querySelector('[data-modal-title]');
    const messageNode = overlay.querySelector('[data-modal-message]');
    const closeBtn = overlay.querySelector('[data-modal-close]');
    const confirmBtn = overlay.querySelector('[data-modal-confirm]');

    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('active');
    });

    return function showModal({ title, message, confirmText = 'Labi', onConfirm }) {
        titleNode.textContent = title;
        messageNode.textContent = message;
        confirmBtn.textContent = confirmText;

        confirmBtn.onclick = () => {
            overlay.classList.remove('active');
            if (onConfirm) onConfirm();
        };

        overlay.classList.add('active');
    };
}
