async function loadComponent(elementId, filePath, callback) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // 如果有回调函数，执行它 (例如高亮当前导航、初始化聊天框)
        if (callback) callback();
    } catch (error) {
        console.error('Component Loader Error:', error);
    }
}

// 自动高亮当前页面的导航链接
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('nav a');
    
    links.forEach(link => {
        // 简单判断：如果链接地址包含当前路径
        if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
            link.classList.add('text-primary-500', 'dark:text-magenta-400'); // 添加高亮样式
        }
    });
}