window.initHeaderLogic = function () {
    console.log("Initializing Header Logic...");

    // 1. 高亮当前菜单
    highlightCurrentPage();

    // 2. 初始化主题切换
    setupThemeToggle();

    // 3. 初始化微信弹窗
    setupWechatModal();

    // 4. 初始化移动端菜单
    setupMobileMenu();
}


// --- 具体的功能函数 ---

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        // 兼容 / 和 /index.html
        if (href === currentPath ||
            (currentPath === '/' && href === '/index.html') ||
            (currentPath.endsWith('/') && href === 'index.html')) {
            link.classList.add('text-primary-500', 'dark:text-magenta-400', 'font-medium');
        }
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    // 初始化主题状态
    if (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (themeToggle) {
        // 先解绑旧事件防止重复，再绑定新事件
        const newBtn = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newBtn, themeToggle);

        newBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme',
                document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            );
        });
    }
}

function setupWechatModal() {
    const wechatIcon = document.getElementById('wechatIcon');
    const wechatModal = document.getElementById('wechatModal');
    const closeModal = document.getElementById('closeModal');

    // 如果这些元素存在 (wechatModal 通常在 index.html 底部，wechatIcon 在 header.html)
    if (wechatIcon && wechatModal && closeModal) {

        // 桌面端图标点击
        wechatIcon.onclick = function (e) {
            e.preventDefault();
            wechatModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        // 关闭按钮
        closeModal.onclick = function () {
            wechatModal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        // 点击背景关闭
        wechatModal.onclick = function (e) {
            if (e.target === wechatModal) {
                wechatModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        };

        // ESC 关闭
        document.onkeydown = function (e) {
            if (e.key === 'Escape' && !wechatModal.classList.contains('hidden')) {
                wechatModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        };
    }
}

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // 汉堡菜单
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.onclick = function () {
            mobileMenu.classList.toggle('hidden');
        };
    }

    // 移动端子菜单 (Design)
    const mobileDesignDropdown = document.getElementById('mobileDesignDropdown');
    const mobileDesignMenu = document.getElementById('mobileDesignMenu');
    if (mobileDesignDropdown && mobileDesignMenu) {
        mobileDesignDropdown.onclick = function () {
            mobileDesignMenu.classList.toggle('hidden');
            const arrow = mobileDesignDropdown.querySelector('i');
            if (arrow) arrow.classList.toggle('fa-chevron-up');
        };
    }

    // 移动端子菜单 (Code)
    const mobileCodeDropdown = document.getElementById('mobileCodeDropdown');
    const mobileCodeMenu = document.getElementById('mobileCodeMenu');
    if (mobileCodeDropdown && mobileCodeMenu) {
        mobileCodeDropdown.onclick = function () {
            mobileCodeMenu.classList.toggle('hidden');
            const arrow = mobileCodeDropdown.querySelector('i');
            if (arrow) arrow.classList.toggle('fa-chevron-up');
        };
    }

    // 移动端联动逻辑
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.onclick = function () {
            // 触发桌面端按钮的点击逻辑，复用代码
            const mainBtn = document.getElementById('themeToggle');
            if (mainBtn) mainBtn.click();
        };
    }

    const mobileWechatIcon = document.getElementById('mobileWechatIcon');
    if (mobileWechatIcon) {
        mobileWechatIcon.onclick = function () {
            const mainIcon = document.getElementById('wechatIcon');
            if (mainIcon) mainIcon.click();
        }
    }
}


// ==========================================
// 第二部分：页面静态内容逻辑 (DOM Ready)
// ==========================================
document.addEventListener('DOMContentLoaded', function () {

    // 1. Scroll Reveal (滚动显现动画)
    const elements = document.querySelectorAll('.scroll-reveal');
    if (elements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    // 可选：移出视野后是否移除类 (让动画重复播放)
                    // entry.target.classList.remove('is-visible'); 
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        elements.forEach(el => observer.observe(el));
    }

    // 2. Flip Card (翻转卡片)
    const flipCard = document.querySelector('.flip-card-container');
    if (flipCard) {
        const cardFront = document.querySelector('.flip-card-front');
        const svgLogo = cardFront ? cardFront.querySelector('svg') : null;

        // Logo 呼吸动画
        if (svgLogo && typeof svgLogo.animate === 'function') {
            svgLogo.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.05)' },
                { transform: 'scale(1)' }
            ], {
                duration: 2000,
                iterations: Infinity
            });
        }

        // 点击翻转
        flipCard.addEventListener('click', function () {
            const innerCard = this.querySelector('.flip-card');
            if (innerCard) innerCard.classList.toggle('clicked');
        });

        // 键盘支持
        flipCard.setAttribute('tabindex', '0');
        flipCard.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const innerCard = this.querySelector('.flip-card');
                if (innerCard) innerCard.classList.toggle('clicked');
            }
        });
    }

    // 3. 窗口大小改变时自动关闭移动端菜单
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});